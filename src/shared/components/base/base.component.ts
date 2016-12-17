// Objeto de configuracion
import { AppConfig } from '../../app-config';

export class BasePage {
	public config: any;
	constructor(){ 
		this.config = new AppConfig();
	}
}