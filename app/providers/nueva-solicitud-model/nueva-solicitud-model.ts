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
  private horario: string;
  private datosAdicionales: string;

  constructor() {
    this.fechaCreacion = new Date();
    this.estaVigente = true;
  }

  


}

