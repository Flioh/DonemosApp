export enum FactorSanguineoEnum {
  RhPositivo = 1,
  RhNegativo
}

export enum GrupoSanguineoEnum {
  Cero = 1,
  A,
  AB,
  B
}

// Funciones asociadas al factor sanguineo
export namespace FactorSanguineoHelper {

  // Retorna la descripcion en base al id
  export function getDescripcion(factorID: number): string {
    switch (factorID) {
      case FactorSanguineoEnum.RhPositivo:
      return 'RH+';
      case FactorSanguineoEnum.RhNegativo:
      return 'RH-';
    }
  }

  // Retorna la descripcion abreviada en base al id
  export function getAbreviacion(factorID: number): string {
    switch (factorID) {
      case FactorSanguineoEnum.RhPositivo:
      return '+';
      case FactorSanguineoEnum.RhNegativo:
      return '-';
    }
  }
}

// Funciones asociadas al grupo sanguineo
export namespace GrupoSanguineoHelper {

  // Retorna la descripcion en base al id
  export function getDescripcion(grupoID: number): string {
    switch (grupoID) {
      case GrupoSanguineoEnum.Cero:
        return '0';
      case GrupoSanguineoEnum.A:
        return 'A';
      case GrupoSanguineoEnum.AB:
        return 'AB';
      case GrupoSanguineoEnum.B: 
        return 'B';
    }
  }
}

export namespace DonacionesHelper {

  // Retorna la descripcion completa concatenando grupo y factor
  export function getDescripcion(grupoID: number, factorID: number): string {
    return GrupoSanguineoHelper.getDescripcion(grupoID) + FactorSanguineoHelper.getAbreviacion(factorID);
  }

  // Retorna a que grupos/factores puede donar en base a su grupo y factor
  export function puedeDonarA(grupoID: number, factorID: number): string {
    // No implementada aun
    return 'test';
  }

  // Retorna de que grupos puede recibir en base a su grupo y factor
  export function puedeRecibirDe(grupoID: number, factorID: number): Array<string> {
    if(grupoID == GrupoSanguineoEnum.A && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo A+
      // Puede recibir de ['0+', '0-', 'A+', 'A-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)];

    } else if(grupoID == GrupoSanguineoEnum.A && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo A-
      // Puede recibir de ['0-', 'A-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.B && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo B+
      // Puede recibir de ['0+', '0-', 'B+', 'B-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.B && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo B-
      // Puede recibir de ['0-', 'B-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.AB && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo AB+
      // Puede recibir de ['0+', '0-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'];  
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.AB,FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.AB,FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.AB && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo AB-
      // Puede recibir de ['0-', 'A-', 'AB-', 'B-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero,FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo),
              this.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)];
    }  else if(grupoID == GrupoSanguineoEnum.Cero && factorID == FactorSanguineoEnum.RhPositivo) {
      // Si es del tipo 0+
      // Puede recibir de  ['0+', '0-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo),
              this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)];
    } else if(grupoID == GrupoSanguineoEnum.Cero && factorID == FactorSanguineoEnum.RhNegativo) {
      // Si es del tipo 0-
      // Puede recibir de ['0-'];
      return [this.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)];
    }  
  }

}




