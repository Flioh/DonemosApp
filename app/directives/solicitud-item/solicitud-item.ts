import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SolicitudItemModel } from '../../providers/solicitud-item-model/solicitud-item-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { NavigationService } from '../../providers/navigation-service/navigation-service';

@Component({
    selector: 'solicitud-item',
    templateUrl: 'build/directives/solicitud-item/solicitud-item.html',
    pipes: [ TimeAgoPipe ]
})
export class SolicitudItem {
	  @Input() solicitudItemModel: SolicitudItemModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor(private dataService: RemoteDataService, 
                private navigationService: NavigationService) { }

    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitudItemModel.getSolicitud() });
    }

    public mostrarRuta(): void  {
        // Obtenemos la solicitud del modelo
        let solicitud = this.solicitudItemModel.getSolicitud();

        // Obtenemos la direccion de la institución
        let direccion = `${ solicitud.getDireccion() },${ solicitud.getCiudad().getNombre() },${ solicitud.getProvincia().getNombre() },Argentina`;

        // Invocamos al servicio usando la direccion y el nombre de la institucion 
        this.navigationService.mostrarRuta(direccion, solicitud.getInstitucion());
    }
}