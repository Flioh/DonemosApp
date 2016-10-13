// Referencias de Angular
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearFecha'
})
@Injectable()
export class FormatearFechaPipe implements PipeTransform {

  transform(value: Date, args?: any[]) {

    // Si es un string lo convertimos en un Date
    if(typeof value === 'string') {
      value = new Date(value.toString());
    }

    if(value instanceof Date) {

      let resultado: string;
      let now = new Date().getTime();

      // Obtenemos la diferencia entre la fecha actual y la pasada como parametro
      let delta = Math.floor((now - value.getTime() ) / 1000);

      if(delta < 10) {
        // Ahora
        resultado = `Ahora`;
      } else if(delta < 60) {
        // En el ultimo minuto -> se mide en segundos
        let segundos = Math.floor(delta);
        resultado = `Hace ${ segundos } ${ segundos == 1 ? 'segundo' : 'segundos' }`;
      } else if(delta < 3600) {
        // En la ultima hora -> se mide en minutos
        let minutos = Math.floor(delta / 60);
        resultado = `Hace ${ minutos } ${ minutos == 1 ? 'minuto' : 'minutos' }`;
      } else if(delta < 86400) {
        // En el ultimo dia -> se mide en horas
        let horas = Math.floor(delta / 3600);
        resultado = `Hace ${ horas } ${ horas == 1 ? 'hora' : 'horas' }`;
      } else if(delta < 604800){
        // En la ultima semana -> se mide en dias
        let dias = Math.floor(delta / 86400);
        resultado = `Hace ${ dias } ${ dias == 1 ? 'dia' : 'dias' }`;
      } else if(delta < 2592000) {
        // En el ultimo mes -> se mide en semanas
        let semanas = Math.floor(delta / 604800);
        resultado = `Hace ${ semanas } ${ semanas == 1 ? 'semana' : 'semanas' }`;
      } else {
        // Hace más de un mes
        let meses = Math.floor(delta / 2592000);
        resultado = `Hace ${ meses } ${ meses == 1 ? 'mes' : 'meses' }`;
      }

      return resultado;
    }
  }
}
