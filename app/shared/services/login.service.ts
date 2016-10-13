// Referencias de Angular
import { Injectable, NgZone } from '@angular/core';

// Referencias de Ionic
import { Events, Storage, LocalStorage } from 'ionic-angular';

// Referencias de JWT
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

// Referencias de RxJS
import { Observable } from 'rxjs/Rx';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

// Declaraciones para evitar warnings de typescript
declare var Auth0: any;
declare var Auth0Lock: any;

export interface PerfilUsuarioModel {
    picture: string;
    name: string;
}

@Injectable()
export class LoginService {

    private auth0: any;
    private lock: any;
    private jwtHelper: JwtHelper;
    private refreshSubscription: any;
    
    private local: Storage;
    
    private user: Object;
  
    constructor(private authHttp: AuthHttp, 
                private config: AppConfig,
                private eventsCtrl: Events, 
                private zoneImpl: NgZone) {
        
        // Inicializamos el storage
        this.local = new Storage(LocalStorage);

        this.jwtHelper = new JwtHelper();

        if(typeof Auth0 === 'function' && typeof Auth0Lock === 'function') {
            // Creamos los objetos necesarios para manejar el inicio de sesion
            this.auth0 = new Auth0({clientID: config.clientId, domain: config.domain});
            this.lock = new Auth0Lock(config.clientId, config.domain, {
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
                    // logo: 'https://example.com/assets/logo.png',
                    primaryColor: '#f32d2e'
                } 
            });
        }

        // Buscamos si el perfil esta guardado
        this.local.get('profile').then(profile => {
            
            // Inicializamos los datos del usuario
            this.user = JSON.parse(profile);

            // Enviamos un evento para que otros componentes sepan que el usuario inicio sesion         
            this.eventsCtrl.publish('user:login');
        }).catch(error => {
            // TODO: Manejar el error
            // ----------------------
            console.log(error);
        });

        if(this.lock) {
            // Manejamos el evento del login del usuario
            this.lock.on('authenticated', authResult => {

                // Enviamos un evento para que otros componentes sepan que el usuario inicio sesion
                this.eventsCtrl.publish('user:login');

                this.local.set('id_token', authResult.idToken);

                // Obtenemos la informacion del perfil
                this.lock.getProfile(authResult.idToken, (error, profile) => {
                    if (error) {
                        // TODO: Manejar el error
                        // ----------------------
                        alert(error);
                        return;
                    }

                    profile.user_metadata = profile.user_metadata || {};
                    
                    // Guardamos la informacion del usuario
                    this.local.set('profile', JSON.stringify(profile));
                    this.user = profile;                
                });

                // Almacenamos el refresh token
                this.local.set('refresh_token', authResult.refreshToken);
                this.zoneImpl.run(() => this.user = authResult.profile);
            });
        }

        
    }
  
    // Método que indica si el usuario esta logueado o no
    public authenticated() {
        // Chequea si hay un token aun no expirado
        return tokenNotExpired();
    }

    // Método que muestra las opciones disponibles para loguearse
    public mostrarLogin() {
        this.lock.show();    
    }

    // Método que oculta las opciones disponibles para loguearse
    public ocultarLogin() {
        // Hide the Auth0 Lock widget
        this.lock.hide();
    }

    // Método que desloguea al usuario logueado
    public logout() {

        // Notificamos a los subscriptores que el usuario se esta por desloguear
        this.eventsCtrl.publish('user:logout');

        // Damos un poco de tiempo para que se cierre el menu antes de cerrar la sesion del usuario
        setTimeout(() => {
            // Borramos los datos del perfil y de la sesion
            this.local.remove('profile');
            this.local.remove('id_token');
            this.local.remove('refresh_token');
            this.zoneImpl.run(() => {

                // Reseteamos los datos del usuario
                this.user = null;

                // Ya no sera necesario renovar el token
                this.unscheduleRefresh();         
            });
        }, 1000);
    }

    // Método que permite renovar el token cuando el mismo expire
    public scheduleRefresh() {       
        let source = this.authHttp.tokenStream.flatMap(
            token => {
                // El delay es igual a la diferencia entre el tiempo de expiracion
                // y el tiempo en el que fue proporcionado
                let jwtIat = this.jwtHelper.decodeToken(token).iat;
                let jwtExp = this.jwtHelper.decodeToken(token).exp;
                let iat = new Date(0);
                let exp = new Date(0);
                
                let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
                
                return Observable.interval(delay);
            });
            
        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt();
        });
    }

    // Método que obtiene el JWT token e inicializa su renovación
    public startupTokenRefresh() {
        if (this.authenticated()) {
            let source = this.authHttp.tokenStream.flatMap(
                token => {
                    // Usamos el tiempo de expiracion para generar un delay 
                    // luego del cual sera renovado
                    let now: number = new Date().valueOf();
                    let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
                    
                    let exp: Date = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    
                    let delay: number = exp.valueOf() - now;
                    
                    // Usamos el delay para renovar el token cuando sea necesario
                    return Observable.timer(delay);
                });
            
            // Una vez que venza el delay de arriba, obtenemos un nuevo JWT
            // y programamos su renovacion
            source.subscribe(() => {
                this.getNewJwt();
                this.scheduleRefresh();
            });
        }
    }

    // Método que resetea la subscripcion para renovar el JWT token
    public unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    // Método que obtiene un nuevo JWT token
    public getNewJwt() {
        // Obtenemos un nuevo JWT desde Auth0 usando el refresh token
        // almacenado en el local storage
        this.local.get('refresh_token').then(token => {
            this.auth0.refreshToken(token, (err, delegationRequest) => {
                if (err) {
                    alert(err);
                }
                this.local.set('id_token', delegationRequest.id_token);
            });
        }).catch(error => {
            // TODO: manejar el error
            // ----------------------
            console.log(error);
        });
    }

    // Método que devuelve informacion del usuario logueado
    public getUser(): PerfilUsuarioModel {
        return <PerfilUsuarioModel>this.user;
    }
}