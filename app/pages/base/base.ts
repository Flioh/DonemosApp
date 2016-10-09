import { Events } from 'ionic-angular';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';

export class BasePage {

  constructor(public eventsCtrl: Events, public remoteDataService: RemoteDataService){

  }

  ionViewDidEnter(){
    this.eventsCtrl.publish('page:load');
  }

  public iniciarTimer(nombreMetodo: string): void {
    if(this.remoteDataService.modoDebugActivado()) {
      console.time(nombreMetodo);
    }   
  }

  public detenerTimer(nombreMetodo: string): void {
    if(this.remoteDataService.modoDebugActivado()) {
      console.timeEnd(nombreMetodo);
    }   
  }

}