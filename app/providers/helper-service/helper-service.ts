import {Injectable} from '@angular/core';

@Injectable()
export enum FactorSanguineo {
  RhPositivo = 1,
  RhNegativo
}

@Injectable()
export enum GrupoSanguineo {
  Cero = 1,
  A,
  AB,
  B
}

export namespace FactorSanguineo {
  export function getDescripcion(factor: FactorSanguineo): string {
    switch (factor) {
      case FactorSanguineo.RhPositivo:
      return 'RH+';
      case FactorSanguineo.RhNegativo:
      return 'RH-';
    }
  }

  export function getAbreviacion(factor: FactorSanguineo): string {
    switch (factor) {
      case FactorSanguineo.RhPositivo:
      return '+';
      case FactorSanguineo.RhNegativo:
      return '-';
    }
  }
}

export namespace GrupoSanguineo {
  export function getDescripcion(grupo: GrupoSanguineo): string {
    switch (grupo) {
      case GrupoSanguineo.Cero:
        return '0';
      case GrupoSanguineo.A:
        return 'A';
      case GrupoSanguineo.AB:
        return 'AB';
      case GrupoSanguineo.B: 
        return 'B';
    }
  }
}

export namespace Helpers {

  export function getDescripcion(grupo: GrupoSanguineo, factor: FactorSanguineo): string {
    return GrupoSanguineo.getDescripcion(grupo) + FactorSanguineo.getAbreviacion(factor);
  }

  export function puedeDonarA(grupo: GrupoSanguineo, factor: FactorSanguineo): string {
    // No implementada aun
    return 'test';
  }

  export function puedeRecibirDe(grupo: GrupoSanguineo, factor: FactorSanguineo): Array<string> {
    
    if(grupo == GrupoSanguineo.A && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo A+
      // Puede recibir de ['0+', '0-', 'A+', 'A-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)];

    } else if(grupo == GrupoSanguineo.A && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo A-
      // Puede recibir de ['0-', 'A-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.B && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo B+
      // Puede recibir de ['0+', '0-', 'B+', 'B-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.B && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo B-
      // Puede recibir de ['0-', 'B-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.AB && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo AB+
      // Puede recibir de ['0+', '0-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'];  
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.AB,FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.AB,FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.AB && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo AB-
      // Puede recibir de ['0-', 'A-', 'AB-', 'B-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero,FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.AB, FactorSanguineo.RhNegativo),
              Helpers.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    }  else if(grupo == GrupoSanguineo.Cero && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo 0+
      // Puede recibir de  ['0+', '0-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.Cero && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo B+
      // Puede recibir de ['0-'];
      return [Helpers.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)];
    }  
  }
}




