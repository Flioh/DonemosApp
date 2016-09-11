import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { SqlStorage, Storage } from 'ionic-angular';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TimeAgoPipe ]
})
export class SolicitudItem {
	  @Input() solicitud: SolicitudModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    private storage : Storage;
    private datosUsuario : string;

    constructor() {

      this.datosUsuario = '';

      if(!this.storage) {
        this.storage = new Storage(SqlStorage);  
      }

      this.storage.get('datosUsuarioObj').then((datosUsuario) => {
        if(datosUsuario) {
          let datosUsuarioObj = JSON.parse(datosUsuario);
          this.datosUsuario = DonacionesHelper.getDescripcion(datosUsuarioObj.grupoSanguineoID, datosUsuarioObj.factorSanguineoID);
        }
      });
    }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }

    // Obtiene el listado de grupos y factores que se necesitan
    public mostrarTiposBuscados(): string {
      let result = '';
      let posiblesDadores = DonacionesHelper.puedeRecibirDe(this.solicitud.getGrupoSanguineo().getId(), 
                                             this.solicitud.getFactorSanguineo().getId());

      for(let i=0; i<posiblesDadores.length; i++) {
        if(posiblesDadores[i] == this.datosUsuario) {
          result += '<span class="marked">' + posiblesDadores[i] + '</span> ';
        } else {
          result += posiblesDadores[i] + ' ';
        }
      }

      return result;
    }
}