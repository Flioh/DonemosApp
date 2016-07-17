import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/components/solicitud-item/solicitud-item.html'
})
export class SolicitudItem {
	@Input() solicitud: NuevaSolicitudModel;
	@Output() seleccionarSolicitud = new EventEmitter();

    constructor() {}

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitud });
    }


}