import { SolicitudModel } from '../solicitud-model/solicitud-model';
import { Injectable } from '@angular/core';

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