import { Events } from 'ionic-angular';

export class BasePage {

  constructor(public eventsCtrl: Events){

  }

  ionViewDidEnter(){
    this.eventsCtrl.publish('page:load');
  }

  public iniciarTimer(nombreMetodo: string): void {

  }

  public detenerTimer(nombreMetodo: string): void {
  }

}