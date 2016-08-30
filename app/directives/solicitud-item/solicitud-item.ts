import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TiposSanguineosPipe } from '../../pipes/format-tipos-sanguineos/format-tipos-sanguineos-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TiposSanguineosPipe, TimeAgoPipe]
})
export class SolicitudItem {
	@Input() solicitud: NuevaSolicitudModel;
	@Output() seleccionarSolicitud = new EventEmitter();

    constructor() { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }

    public getTiposSanguineosBuscados(): Array<string> {
    	return DonacionesHelper.puedeRecibirDe(this.solicitud.getGrupoSanguineoID(), this.solicitud.getFactorSanguineoID());
    }

    public getDescripcionTipoSanguineo(){
    	return '0-';
    }


}