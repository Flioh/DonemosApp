// Referencias de Angular
import { Injectable } from '@angular/core';

// Referencias de Observables
import { Observable } from 'rxjs/Observable';

// Referencias de Angular
import { Platform, Events } from 'ionic-angular';

// Declaracion para evitar warnings de Typescript
declare var Connection: any;

@Injectable()
export class ConectividadService {
 
  private esMovil: boolean;

  public conexion: Observable<boolean>;
  public conexionObserver: any;

  constructor(private platform: Platform,
              public eventsCtrl: Events) {
    this.esMovil = this.platform.is('ios') || this.platform.is('android');

    // Creamos el observable
    this.conexionObserver = null;
    this.conexion = Observable.create(observer => {
        this.conexionObserver = observer;
    });

  }
 
  // Método que devuelve true si hay conexion a internet
  public hayConexion():boolean {
    if(this.esMovil && navigator['connection']){
      return navigator['connection']['type'] !== Connection.NONE;
    } else {
      return navigator.onLine;      
    }
  }
 
  // Método que devuelve true si no hay conexion a internet
  public noHayConexion(): boolean {
    if(this.esMovil && navigator['connection']){
      return navigator['connection']['type'] === Connection.NONE;
    } else {
      return !navigator.onLine;     
    }
  }

  // Método que actualiza el estado de la conexion y notifica a todos los subscriptores
  public actualizarEstadoConexion(hayConexion: boolean) {
    this.conexionObserver.next(hayConexion);
  }
  
}