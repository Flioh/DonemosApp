// Referencias de Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Servicios
import { LocalizacionService } from '../../../shared/services/localizacion.service';

// Modelos
import { ResumenSolicitudModel } from '../../solicitudes/resumen-solicitud.model';
import { SolicitudModel } from '../solicitud.model';

@Component({
    selector: 'resumen-solicitud',
    templateUrl: 'resumen-solicitud.component.html'
})
export class ResumenSolicitudComponent {
	  @Input() solicitudItemModel: ResumenSolicitudModel;
	  @Output() seleccionarSolicitud = new EventEmitter();

    constructor(private localizacionService: LocalizacionService) {
        
    }

    // Método que emite un evento para mostrar el detalle de la solicitud
    public verDetalles(): void {
    	this.seleccionarSolicitud.emit({ value : this.solicitudItemModel.solicitud });
    }

    // Mètodo que muestra como llegar a la direccion de la solicitud
    public mostrarRuta(): void  {
        // Obtenemos la solicitud del modelo
        let solicitud = this.solicitudItemModel.solicitud;

        // Obtenemos la direccion de la institución
        let direccion = `${ solicitud.direccion },${ solicitud.ciudad.nombre },${ solicitud.provincia.nombre },Argentina`;

        // Invocamos al servicio usando la direccion y el nombre de la institucion 
        this.localizacionService.mostrarRuta(direccion, solicitud.institucion);
    }
}