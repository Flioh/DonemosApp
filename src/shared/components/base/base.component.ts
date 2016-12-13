// Objeto de configuracion
import { AppConfig } from '../../app-config';

export class BasePage {

	public config: any;

	constructor(){ 
		this.config = new AppConfig();
	}

	// Método que envia informacion del error a la dashboard de Bugsnag
	public procesarError(nombreExcepcion: string,
		nombreMetodo: string,
		componente: any,
		severidad: string,
		descripcion?: string,
		objetoError?: any) {

		// Enviamos el error a nuestra dashboard de Bugsnag
		if(objetoError)	{
			Bugsnag.notifyException(objetoError, nombreExcepcion, { 'metodo': nombreMetodo, 'pagina': componente, 'descripcion': descripcion }, severidad);
		} else {
			Bugsnag.notify(nombreExcepcion, descripcion, { 'metodo': nombreMetodo, 'pagina': componente, }, severidad);
		}
	}
}