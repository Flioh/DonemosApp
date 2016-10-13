// Referencias de Angular
import { Injectable } from '@angular/core';

// Referencias de Angular
import { Platform } from 'ionic-angular';

// Declaracion para evitar warnings de Typescript
declare var Connection: any;

@Injectable()
export class ConectividadService {
 
  private esMovil: boolean;

  constructor(private platform: Platform){
    this.esMovil = this.platform.is('ios') || this.platform.is('android');
  }
 
  // Método que devuelve true si hay conexion a internet
  public hayConexion():boolean {
    if(this.esMovil && navigator.connection){
      return navigator.connection.type !== Connection.NONE;
    } else {
      return navigator.onLine;      
    }
  }
 
  // Método que devuelve true si no hay conexion a internet
  public noHayConexion(): boolean{
    if(this.esMovil && navigator.connection){
      return navigator.connection.type === Connection.NONE;
    } else {
      return !navigator.onLine;     
    }
  }
  
}