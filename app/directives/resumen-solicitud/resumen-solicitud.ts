import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ResumenSolicitudModel } from '../../models/resumen-solicitud-model/resumen-solicitud-model';
import { DonacionesHelper } from '../../providers/donaciones-service/donaciones-service';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha-pipe/formatear-fecha-pipe';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { LocalizacionService } from '../../providers/localizacion-service/localizacion-service';

@Component({
    selector: 'resumen-solicitud',
    templateUrl: 'build/directives/resumen-solicitud/resumen-solicitud.html',
    pipes: [ FormatearFechaPipe ]
})
export class ResumenSolicitud {
	  @Input() solicitudItemModel: ResumenSolicitudModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor(private dataService: RemoteDataService, 
                private localizacionService: LocalizacionService) { }

    // Método que emite un evento para mostrar el detalle de la solicitud
    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitudItemModel.getSolicitud() });
    }

    // Mètodo que muestra como llegar a la direccion de la solicitud
    public mostrarRuta(): void  {
        // Obtenemos la solicitud del modelo
        let solicitud = this.solicitudItemModel.getSolicitud();

        // Obtenemos la direccion de la institución
        let direccion = `${ solicitud.getDireccion() },${ solicitud.getCiudad().getNombre() },${ solicitud.getProvincia().getNombre() },Argentina`;

        // Invocamos al servicio usando la direccion y el nombre de la institucion 
        this.localizacionService.mostrarRuta(direccion, solicitud.getInstitucion());
    }
}