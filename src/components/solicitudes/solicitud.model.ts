// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { LocalidadModel } from '../../shared/models/localidad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';

@Injectable()
export class SolicitudModel {

  public solicitudID: number;
  public usuarioID: number;
  public fechaCreacion: Date;
  public estaVigente: boolean;
  public provincia: ProvinciaModel;
  public localidad: LocalidadModel;
  public nombrePaciente: string;
  public tiposSanguineos: Array<{ grupoSanguineo: number, factorSanguineo: number}>;
  public cantidadDadores: number;
  public institucion: string;
  public direccion: string;
  public horaDesde: string;
  public horaHasta: string;
  public datosAdicionales: string;

  constructor(obj?) {
      this.solicitudID = obj && obj.solicitudID ? obj.solicitudID : null;
      this.usuarioID = obj && obj.usuarioID ? obj.usuarioID : null;
      this.estaVigente = obj && obj.estaVigente ? obj.estaVigente : true;
      this.fechaCreacion = obj && obj.fechaCreacion ? obj.fechaCreacion : new Date();
      this.provincia = obj && obj.provincia ? new ProvinciaModel(obj.provincia.id, obj.provincia.nombre) : new ProvinciaModel();
      this.localidad = obj && obj.localidad ? new LocalidadModel(obj.localidad.id, obj.localidad.nombre) : new LocalidadModel();
      this.nombrePaciente = obj && obj.nombrePaciente ? obj.nombrePaciente : null;
      this.tiposSanguineos = obj && obj.tiposSanguineos ? obj.tiposSanguineos : null;
      this.cantidadDadores = obj && obj.cantidadDadores ? obj.cantidadDadores : null;
      this.institucion = obj && obj.institucion ? obj.institucion : null;
      this.direccion = obj && obj.direccion ? obj.direccion : null;
      this.horaDesde = obj && obj.horaDesde ? obj.horaDesde : '08:00';
      this.horaHasta = obj && obj.horaHasta ? obj.horaHasta : '16:00';
      this.datosAdicionales = obj && obj.datosAdicionales ? obj.datosAdicionales : null;
  }
}

