import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';

@Component({
	/* This should not be done anymore */
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html'
})
export class DetallesSolicitudPage {

	// Variables de la clase
	solicitudSeleccionada: any;

	constructor(private nav: NavController, navParams: NavParams) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');
  	}

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

  	nuevaSolicitud(): void {
		this.nav.setRoot(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
    }
  }


