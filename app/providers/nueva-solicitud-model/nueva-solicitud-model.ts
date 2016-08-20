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
  private institucion: string;
  private direccion: string;
  private horaDesde: string;
  private horaHasta: string;
  private datosAdicionales: string;

  constructor(obj?) {
    if(obj) {
      // Si recibimos un objeto, copiamos sus propiedades
      for (var prop in obj) this[prop] = obj[prop];
    } else {
      this.estaVigente = true;
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

  public getInstitucion(): string {
    return this.institucion;
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
  public setSolicitudID(solicitudID: number): void {
    this.solicitudID = solicitudID;
  }

  public setUsuarioID(usuarioID: number): void {
    this.usuarioID = usuarioID;
  }

  public setFechaCreacion(unaFecha: Date): void {
    this.fechaCreacion = unaFecha;
  }

  public setEstaVigente(vigente: boolean): void {
    this.estaVigente = vigente;
  }

  public setProvinciaID(provinciaID: number): void {
    this.provinciaID = provinciaID;
  }

  public setLocalidadID(localidadID: number): void {
     this.localidadID = localidadID;
  }

  public setGrupoSanguineoID(grupoSanguineoID: number): void {
    this.grupoSanguineoID = grupoSanguineoID;
  }

  public setFactorSanguineoID(factorSanguineoID: number): void {
    this.factorSanguineoID = factorSanguineoID;
  }

  public setCantidadDadores(cantidad: number): void {
    this.cantidadDadores = cantidad;
  }

  public setInstitucion(institucion: string): void {
    this.institucion = institucion;
  }

  public setDireccion(direccion: string): void {
    this.direccion = direccion;
  }

  public setHoraDesde(horaDesde: string): void {
    this.horaDesde = horaDesde;
  }

  public setHoraHasta(horaHasta: string): void {
    this.horaHasta = horaHasta;
  }

  public setDatosAdicionales(datosAdicionales: string): void {
    this.datosAdicionales = datosAdicionales;
  }

}

