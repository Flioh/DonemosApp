import {Injectable} from '@angular/core';

@Injectable()
export class NuevaSolicitudModel {

  private solicitudID: number;
  private usuarioID: number;
  private fechaCreacion: Date;
  private estaVigente: boolean;
  private provinciaID: number;
  private localidadID: number;
  private nombrePaciente: string;
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
      // Seteamos explicitamente todas las propiedades a null
      this.solicitudID = null;
      this.usuarioID = null;
      this.estaVigente = true;
      this.fechaCreacion = new Date();
      this.provinciaID = null;
      this.localidadID = null;
      this.nombrePaciente = null;
      this.grupoSanguineoID = null;
      this.factorSanguineoID = null;
      this.cantidadDadores = null;
      this.institucion = null;
      this.direccion = null;
      this.horaDesde = null;
      this.horaHasta = null;
      this.datosAdicionales = null;
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

  public getNombrePaciente(): string {
    return this.nombrePaciente;
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
  public setSolicitudID(solicitudID: number): number {
    return this.solicitudID = solicitudID;
  }

  public setUsuarioID(usuarioID: number): number {
    return this.usuarioID = usuarioID;
  }

  public setFechaCreacion(unaFecha: Date): Date {
    return this.fechaCreacion = unaFecha;
  }

  public setEstaVigente(vigente: boolean): boolean {
    return this.estaVigente = vigente;
  }

  public setProvinciaID(provinciaID: number): number {
    return this.provinciaID = provinciaID;
  }

  public setLocalidadID(localidadID: number): number {
     return this.localidadID = localidadID;
  }

  public setGrupoSanguineoID(grupoSanguineoID: number): number {
    return this.grupoSanguineoID = grupoSanguineoID;
  }

  public setFactorSanguineoID(factorSanguineoID: number): number {
    return this.factorSanguineoID = factorSanguineoID;
  }

  public setCantidadDadores(cantidad: number): number {
    return this.cantidadDadores = cantidad;
  }

  public setInstitucion(institucion: string): string {
    return this.institucion = institucion;
  }

  public setNombrePaciente(nombrePaciente: string): string {
    return this.nombrePaciente = nombrePaciente;
  }

  public setDireccion(direccion: string): string {
    return this.direccion = direccion;
  }

  public setHoraDesde(horaDesde: string): string {
    return this.horaDesde = horaDesde;
  }

  public setHoraHasta(horaHasta: string): string {
    return this.horaHasta = horaHasta;
  }

  public setDatosAdicionales(datosAdicionales: string): string {
    return this.datosAdicionales = datosAdicionales;
  }

}

