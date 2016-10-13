// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { SolicitudModel } from './solicitud.model';

@Injectable()
export class ResumenSolicitudModel {

  constructor(private solicitud: SolicitudModel, private descripcionTiposSanguineos: string) {

  }

  // Método que obtiene la solicitud
  public getSolicitud(): SolicitudModel {
  	return this.solicitud;
  }

  // Método que obtiene la descripcion de los tipos sanguineos que se requieren en la solicitud
  public getDescripcionTiposSanguineos(): string {
  	return this.descripcionTiposSanguineos;
  }

  // Método que setea la descripcion de los tipos sanguineos requeridos en la solicitud
  public setDescripcionTiposSanguineos(descripcionTiposSanguineos): void {
  	this.descripcionTiposSanguineos = descripcionTiposSanguineos;
  }
}