// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { SolicitudModel } from './solicitud.model';

@Injectable()
export class ResumenSolicitudModel {

  constructor(public solicitud: SolicitudModel, 
              public descripcionTiposSanguineos: string,
              public esCompatibleConUsuario: boolean) { }
}