// Referencias de Angular
import { Events } from 'ionic-angular';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

export class BasePage {

  constructor(public eventsCtrl: Events, public config: AppConfig){ }

  // Metodo que envia un evento al entrar en una pagina
  public ionViewDidEnter(){
    this.eventsCtrl.publish('page:load');
  }

  // Metodo que inicia el timer para un metodo dado
  public iniciarTimer(nombreMetodo: string): void {
    if(this.config.modoDebug) {
      console.time(nombreMetodo);
    }   
  }

  // Metodo que detiene el timer para un metodo dado
  public detenerTimer(nombreMetodo: string): void {
    if(this.config.modoDebug) {
      console.timeEnd(nombreMetodo);
    } 
  }

}