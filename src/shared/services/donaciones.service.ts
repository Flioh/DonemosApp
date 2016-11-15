// Referencias de angular
import { Injectable } from '@angular/core';

// Enumerado de factores sanguineos
export enum FactorSanguineoEnum {
  RhPositivo = 0,
  RhNegativo
}

// Enumerado de grupos sanguineos
export enum GrupoSanguineoEnum {
  O = 0,
  A,
  B,
  AB
}

@Injectable()
export class DonacionesService {

  // Método que devuelve la descripcion del factor sanguineo pasado como parametro 
  public getDescripcionFactorSanguineo(factorID: number): string {
    switch (factorID) {
      case FactorSanguineoEnum.RhPositivo:
      return 'RH+';
      case FactorSanguineoEnum.RhNegativo:
      return 'RH-';
    }
  }

  // Método que devuelve la abreviacion del factor sanguineo pasado como parametro 
  public getAbreviacionFactorSanguineo(factorID: number): string {
    switch (factorID) {
      case FactorSanguineoEnum.RhPositivo:
      return '+';
      case FactorSanguineoEnum.RhNegativo:
      return '-';
    }
  }

  // Método que devuelve la descripcion del grupo sanguineo pasado como parametro 
  public getDescripcionGrupoSanguineo(grupoID: number): string {
    switch (grupoID) {
      case GrupoSanguineoEnum.O:
        return '0';
      case GrupoSanguineoEnum.A:
        return 'A';
      case GrupoSanguineoEnum.AB:
        return 'AB';
      case GrupoSanguineoEnum.B: 
        return 'B';
    }
  }

  // Método que devuelve la descripcion completa concatenando grupo y factor
  public getDescripcionCompleta(grupoID: number, factorID: number): string {
    return this.getDescripcionGrupoSanguineo(grupoID) + this.getAbreviacionFactorSanguineo(factorID);
  }

  // Método que devuelve a que grupos/factores puede donar en base a su grupo y factor
  public puedeDonarA(grupoID: number, factorID: number): string {
    // No implementada aun
    return 'test';
  }

  // Método que devuelve de que grupos/factores puede recibir en base a su grupo y factor
  public puedeRecibirDe(grupoID: number, factorID: number): Array<string> {
    if(grupoID == GrupoSanguineoEnum.A && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo A+
      // Puede recibir de ['0+', '0-', 'A+', 'A-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)];

    } else if(grupoID == GrupoSanguineoEnum.A && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo A-
      // Puede recibir de ['0-', 'A-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.B && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo B+
      // Puede recibir de ['0+', '0-', 'B+', 'B-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.B && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo B-
      // Puede recibir de ['0-', 'B-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.AB && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo AB+
      // Puede recibir de ['0+', '0-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'];  
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.AB,FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.AB,FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.AB && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo AB-
      // Puede recibir de ['0-', 'A-', 'AB-', 'B-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O,FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    }  else if(grupoID == GrupoSanguineoEnum.O && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo 0+
      // Puede recibir de  ['0+', '0-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhPositivo),
              this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.O && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo 0-
      // Puede recibir de ['0-'];
      return [this.getDescripcionCompleta(GrupoSanguineoEnum.O, FactorSanguineoEnum.RhNegativo)];
    }  
  }

}



