import { Storage, LocalStorage } from 'ionic-angular';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Events } from 'ionic-angular';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

    private jwtHelper: JwtHelper = new JwtHelper();

    private auth0 = new Auth0({clientID: '4gUa8ibKIj6T8gMUvec3AzxbpirH5rGq', domain: 'donemos.auth0.com'});
    private lock = new Auth0Lock('4gUa8ibKIj6T8gMUvec3AzxbpirH5rGq', 'donemos.auth0.com', {
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

    private local: Storage = new Storage(LocalStorage);
    private refreshSubscription: any;
    private user: Object;
    private zoneImpl: NgZone;
  
    constructor(private authHttp: AuthHttp, public eventsCtrl: Events, zone: NgZone) {
        this.zoneImpl = zone;

        // Check if there is a profile saved in local storage
        this.local.get('profile').then(profile => {
            this.user = JSON.parse(profile);
            this.eventsCtrl.publish('user:login');
        }).catch(error => {
            console.log(error);
        });

        this.lock.on('authenticated', authResult => {

            this.eventsCtrl.publish('user:login');

            this.local.set('id_token', authResult.idToken);

            // Fetch profile information
            this.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error) {
                    // Handle error
                    alert(error);
                    return;
                }

                profile.user_metadata = profile.user_metadata || {};
                this.local.set('profile', JSON.stringify(profile));
                this.user = profile;                
            });

            this.local.set('refresh_token', authResult.refreshToken);
            this.zoneImpl.run(() => this.user = authResult.profile);
        });
    }
  
    public authenticated() {
        // Check if there's an unexpired JWT
        return tokenNotExpired();
    }

    public mostrarLogin() {
        // Show the Auth0 Lock widget
        this.lock.show();    
    }

    public ocultarLogin() {
        // Hide the Auth0 Lock widget
        this.lock.hide();
    }

    public logout() {

        this.eventsCtrl.publish('user:logout');

        // Damos un poco de tiempo para que se cierre el menu antes de
        // cerrar la sesion del usuario
        setTimeout(() => {
            this.local.remove('profile');
            this.local.remove('id_token');
            this.local.remove('refresh_token');
            this.zoneImpl.run(() => {
                this.user = null;

                // Unschedule the token refresh
                this.unscheduleRefresh();         
            });
        }, 1000);
    }

    public scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        let source = this.authHttp.tokenStream.flatMap(
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
            let source = this.authHttp.tokenStream.flatMap(
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
        this.local.get('refresh_token').then(token => {
            this.auth0.refreshToken(token, (err, delegationRequest) => {
                if (err) {
                    alert(err);
                }
                this.local.set('id_token', delegationRequest.id_token);
            });
        }).catch(error => {
            console.log(error);
        });
    }

    public getUser(): Object{
        return this.user;
    }
}