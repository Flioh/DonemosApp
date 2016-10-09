import { SolicitudModel } from '../solicitud/solicitud';
import { Injectable } from '@angular/core';

@Injectable()
export class ResumenSolicitudModel {

  constructor(private solicitud: SolicitudModel, private descripcionTiposSanguineos: string) {

  }

  public getSolicitud(): SolicitudModel {
  	return this.solicitud;
  }

  public getDescripcionTiposSanguineos(): string {
  	return this.descripcionTiposSanguineos;
  }

  public setDescripcionTiposSanguineos(descripcionTiposSanguineos): void {
  	this.descripcionTiposSanguineos = descripcionTiposSanguineos;
  }
}