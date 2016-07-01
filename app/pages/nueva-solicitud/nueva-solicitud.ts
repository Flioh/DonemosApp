import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from '@angular/common';

import {AutocompleteService} from '../../providers/autocomplete-service/autocomplete-service';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

/* Models */
import {NuevaSolicitudModel} from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
  directives: [FORM_DIRECTIVES],
  providers: [AutocompleteService]
})
export class NuevaSolicitudPage {

	private ocultarIconoNuevaSolicitud: boolean = true;

	private nuevaSolicitud: NuevaSolicitudModel;
	private nuevaSolicitudForm: ControlGroup;

	// Informacion de Google maps
	apiKey: any;

	// Campos del formulario
	private ctrlInstitucion: Control;
	private institucionValue: string = '';
	
	private ctrlDireccion: Control;
	private direccionValue: string = '';

	private elementId: string = 'autocomplete';

	constructor(private nav: NavController, 
				private formBuilder : FormBuilder, 
				private ngZone : NgZone,
				private connectivityService : ConnectivityService,
				private autocompleteService : AutocompleteService) {
		
		this.ctrlInstitucion = new Control(this.institucionValue, Validators.required);
		this.ctrlDireccion = new Control(this.direccionValue, Validators.required);


		this.nuevaSolicitudForm = formBuilder.group({
			institucion: this.ctrlInstitucion,
			direccion: this.ctrlDireccion
		});

		// Nos suscribimos al autocomplete para que nos envie la informacion de la direccion
		this.autocompleteService.autocomplete.subscribe((informacionDelLugar) => {
			this.ngZone.run(() => {
				this.setearDireccion(informacionDelLugar);
			});
		});
	}

	setearDireccion(informacionSobreDireccion: any) {
		debugger;
		this.institucionValue = informacionSobreDireccion.getName();
		this.ctrlInstitucion.updateValueAndValidity(this.institucionValue)

		this.direccionValue = informacionSobreDireccion.getAdressLine1();
		this.ctrlDireccion.updateValueAndValidity(this.direccionValue);
	}

	ionViewDidEnter() {
	  	// Antes de ingresar, verificar si hay información no guardada

	  	// Inicializar el autocomplete
		this.autocompleteService.initializeAutocomplete(document.getElementById('autocomplete').childNodes[0]);
	}

	ionViewWillLeave() {
	  // Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado;
	}

	public ocultarIcono(): boolean {
		return this.ocultarIconoNuevaSolicitud;
	}

	public guardarCambios(): void {

	}

	get cgValue(): string {
    	return JSON.stringify(this.nuevaSolicitudForm.value, null, 2);
  	}
}
