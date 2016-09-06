import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TiposSanguineosPipe } from '../../pipes/format-tipos-sanguineos/format-tipos-sanguineos-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';

@Component({
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html',
  pipes: [ TiposSanguineosPipe, TimeAgoPipe]
})
export class DetallesSolicitudPage {

	// Variables de la clase
	private solicitudSeleccionada: SolicitudModel;

	constructor(private nav: NavController, navParams: NavParams) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');
  	}

    // Inicializa el mapa cuando el DOM ya esta listo
  	ionViewDidEnter(){
        
        // TODO: obtener las coordenadas de la solicitud
        // ---------------------------------------------
        let geocoder = new google.maps.Geocoder();

        let mapOptions = {
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        let map = new google.maps.Map(document.getElementById("map"), mapOptions);

        let direccion = `${ this.solicitudSeleccionada.getDireccion() }, ${ this.solicitudSeleccionada.getCiudad().getNombre() } ${ this.solicitudSeleccionada.getProvincia().getNombre() }`;

        geocoder.geocode({'address': direccion}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            
            // Centramos el mapa en las coordenadas del lugar
            map.setCenter(results[0].geometry.location);

            // Agregamos un marcador al luget
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });

          } else {
            // TODO: manejar el caso de error
            // ------------------------------
            //valert('Geocode was not successful for the following reason: ' + status);
          }
        });
    }

    // Obtiene el listado de grupos y factores que se necesitan
    public getTiposSanguineosBuscados(): Array<string> {
      return DonacionesHelper.puedeRecibirDe(this.solicitudSeleccionada.getGrupoSanguineo().getId(), 
                                             this.solicitudSeleccionada.getFactorSanguineo().getId());
    }

    // Obtiene el factor y grupo sanguineo del usuario
    public getDescripcionTipoSanguineo(): string {
      // TODO: reemplazar por los datos del usuario si existen
      // -----------------------------------------------------
      return 'A+';
    }
  }


