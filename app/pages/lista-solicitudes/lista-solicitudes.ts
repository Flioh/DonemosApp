import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { DataService } from '../../providers/data-service/data-service';

import { SolicitudItem } from '../../components/solicitud-item/solicitud-item';

import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
  directives: [SolicitudItem]
})
export class ListaSolicitudesPage {

  solicitudes: Array<NuevaSolicitudModel>;

  constructor(private nav: NavController, private dataService: DataService) {
    this.solicitudes = [];

    this.dataService.obtenerSolicitudes().then((solicitudesObj) => { 
      for(let i = 0; i < solicitudesObj.length; i++) {
        this.solicitudes.push(new NuevaSolicitudModel(solicitudesObj[i]));
      }
    });    
  }

  abrirDetalles(event) {
    this.nav.push(DetallesSolicitudPage, {
      // Obtenemos la solicitud del evento
      unaSolicitud: event.value
    }, { animate: true, direction: 'forward' });
  }
}
