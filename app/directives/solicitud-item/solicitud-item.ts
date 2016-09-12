import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TimeAgoPipe ],
    changeDetection: ChangeDetectionStrategy.OnPush 
})
export class SolicitudItem {
	  @Input() solicitud: SolicitudModel;
    @Input() tipoSanguineoUsuario: string;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor() { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }

    // Obtiene el listado de grupos y factores que se necesitan
    public mostrarTiposBuscados(): string {
      let result = '';
      let posiblesDadores = DonacionesHelper.puedeRecibirDe(this.solicitud.getGrupoSanguineo().getId(), 
                                             this.solicitud.getFactorSanguineo().getId());

      // Obtenems un string con todos los tipos sanguineos buscados
      result = posiblesDadores.join(' ');

      // Resaltamos el tipo sanguineo del usuario
      result = result.replace(this.tipoSanguineoUsuario, '<span class="marked">' + this.tipoSanguineoUsuario + '</span> ');

      return result;
    }
}