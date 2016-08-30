import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTiposSanguineos'
})
@Injectable()
export class FormatTiposSanguineos implements PipeTransform {

  // Recibe la lista de descripciones, y la que debe resaltar
  transform(value: Array<string>, markedElement: string) {
    let result:string = '';
    
    for(let i=0; i<value.length; i++) {
      if(value[i] == markedElement) {
        // Resaltamos este elemento
        result += '<span class="marked">' + value[i] + '</span> ';
      } else {
        result += value[i] + ' ';
      }
    }

    return result;
  }
}
