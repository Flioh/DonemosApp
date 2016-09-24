import { Injectable } from '@angular/core';
import { SqlStorage, Storage, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NavigationService {

	constructor(private platform: Platform){

	}

	// Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
    public mostrarRuta(direccion: string, nombreInstitucion: string):void {      
      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({'address': direccion}, (results, status)  => {
        if (status === google.maps.GeocoderStatus.OK) {

          let coordenadasInstitucion = results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
          if(this.platform.is('ios')){
            window.open('maps://?q=' + coordenadasInstitucion, '_system');
          } else {
            let label = encodeURI(nombreInstitucion);
            window.open('geo:0,0?q=' + coordenadasInstitucion + '(' + label + ')', '_system');
          }

        } else {
          // TODO: manejar el caso de error
          // ------------------------------
          //valert('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
}