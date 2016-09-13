import { Injectable } from '@angular/core';
import { SolicitudModel } from '../solicitud-model/solicitud-model';

@Injectable()
export class SolicitudItemModel {

  constructor(private solicitud: SolicitudModel, private descripcionTiposSanguineos: string) {

  }

  public getSolicitud(): SolicitudModel {
  	return this.solicitud;
  }

  public getDescripcionTiposSanguineos(): string {
  	return this.descripcionTiposSanguineos;
  }
}