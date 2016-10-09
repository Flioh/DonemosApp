import { Events } from 'ionic-angular';
import { DatosRemotosService } from '../../providers/datos-remotos/datos-remotos';

export class BasePage {

  constructor(public eventsCtrl: Events, public datosRemotosService: DatosRemotosService){

  }

  ionViewDidEnter(){
    this.eventsCtrl.publish('page:load');
  }

  public iniciarTimer(nombreMetodo: string): void {
    if(this.datosRemotosService.modoDebugActivado()) {
      console.time(nombreMetodo);
    }   
  }

  public detenerTimer(nombreMetodo: string): void {
    if(this.datosRemotosService.modoDebugActivado()) {
      console.timeEnd(nombreMetodo);
    }   
  }

}