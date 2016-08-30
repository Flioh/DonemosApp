import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'timeago'
})
@Injectable()
export class TimeAgoPipe {

  transform(value: Date, args: any[]) {

    if(value instanceof Date) {

      let resultado: string;
      let now = new Date().getTime();

      let delta = Math.floor((now - value.getTime() ) / 1000);

      if(delta < 10) {
        // Ahora
        resultado = `Ahora`;
      } else if(delta < 60) {
        // En el ultimo minuto -> segundos
        resultado = `Hace ${ Math.floor(delta) } segundos`;
      } else if(delta < 3600) {
        // En la ultima hora -> minutos
        resultado = `Hace ${ Math.floor(delta / 60) } minutos`;
      } else if(delta < 86400) {
        // En el ultimo dia -> horas
        resultado = `Hace ${ Math.floor(delta / 3600) } horas`;
      } else if(delta < 604800){
        // En la ultima semana -> dias
        resultado = `Hace ${ Math.floor(delta / 86400) } dias`;
      } else if(delta < 2592000) {
        // En el ultimo mes -> semanas
        resultado = `Hace ${ Math.floor(delta / 604800) } semanas`;
      } else {
        // Hace más de un mes
        resultado = `Hace ${ Math.floor(delta / 2592000) } meses`;
      }

      return resultado;
    }
  }
}
