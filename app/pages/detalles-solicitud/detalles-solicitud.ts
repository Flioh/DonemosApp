import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TiposSanguineosPipe } from '../../pipes/format-tipos-sanguineos/format-tipos-sanguineos-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';

@Component({
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html',
  pipes: [ TiposSanguineosPipe, TimeAgoPipe]
})
export class DetallesSolicitudPage {

	// Variables de la clase
	solicitudSeleccionada: any;

	constructor(private nav: NavController, navParams: NavParams) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');
  	}

    // Inicializa el mapa cuando el DOM ya esta listo
  	ionViewDidEnter(){
        let latLng = new google.maps.LatLng(43.458937999999996, -3.820382);               

        let mapOptions = {
            center: latLng,
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        let map = new google.maps.Map(document.getElementById("map"), mapOptions);

        let marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: map.getCenter()
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


