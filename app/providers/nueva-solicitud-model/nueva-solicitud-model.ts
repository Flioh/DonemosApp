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
  private horaDesde: string;
  private horaHasta: string;
  private datosAdicionales: string;

  constructor(obj?) {
    if(obj) {
      // Si recibimos un objeto, copiamos sus propiedades
      for (var prop in obj) this[prop] = obj[prop];
    } else {
      this.horaDesde = "08:00";
      this.horaHasta = "18:00";
    }
  }

  /* Getters */
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

  public getHoraDesde(): string {
    return this.horaDesde;
  }

  public getHoraHasta(): string {
    return this.horaHasta;
  }

  public getDatosAdicionales(): string {
    return this.datosAdicionales;
  }

  /* Setters */
  public setProvinciaID(id: number): void {
    this.provinciaID = id;
  }

  public setLocalidadID(id: number): void {
    this.localidadID = id;
  }

  public setGrupoSanguineoID(id: number): void {
    this.grupoSanguineoID = id;
  }

  public setFactorSanguineoID(id: number): void {
    this.factorSanguineoID = id;
  }

}

