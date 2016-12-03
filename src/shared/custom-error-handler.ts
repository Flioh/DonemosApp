// Referencias de Angular
import { Injectable, ErrorHandler } from '@angular/core';

// Referencias de Ionic
import { App} from 'ionic-angular';

// Paginas y componentes
import { ErrorPage } from './components/error/error.component';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

	constructor(private app: App) {}

	// Método que maneja cualquier error que ocurra en la aplicación
	handleError(error) {
		
		// Enviamos el error a nuestra dashboard usando Bugsnag
		Bugsnag.notifyException(error);

		let navCtrl = this.app && this.app.getActiveNav();

		/*
			if(navCtrl) {
				// Intentamos redireccionar al usuario a la pagina de error
				navCtrl.setRoot(ErrorPage, { 'error': error });
			} else {
				// Si no se puede acceder al controlador de navegacion, simplemente mostramos un alert con el mensaje de error.
				alert("Ha ocurrido un error. Hemos enviado información del mismo a nuestro equipo de desarrollo, por lo que lo solucionaremos a la brevedad. Muchas gracias.")
			}
		*/

	}	
}