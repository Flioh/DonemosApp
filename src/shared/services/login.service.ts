// Referencias de Angular
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// Referencias de Ionic
import { Storage } from '@ionic/storage';

// Referencias de Auth0
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

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
  
  private refreshSubscription: any;
  public user: Object;
  private idToken: string;
  
  constructor(private authHttp: AuthHttp, public zoneImpl: NgZone) {

    this.storage = new Storage();

    this.jwtHelper = new JwtHelper();
    this.auth0 = new Auth0({clientID: 'DY8adElNXTxdjzEpdWl3E6VL6XkuYog1', domain: 'donemos.auth0.com' });
    this.lock = new Auth0Lock('DY8adElNXTxdjzEpdWl3E6VL6XkuYog1', 'donemos.auth0.com', {
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

    this.lock.on('authenticated', authResult => {
      this.storage.set('id_token', authResult.idToken);
      this.idToken = authResult.idToken;

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.storage.set('profile', JSON.stringify(profile));
        this.user = profile;
      
        console.log(this.user);

      });

      this.lock.hide();

      this.storage.set('refresh_token', authResult.refreshToken);

      this.zoneImpl.run(() => this.user = authResult.profile);
      
      // Schedule a token refresh
      this.scheduleRefresh();

    });
  }

  public loadExistingData() {
    // Check if there is a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });
  }

  public authenticated() { 
    return tokenNotExpired('id_token', this.idToken);
  }
  
  public login() {
    // Show the Auth0 Lock widget
    this.lock.show();
  }
  
  public logout() {
    this.storage.remove('profile');
    this.storage.remove('id_token');
    this.idToken = null;
    this.storage.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
    // Unschedule the token refresh
    this.unscheduleRefresh();
  }
  
  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    let source = Observable.of(this.idToken).flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
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
  
  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;
          
          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });
      
       // Once the delay time from above is
       // reached, get a new JWT and schedule
       // additional refreshes
       source.subscribe(() => {
         this.getNewJwt();
         this.scheduleRefresh();
       });
    }
  }
  
  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.storage.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.storage.set('id_token', delegationRequest.id_token);
        this.idToken = delegationRequest.id_token;
      });
    }).catch(error => {
      console.log(error);
    });
    
  }
}