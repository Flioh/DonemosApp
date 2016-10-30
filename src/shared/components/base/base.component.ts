// Objeto de configuracion
import { AppConfig } from '../../app-config';

export class BasePage {

  private config: any;

  constructor(){ 
    this.config = new AppConfig();
  }

  // Metodo que envia un evento al entrar en una pagina
  public ionViewDidEnter(){
    //this.eventsCtrl.publish('page:load');
  }
}