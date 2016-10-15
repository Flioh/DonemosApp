// Referencias de Angular
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// Servicios
import { LocalizacionService } from '../../shared/services/localizacion.service';
import { DonacionesHelper } from '../../shared/services/donaciones.service';

// Modelos
import { ResumenSolicitudModel } from '../../solicitudes/resumen-solicitud.model';

// Pipes
import { FormatearFechaPipe } from '../../shared/pipes/formatear-fecha.pipe';

@Component({
    selector: 'resumen-solicitud',
    templateUrl: 'build/solicitudes/resumen-solicitud/resumen-solicitud.component.html',
    pipes: [ FormatearFechaPipe ]
})
export class ResumenSolicitudDirective {
	  @Input() solicitudItemModel: ResumenSolicitudModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor(private localizacionService: LocalizacionService) { }

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