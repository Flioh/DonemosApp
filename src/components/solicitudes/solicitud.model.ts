// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { CiudadModel } from '../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';

@Injectable()
export class SolicitudModel {

  public solicitudID: number;
  public usuarioID: number;
  public fechaCreacion: Date;
  public estaVigente: boolean;
  public provincia: ProvinciaModel;
  public ciudad: CiudadModel;
  public nombrePaciente: string;
  public grupoSanguineo: GrupoSanguineoModel;
  public factorSanguineo: FactorSanguineoModel;
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
}

