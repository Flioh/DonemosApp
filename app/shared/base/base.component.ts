// Referencias de Angular
import { Events } from 'ionic-angular';

export class BasePage {

  constructor(public eventsCtrl: Events){ }

  // Metodo que envia un evento al entrar en una pagina
  public ionViewDidEnter(){
    this.eventsCtrl.publish('page:load');
  }

  // Metodo que inicia el timer para un metodo dado
  public iniciarTimer(nombreMetodo: string): void {

  }

  // Metodo que detiene el timer para un metodo dado
  public detenerTimer(nombreMetodo: string): void {
  }

}