import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from '@angular/common';

/* Models */
import {NuevaSolicitudModel} from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
  directives: [FORM_DIRECTIVES]
})
export class NuevaSolicitudPage {

	private ocultarIconoNuevaSolicitud: boolean = true;
	nuevaSolicitud: NuevaSolicitudModel;
	
	nuevaSolicitudForm: ControlGroup;

	// Campos del formulario
	private lugar: Control;


	constructor(private nav: NavController, private formBuilder : FormBuilder) {
		
		this.lugar = new Control('', Validators.required);

		this.nuevaSolicitudForm = formBuilder.group({
			lugar: this.lugar
		});
	}

	ionViewLoaded() {
	  // Antes de ingresar, verificar si hay información no guardada
	}

	ionViewWillLeave() {
	  // Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado;
	}

	public ocultarIcono(): boolean {
		return this.ocultarIconoNuevaSolicitud;
	}

	public guardarCambios(): void {

	}
}
