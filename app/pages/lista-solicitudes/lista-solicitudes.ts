import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';

import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';

import { SolicitudItem } from '../../directives/solicitud-item/solicitud-item';

import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
  directives: [SolicitudItem]
})
export class ListaSolicitudesPage {

  solicitudes: Array<NuevaSolicitudModel>;

  constructor(private nav: NavController, 
              private loadingCtrl: LoadingController, 
              private dataService: RemoteDataService) {
    
    this.solicitudes = [];

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    this.dataService.obtenerSolicitudes().then((solicitudesObj) => { 
      for(let i = 0; i < solicitudesObj.length; i++) {
        this.solicitudes.push(new NuevaSolicitudModel(solicitudesObj[i]));
      }

      // Oculta el mensaje de espera
      loadingPopup.dismiss();

    });    
  }

  abrirDetalles(event) {
    this.nav.push(DetallesSolicitudPage, {
      // Obtenemos la solicitud del evento
      unaSolicitud: event.value
    }, { animate: true, direction: 'forward' });
  }

  nuevaSolicitud(): void {
    this.nav.setRoot(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
  }
}
