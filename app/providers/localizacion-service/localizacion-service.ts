import { Injectable } from '@angular/core';
import { SqlStorage, Storage, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

declare var google: any;

@Injectable()
export class LocalizacionService {

  private geocoder: any;

	constructor(private platform: Platform) {
    // Inicializamos el servicio de geo codificacion
    this.geocoder = google ? new google.maps.Geocoder() : null;
	}

	// Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
  public mostrarRuta(direccion: string, nombreInstitucion: string): void {            

    this.geocoder.geocode({'address': direccion}, (results, status)  => {
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
    });
  }
}