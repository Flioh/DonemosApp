import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
  
})
export class NuevaSolicitudPage {

	ocultarIconoNuevaSolicitud: boolean = true;

	constructor(public nav: NavController) {
	}

	ionViewLoaded() {
	  // Antes de ingresar, verificar si hay información no guardada
	}

	ionViewWillLeave() {
	  // Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado;
	}
}
