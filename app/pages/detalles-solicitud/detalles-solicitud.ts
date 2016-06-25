import {Component} from '@angular/core';
import {NavController, NavParams, Alert} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html',
})
export class DetallesSolicitudPage {

	// Variables de la clase
	solicitudSeleccionada: any;

	constructor(private nav: NavController, navParams: NavParams) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');
  	}
  }


