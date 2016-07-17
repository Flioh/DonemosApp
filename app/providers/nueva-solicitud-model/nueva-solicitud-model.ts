import {Injectable} from '@angular/core';

@Injectable()
export class NuevaSolicitudModel {

  private solicitudID: number;
  private usuarioID: number;
  private fechaCreacion: Date;
  private estaVigente: boolean;
  private provinciaID: number;
  private localidadID: number;
  private grupoSanguineoID: number;
  private factorSanguineoID: number;
  private cantidadDadores: number;
  private lugar: string;
  private direccion: string;
  private horario: string;
  private datosAdicionales: string;

  constructor(obj) {
    this.fechaCreacion = new Date();
    this.estaVigente = true;

    // Si recibimos un objeto, copiamos sus propiedades
    for (var prop in obj) this[prop] = obj[prop];
  }

  public getSolicitudID(): number {
    return this.solicitudID;
  }

  public getUsuarioID(): number {
    return this.usuarioID;
  }

  public getFechaCreacion(): Date {
    return this.fechaCreacion;
  }

  public getEstaVigente(): boolean {
    return this.estaVigente;
  }

  public getProvinciaID(): number {
    return this.provinciaID;
  }

  public getLocalidadID(): number {
    return this.localidadID;
  }

  public getGrupoSanguineoID(): number {
    return this.grupoSanguineoID;
  }

  public getFactorSanguineoID(): number {
    return this.factorSanguineoID;
  }

  public getCantidadDadores(): number {
    return this.cantidadDadores;
  }

  public getLugar(): string {
    return this.lugar;
  }

  public getDireccion(): string {
    return this.direccion;
  }

  public getHorario(): string {
    return this.horario;
  }

  public getDatosAdicionales(): string {
    return this.datosAdicionales;
  }

}

