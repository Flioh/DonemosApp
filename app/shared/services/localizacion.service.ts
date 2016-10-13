// Referencias de Angular
import { Injectable } from '@angular/core';

// Referencias de Ionic
import { SqlStorage, Storage, Platform } from 'ionic-angular';

// Referencias de RxJS
import { Observable } from 'rxjs/Observable';

// Declaracion para evitar warnings de Typescript
declare var google: any;

@Injectable()
export class LocalizacionService {

  private geocoder: any;

	constructor(private platform: Platform) {
    // Usamos el servicio de geolocalizacion de google si esta disponible
    this.geocoder = google && google.maps ? new google.maps.Geocoder() : null;
	}

  // Método que permite setear otro servicio de geolocalizacion
  public setServicioGeolocalizacion(servicioGeolocalizacion: any) {
    this.geocoder = servicioGeolocalizacion;
  }

  // Método que obtiene las coordenadas de una direccion enviada como parametro
  public obtenerCoordenadas(direccion: string, nombreInstitucion: string): Promise<string> {
    let coordenadas = '';

    return new Promise((resolve) => {
      if(this.geocoder) {
        this.geocoder.geocode({'address': direccion}, (results, status)  => {
          if (status === "OK") {
            if(results && results[0]) {
              // Obtenemos las coordenadas
              coordenadas = results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
            }
            // Resolvemos la promesa con las coordenadas
            resolve(coordenadas);  
          
          } else {
            resolve(coordenadas);
          }
        });
      } else {
        resolve(coordenadas);
      }
    });
  }

  // Método que abre la aplicacion externa de mapas correspondiente
  public abrirAplicacionDeMapas(coordenadasLugar: string, nombreLugar: string): void {
    if(this.platform.is('ios')){
      window.open('maps://?q=' + coordenadasLugar, '_system');
    } else {
      let etiqueta = encodeURI(nombreLugar);
      window.open('geo:0,0?q=' + coordenadasLugar + '(' + etiqueta + ')', '_system');
    }
  }

	// Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
  public mostrarRuta(direccion: string, nombreInstitucion: string): void {            

    // Primero obtenemos las coordenadas
    this.obtenerCoordenadas(direccion, nombreInstitucion).then((coordenadas) => {

      // Mostramos el lugar en la aplicacion que corresponda
      this.abrirAplicacionDeMapas(coordenadas, nombreInstitucion);

    });
  }
}