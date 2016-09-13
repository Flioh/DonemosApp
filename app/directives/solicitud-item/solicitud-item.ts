import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SolicitudItemModel } from '../../providers/solicitud-item-model/solicitud-item-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TimeAgoPipe ]
})
export class SolicitudItem {
	  @Input() solicitudItemModel: SolicitudItemModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor(private dataService: RemoteDataService) { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitudItemModel.getSolicitud() });
    }
}