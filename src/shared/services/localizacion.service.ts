// Referencias de Angular
import { Injectable } from '@angular/core';

// Referencias de Ionic
import { Platform } from 'ionic-angular';

// Plugins de Ionic Native
import { Geolocation } from 'ionic-native';

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
  public mostrarRuta(direccion: string, nombreInstitucion: string) {            
    // Primero obtenemos las coordenadas
    return this.obtenerCoordenadas(direccion, nombreInstitucion).then((coordenadas) => {
      // Mostramos el lugar en la aplicacion que corresponda
      this.abrirAplicacionDeMapas(coordenadas, nombreInstitucion);
    });
  }

  // Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
  public mostrarRutaHaciaCoordenadas(coordenadas: string, nombreInstitucion: string) {            
    
    // Mostramos el lugar en la aplicacion que corresponda
    this.abrirAplicacionDeMapas(coordenadas, nombreInstitucion);
  }

  // Método que debuelve las coordenadas actuales del usuario
  public obtenerCoordenadasUsuario(): Promise<any> {
    return Geolocation.getCurrentPosition();
  }

  public obtenerCoordenadasUsuarioCordovaPlugin(): Promise<any> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => { resolve(posicion); }, 
        (error) => { resolve(null); },
        { timeout: 2000 });
    },);
  }
}