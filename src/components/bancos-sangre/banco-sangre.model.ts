// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos
import { ProvinciaModel } from '../../shared/models/provincia.model';

@Injectable()
export class BancoSangreModel {

  public nombre: string;
  public nombreCiudad: string;
  public provincia: ProvinciaModel;
  public direccion: string;
  public horario: string;
  public telefono: string;
  public coordenadas: {lat: number, lon: number};

  constructor(obj?) {
      this.nombre = obj && obj.nombre ? obj.nombre : null;
      this.nombreCiudad = obj && obj.ciudad ? obj.ciudad : null;
      this.provincia = obj && obj.provincia ? new ProvinciaModel(obj.provincia.id, obj.provincia.nombre) : new ProvinciaModel();
      this.direccion = obj && obj.direccion ? obj.direccion : null;
      this.horario = obj && obj.horario ? obj.horario : null;
      this.telefono = obj && obj.telefono ? obj.telefono : null;
      this.coordenadas = obj && obj.lat && obj.lon ? { lat: obj.lat, lon: obj.lon } : null;
  }
}

