import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DetallesSolicitudPage} from '../detalles-solicitud/detalles-solicitud';

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
})
export class ListaSolicitudesPage {

  solicitudes: Array<{titulo: string, detalle: string}>;

  constructor(private nav: NavController) {
    this.solicitudes = [];

    for(let i = 1; i < 11; i++) {
      this.solicitudes.push({
          titulo: 'Solicitud ' + i,
          detalle: 'Detalles de la solicitud #' + i,
        });
    }
  }

  abrirDetalles(event, unaSolicitud) {
    this.nav.push(DetallesSolicitudPage, {
      unaSolicitud: unaSolicitud
    }, { animate: true, direction: 'forward' });
  }
}
