import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Network } from 'ionic-native';

@Injectable()
export class ConnectivityService {
 
  onDevice: boolean;

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