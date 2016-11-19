// Referencias de Angular
import { Injectable } from '@angular/core';

@Injectable()
export class BancoSangreModel {

  public nombre: string;
  public nombreCiudad: string;
  public nombreProvincia: string;
  public direccion: string;
  public horario: string;
  public telefono: string;
  public coordenadas: {lat: number, lon: number};

  constructor(obj?) {
      this.nombre = obj && obj.nombre ? obj.nombre : null;
      this.nombreCiudad = obj && obj.ciudad ? obj.ciudad : null;
      this.nombreProvincia = obj && obj.provincia ? obj.provincia : null;
      this.direccion = obj && obj.direccion ? obj.direccion : null;
      this.horario = obj && obj.horario ? obj.horario : null;
      this.telefono = obj && obj.telefono ? obj.telefono : null;
      this.coordenadas = obj && obj.lat && obj.lon ? { lat: obj.lat, lon: obj.lon } : null;
  }
}

