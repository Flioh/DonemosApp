// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { SolicitudModel } from './solicitud.model';

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