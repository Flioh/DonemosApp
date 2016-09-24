import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var Connection: any;

@Injectable()
export class ConnectivityService {
 
  private onDevice: boolean;

  constructor(private platform: Platform){
    this.onDevice = this.platform.is('ios') || this.platform.is('android');
  }
 
  isOnline() {
    if(this.onDevice && navigator['connection']){
 
      let networkState = navigator['connection'].type;
 
      return networkState !== Connection.NONE;
 
    } else {
      return navigator.onLine;      
    }
  }
 
  isOffline(){
    if(this.onDevice && navigator['connection']){
 
      let networkState = navigator['connection'].type;
 
      return networkState === Connection.NONE;
 
    } else {
      return !navigator.onLine;     
    }
  }

  
}