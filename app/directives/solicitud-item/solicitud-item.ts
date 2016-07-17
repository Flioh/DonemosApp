import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';
import { FactorSanguineo, GrupoSanguineo, Helpers } from '../../providers/helper-service/helper-service';
import { FormatTiposSanguineos } from '../../pipes/format-tipos-sanguineos-pipe';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ FormatTiposSanguineos ]
})
export class SolicitudItem {
	@Input() solicitud: NuevaSolicitudModel;
	@Output() seleccionarSolicitud = new EventEmitter();

    constructor() { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }

    public getTiposSanguineosBuscados():Array<string> {
    	return Helpers.puedeRecibirDe(this.solicitud.getGrupoSanguineoID(), this.solicitud.getFactorSanguineoID());
    }

    public getDescripcionTipoSanguineo(){
    	return '0-';
    }


}