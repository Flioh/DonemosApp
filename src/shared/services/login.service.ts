// Referencias de Angular
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// Referencias de Ionic
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Referencias de Auth0
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

// Archivo de configuracion
import { AppConfig } from '../app-config';

// Interfaz usada para mostrar los datos del perfil del usuario
export interface PerfilUsuarioModel {
    picture: string;
    name: string;
}

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class LoginService {

  private jwtHelper: JwtHelper;
  private auth0: any;
  private lock: any;

  private storage: Storage;
  
  private renovarSubscripcion: any;
  public user: PerfilUsuarioModel;
  private idToken: string;
  
  constructor(private authHttp: AuthHttp, 
              public zoneImpl: NgZone,
              public config: AppConfig,
              private eventCtrl: Events) {

    this.storage = new Storage();

    // Inicializamos las variables de Auth0
    this.jwtHelper = new JwtHelper();
    this.auth0 = new Auth0({clientID: this.config.authClientId, domain: this.config.authDomain });
    this.lock = new Auth0Lock(this.config.authClientId, this.config.authDomain, {
      auth: {
            redirect: false,
            params: {
                scope: 'openid offline_access',
            }
        },
        allowedConnections: ['google-oauth2', 'facebook', 'twitter'],
        socialButtonStyle: 'small',
        rememberLastLogin: false,
        language: 'es',
        container: 'hiw-login-container',
        languageDictionary: {    
            title: "Iniciar sesión"
        },
        theme: {
            logo: 'assets/images/logo_negro.png',
            primaryColor: '#f32d2e'
        } 
    });

    // Manejamos el evento de autenticacion de Auth0 
    this.lock.on('authenticated', authResult => {
      this.manejarLoginUsuario(authResult);
    });
  }

  // Método que se ejecuta cuando el usuario inicia sesion usando el Lock
  private manejarLoginUsuario(resultadoAuth: any) {
      // Guardamos el token para usarlo luego
      this.storage.set('id_token', resultadoAuth.idToken);
      this.idToken = resultadoAuth.idToken;

      // Obtenemos la informacion del perfil del usuario
      this.lock.getProfile(resultadoAuth.idToken, (error, profile) => {
        if (error) {
          // TODO: manejar error
          // -------------------
          alert(error);
          return;
        }

        // Guardamos el perfil del usuario
        profile.user_metadata = profile.user_metadata || {};
        this.storage.set('profile', JSON.stringify(profile));
        this.user = profile;
        console.log(this.user);
      });

      // Ocultamos las opciones de login
      this.lock.hide();

      // Guardamos el token que usaremos para renovar el JWT
      this.storage.set('refresh_token', resultadoAuth.refreshToken);

      // Actualizamos los datos del usuario
      this.zoneImpl.run(
        () =>  {
          this.user = resultadoAuth.profile;
          this.eventCtrl.publish('login:usuario', true);
      });
      
      // Agendamos una renovacion del token
      this.programarRenovacionToken();
  }

  // Método que busca en el storage si hay datos del perfil del usuario y del token
  public cargarInformacionUsuario() {
    // Buscamos si hay datos del usuario guardados en el storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    // Buscamos tambien si hay un token guardado
    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });
  }

  // Método que verfica si el usuario esta logueado o no
  public estaLogueado() { 
    return tokenNotExpired('id_token', this.idToken);
  }
  
  // Metodo que inicializa las opciones de login
  public inicializarLogin() {

    // Primero verificamos si no hay informacion del usuario
    this.cargarInformacionUsuario();

    // Mostramos el Lock de Auth0
    this.lock.show();
  }
  
  // Método que desloguea al usuario
  public logout() {

    // Borramos los datos del storage
    this.storage.remove('profile');
    this.storage.remove('id_token');
    this.idToken = null;
    this.storage.remove('refresh_token');

    // Reseteamos la informacion del usuario
    this.zoneImpl.run(() => this.user = null);

    // No renovaremos mas el token 
    this.desuscribirRenovacionToken();
  }
  
  // Método que programa una renovacion del token
  public programarRenovacionToken() {
    let source = Observable.of(this.idToken).flatMap(
      token => {
        // El delay a generar es la diferencia entre el tiempo de expiracion
        // y el tiempo en el que el token fue provisto
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);
        
        console.log('IAT: ' + iat);
        console.log('ECP: ' + exp);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
        
        return Observable.interval(delay);
      });
     
    this.renovarSubscripcion = source.subscribe(() => {
      this.getNewJwt();
    });
  }
  
  // Método que inicializa el proceso de renovacion del token
  public inicializarRenovacionToken() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.estaLogueado()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Usamos el tiempo de expiracion para generar un
          // delay en milisegundos
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Usamos el delay para generar la renovacion
          // en el momento adecuado
          return Observable.timer(delay);
        });

       // Una vez que se cumple el tiempo previsto, obtenemos un nuevo
       // token y programamos su renovacion
       source.subscribe(() => {
         this.getNewJwt();
         this.programarRenovacionToken();
       });
    }
  }
  
  // Método que evita la renovacion del token
  public desuscribirRenovacionToken() {
    // Unsubscribe fromt the refresh
    if (this.renovarSubscripcion) {
      this.renovarSubscripcion.unsubscribe();
    }
  }
  
  // Método que obtiene un nuevo token
  public getNewJwt() {
    // Obtenemos un nuevo JWT from Auth0 usando el refresh_token
    this.storage.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          // TODO: manejar error
          // --------------------
          alert(err);
        }

        // Guardamos el nuevo token en el storage
        this.storage.set('id_token', delegationRequest.id_token);
        this.idToken = delegationRequest.id_token;
      });
    }).catch(error => {
      // TODO: manejar error
      // --------------------
      console.log(error);
    });
    
  }
}