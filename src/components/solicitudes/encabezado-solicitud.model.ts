// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { SolicitudModel } from './solicitud.model';

@Injectable()
export class EncabezadoSolicitudModel {

  constructor(public solicitud: SolicitudModel,
              public estaActiva: boolean) { }
}