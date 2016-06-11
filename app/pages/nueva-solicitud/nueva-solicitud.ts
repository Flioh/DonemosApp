import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl } from '@angular/common';

/* Models */
import {NuevaSolicitudModel} from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
  directives: [FORM_DIRECTIVES]
})
export class NuevaSolicitudPage {

	private ocultarIconoNuevaSolicitud: boolean = true;
	private nuevaSolicitud: NuevaSolicitudModel;
	private nuevaSolicitudForm: ControlGroup;

	lugar: AbstractControl;
	provincia: AbstractControl;
	localidad: AbstractControl;

	constructor(private nav: NavController, private formBuilder : FormBuilder) {
		this.nuevaSolicitud = new NuevaSolicitudModel();
		this.nuevaSolicitudForm = this.formBuilder.group({
			'lugar' : ['', Validators.required],
			'provincia' : ['', Validators.required]
		});

		this.lugar = this.nuevaSolicitudForm.controls['lugar'];  
		this.provincia = this.nuevaSolicitudForm.controls['provincia'];  
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
