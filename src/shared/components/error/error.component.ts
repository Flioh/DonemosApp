// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController, NavParams } from 'ionic-angular';

// Paginas y componentes
import { ListaSolicitudesPage } from '../../../components/solicitudes/lista-solicitudes/lista-solicitudes.component';

class Error {
	public message: string;
}

@Component({
	selector:'error-page',
	templateUrl: 'error.component.html',
})
export class ErrorPage {

	public descripcion: string;

	constructor(private navCtrl: NavController, private paramCtrl: NavParams) {

		// Obtenemos el objeto error 
		let error : Error = this.paramCtrl.get('error');

		this.descripcion = error ? error.message : '';
	}

	// Método que vuelve al inicio de la aplicación
	public volverAlInicio() {
		this.navCtrl.setRoot(ListaSolicitudesPage);
	}
}
