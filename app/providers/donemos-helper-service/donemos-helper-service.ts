import {Injectable} from '@angular/core';

export enum FactorSanguineo {
  RhPositivo = 0,
  RhNegativo
}

export enum GrupoSanguineo {
  Cero = 0,
  A,
  AB,
  B
}

// Funciones asociadas al factor sanguineo
export namespace FactorSanguineoHelper {

  // Retorna la descripcion en base al id
  export function getDescripcion(factor: FactorSanguineo): string {
    switch (factor) {
      case FactorSanguineo.RhPositivo:
      return 'RH+';
      case FactorSanguineo.RhNegativo:
      return 'RH-';
    }
  }

  // Retorna la descripcion abreviada en base al id
  export function getAbreviacion(factor: FactorSanguineo): string {
    switch (factor) {
      case FactorSanguineo.RhPositivo:
      return '+';
      case FactorSanguineo.RhNegativo:
      return '-';
    }
  }

  // Retorna la lista de todos los factores sanguineos
  export function getFactoresSanguineos(): Array<FactorSanguineo> {
    let listaFactoresSanguineos = [];

    listaFactoresSanguineos.push({ id: FactorSanguineo.RhNegativo, nombre: this.getDescripcion(FactorSanguineo.RhNegativo)});
    listaFactoresSanguineos.push({ id: FactorSanguineo.RhPositivo, nombre: this.getDescripcion(FactorSanguineo.RhPositivo)});

    return listaFactoresSanguineos;
  }
}

// Funciones asociadas al grupo sanguineo
export namespace GrupoSanguineoHelper {

  // Retorna la descripcion en base al id
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

  // Retorna la lista de todos los grupos sanguineos
  export function getGruposSanguineos(): Array<GrupoSanguineo> {
    let listaGruposSanguineos = [];

    listaGruposSanguineos.push({ id: GrupoSanguineo.Cero, nombre: this.getDescripcion(GrupoSanguineo.Cero)});
    listaGruposSanguineos.push({ id: GrupoSanguineo.A, nombre: this.getDescripcion(GrupoSanguineo.A)});
    listaGruposSanguineos.push({ id: GrupoSanguineo.AB, nombre: this.getDescripcion(GrupoSanguineo.AB)});
    listaGruposSanguineos.push({ id: GrupoSanguineo.B, nombre: this.getDescripcion(GrupoSanguineo.B)});

    return listaGruposSanguineos;
  }
}

export namespace DonacionesHelper {

  // Retorna la descripcion completa concatenando grupo y factor
  export function getDescripcion(grupo: GrupoSanguineo, factor: FactorSanguineo): string {
    return GrupoSanguineoHelper.getDescripcion(grupo) + FactorSanguineoHelper.getAbreviacion(factor);
  }

  // Retorna a que grupos/factores puede donar en base a su grupo y factor
  export function puedeDonarA(grupo: GrupoSanguineo, factor: FactorSanguineo): string {
    // No implementada aun
    return 'test';
  }

  // Retorna de que grupos puede recibir en base a su grupo y factor
  export function puedeRecibirDe(grupo: GrupoSanguineo, factor: FactorSanguineo): Array<string> {
    if(grupo == GrupoSanguineo.A && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo A+
      // Puede recibir de ['0+', '0-', 'A+', 'A-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)];

    } else if(grupo == GrupoSanguineo.A && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo A-
      // Puede recibir de ['0-', 'A-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.B && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo B+
      // Puede recibir de ['0+', '0-', 'B+', 'B-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.B && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo B-
      // Puede recibir de ['0-', 'B-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.AB && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo AB+
      // Puede recibir de ['0+', '0-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'];  
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.AB,FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.AB,FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.AB && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo AB-
      // Puede recibir de ['0-', 'A-', 'AB-', 'B-'];
      return [this.getDescripcion(GrupoSanguineo.Cero,FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.AB, FactorSanguineo.RhNegativo),
              this.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)];
    }  else if(grupo == GrupoSanguineo.Cero && factor == FactorSanguineo.RhPositivo) {
      // Si es del tipo 0+
      // Puede recibir de  ['0+', '0-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo),
              this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)];
    } else if(grupo == GrupoSanguineo.Cero && factor == FactorSanguineo.RhNegativo) {
      // Si es del tipo 0-
      // Puede recibir de ['0-'];
      return [this.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)];
    }  
  }

}




