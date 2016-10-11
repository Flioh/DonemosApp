// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { CiudadModel } from '../shared/models/ciudad.model';
import { ProvinciaModel } from '../shared/models/provincia.model';
import { FactorSanguineoModel } from '../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../shared/models/grupo-sanguineo.model';

@Injectable()
export class SolicitudModel {

  private solicitudID: number;
  private usuarioID: number;
  private fechaCreacion: Date;
  private estaVigente: boolean;
  private provincia: ProvinciaModel;
  private ciudad: CiudadModel;
  private nombrePaciente: string;
  private grupoSanguineo: GrupoSanguineoModel;
  private factorSanguineo: FactorSanguineoModel;
  private cantidadDadores: number;
  private institucion: string;
  private direccion: string;
  private horaDesde: string;
  private horaHasta: string;
  private datosAdicionales: string;

  constructor(obj?) {
      this.solicitudID = obj && obj.solicitudID ? obj.solicitudID : null;
      this.usuarioID = obj && obj.usuarioID ? obj.usuarioID : null;
      this.estaVigente = obj && obj.estaVigente ? obj.estaVigente : true;
      this.fechaCreacion = obj && obj.fechaCreacion ? obj.fechaCreacion : new Date();
      this.provincia = obj && obj.provincia ? new ProvinciaModel(obj.provincia.id, obj.provincia.nombre) : new ProvinciaModel();
      this.ciudad = obj && obj.ciudad ? new CiudadModel(obj.ciudad.id, obj.ciudad.nombre) : new CiudadModel();
      this.nombrePaciente = obj && obj.nombrePaciente ? obj.nombrePaciente : null;
      this.grupoSanguineo = obj && obj.grupoSanguineo ? new GrupoSanguineoModel(obj.grupoSanguineo.id, obj.grupoSanguineo.nombre) : new GrupoSanguineoModel();
      this.factorSanguineo = obj && obj.factorSanguineo ? new FactorSanguineoModel(obj.factorSanguineo.id, obj.factorSanguineo.nombre) : new FactorSanguineoModel();
      this.cantidadDadores = obj && obj.cantidadDadores ? obj.cantidadDadores : null;
      this.institucion = obj && obj.institucion ? obj.institucion : null;
      this.direccion = obj && obj.direccion ? obj.direccion : null;
      this.horaDesde = obj && obj.horaDesde ? obj.horaDesde : '08:00';
      this.horaHasta = obj && obj.horaHasta ? obj.horaHasta : '16:00';
      this.datosAdicionales = obj && obj.datosAdicionales ? obj.datosAdicionales : null;
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

  public getProvincia(): ProvinciaModel {
    return this.provincia;
  }

  public getCiudad(): CiudadModel {
    return this.ciudad;
  }

  public getGrupoSanguineo(): GrupoSanguineoModel {
    return this.grupoSanguineo;
  }

  public getFactorSanguineo(): FactorSanguineoModel {
    return this.factorSanguineo;
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

  public setProvincia(provincia: ProvinciaModel): ProvinciaModel {
    return this.provincia = provincia;
  }

  public setCiudad(ciudad: CiudadModel): CiudadModel {
     return this.ciudad = ciudad;
  }

  public setGrupoSanguineo(grupoSanguineo: GrupoSanguineoModel): GrupoSanguineoModel {
    return this.grupoSanguineo = grupoSanguineo;
  }

  public setFactorSanguineo(factorSanguineo: FactorSanguineoModel): FactorSanguineoModel {
    return this.factorSanguineo = factorSanguineo;
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

