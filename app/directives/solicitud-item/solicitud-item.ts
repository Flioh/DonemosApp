import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TiposSanguineosPipe } from '../../pipes/format-tipos-sanguineos/format-tipos-sanguineos-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TiposSanguineosPipe, TimeAgoPipe]
})
export class SolicitudItem {
	@Input() solicitud: SolicitudModel;
	@Output() seleccionarSolicitud = new EventEmitter();

    constructor() { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }

    // Obtiene el listado de grupos y factores que se necesitan
    public getTiposSanguineosBuscados(): Array<string> {
      return DonacionesHelper.puedeRecibirDe(this.solicitud.getGrupoSanguineo().getId(), 
                                             this.solicitud.getFactorSanguineo().getId());
    }

    // Obtiene el factor y grupo sanguineo del usuario
    public getDescripcionTipoSanguineo():string {
      // TODO: reemplazar por los datos del usuario si existen
      // -----------------------------------------------------
      return '';
    }


}