import { Component, NgZone } from '@angular/core';
import { Platform, NavController, Loading } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from '@angular/common';

/* Servicios utilizados */
import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';

/* Modelos utilizados */
import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
  directives: [FORM_DIRECTIVES],
  providers: [AutocompleteService]
})
export class NuevaSolicitudPage {

	// Variables usadas para modificar estilos, componentes visibles, etc...
	private ocultarIconoNuevaSolicitud: boolean = true;
	private esAndroid: boolean;

	//Listas usadas en la pagina
	private listaProvincias: any = [];
	private listaCiudades: any = [];
	private listaGruposSanguineos: any = [];
	private listaFactoresSanguineos: any = [];

	private nuevaSolicitud: NuevaSolicitudModel;
	private nuevaSolicitudForm: ControlGroup;

	// Informacion de Google maps
	private apiKey: any;

	private loading: any;
	private submitted: boolean = false;

	// Campos del formulario
	private ctrlInstitucion: Control;
	private institucionValue: string = '';
	
	private ctrlDireccion: Control;
	private direccionValue: string = '';

	private ctrlProvincia: Control;	
	private provinciaValue: number;	

	private ctrlCiudad: Control;
	private ciudadValue: number;	

	private ctrlHoraDesde: Control;
	private horaDesdeValue: string;
	
	private ctrlHoraHasta: Control;
	private horaHastaValue: string;

	private ctrlFactor: Control;
	private factorValue: number;

	private ctrlGrupo: Control;
	private grupoValue: number;

	constructor(private platform: Platform,
				private nav: NavController, 
				private formBuilder : FormBuilder, 
				private ngZone : NgZone,
				private connectivityService : ConnectivityService,
				private autocompleteService : AutocompleteService) {
		
		this.esAndroid = this.platform.is('android') ? true : false;

		this.inicializarProvincias();
		this.inicializarGruposSanguineos();
		this.inicializarFactoresSanguineos();

		// Inicializa los controles y sus validaciones
		this.ctrlInstitucion = new Control(this.institucionValue, Validators.required);
		this.ctrlDireccion = new Control(this.direccionValue, Validators.required);
		this.ctrlCiudad = new Control(this.ciudadValue, Validators.required);
		this.ctrlProvincia = new Control(this.provinciaValue, Validators.required);
		this.ctrlHoraDesde = new Control(this.horaDesdeValue, Validators.required);
		this.ctrlHoraHasta= new Control(this.horaHastaValue, Validators.required);
		this.ctrlFactor = new Control(this.factorValue, Validators.required);
		this.ctrlGrupo = new Control(this.grupoValue, Validators.required);

		// Inicializa el formulario
		this.nuevaSolicitudForm = formBuilder.group({
			institucion: this.ctrlInstitucion,
			direccion: this.ctrlDireccion,
			ciudad: this.ctrlCiudad,
			provincia: this.ctrlProvincia,
			horaDesde: this.ctrlHoraDesde,
			horaHasta: this.ctrlHoraHasta,
			factor: this.ctrlFactor,
			grupo: this.ctrlGrupo 
		});

		// Nos suscribimos al autocomplete para que nos envie la informacion de la direccion cuando este lista
		this.autocompleteService.autocomplete.subscribe((informacionDelLugar) => {
			this.ngZone.run(() => {
				// Ejecutamos este metodo dentro de ngZone para que angular sepa que 
				// tiene que actualizar la vista cuando esto finalice
				this.setearDireccion(informacionDelLugar);
			});
		});
	}

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	private setearDireccion(informacionSobreDireccion: any) {
		this.actualizarValor('institucion', informacionSobreDireccion.getName());
		this.actualizarValor('direccion', informacionSobreDireccion.getAdressLine1());

		this.actualizarProvincia(informacionSobreDireccion.getProvince(), informacionSobreDireccion.getCity());
	}

	// Método genérico para actualizar tanto el valor de un campo del formulario como su Control
	private actualizarValor(nombreCampo, valor): void {
		this[nombreCampo + 'Value'] = valor;
		this['ctrl' + nombreCampo.charAt(0).toUpperCase() + nombreCampo.substr(1).toLowerCase()].updateValueAndValidity(valor);
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de ciudades
	private actualizarProvincia(nombreProvincia: string, nombreCiudad: string) {
		for(let i=0; i< this.listaProvincias.length; i++) {
			if(this.listaProvincias[i].value.toLowerCase() === nombreProvincia.toLowerCase()) {
				// Seleccionamos esta provincia
				this.provinciaValue = this.listaProvincias[i].key;

				this.inicializarCiudadesDeLaProvincia().then(exito => {

					if(!exito) {
						// Mostrar error
						// TODO: procesar error
						debugger;
					} else {
						this.actualizarCiudad(nombreCiudad);
					}
				});

			}
		}
	}

	// Método que dado el nombre de una ciudad, la setea como seleccionada en el formulario
	private actualizarCiudad(nombreCiudad: string) {
		let indice = 1; 
		for(let i=0; i<this.listaCiudades.length; i++) {
			if(this.listaCiudades[i].value.toLowerCase() === nombreCiudad.toLowerCase()) {
				indice = this.listaCiudades[i].key;
			}
		}
		this.ciudadValue = indice;
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// Antes de ingresar, verificar si hay información no guardada

	  	// Inicializar el autocomplete
		this.autocompleteService.initializeAutocomplete(document.getElementById('autocomplete').childNodes[0]);
	}

	// Método que se ejecuta antes de que el usuario salga de la página
	ionViewWillLeave() {
	  // Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado;
	}

	// Método que indica que hay que ocultar el botón de nueva solicitud del la barra superior
	public ocultarIcono(): boolean {
		return this.ocultarIconoNuevaSolicitud;
	}

	// Método que setea el titulo de la pagina en la barra superior
	public setTitulo(): string {
		return 'Nueva solicitud';
	}

	private inicializarGruposSanguineos(): void {
		this.listaGruposSanguineos.push({key : '1', value: '0'});
		this.listaGruposSanguineos.push({key : '2', value: 'A'});
		this.listaGruposSanguineos.push({key : '3', value: 'AB'});
		this.listaGruposSanguineos.push({key : '4', value: 'B'});

		// this.grupoValue = this.listaGruposSanguineos[0].key;
	}

	private inicializarFactoresSanguineos(): void {
		this.listaFactoresSanguineos.push({key : '1', value: 'Rh+'});
		this.listaFactoresSanguineos.push({key : '2', value: 'Rh-'});

		// this.factorValue = this.listaFactoresSanguineos[0].key;
	}

	// Método que obtiene el listado de provincias del servidor
	private inicializarProvincias(): void {
		this.listaProvincias.push({key : '1', value: 'Buenos Aires'});
		this.listaProvincias.push({key : '2', value: 'Catamarca'});
		this.listaProvincias.push({key : '3', value: 'Chaco'});
		this.listaProvincias.push({key : '4', value: 'Chubut'});
		this.listaProvincias.push({key : '5', value: 'Ciudad Autonoma de Bs. As.'});
		this.listaProvincias.push({key : '6', value: 'Córdoba'});
		this.listaProvincias.push({key : '7', value: 'Corrientes'});
		this.listaProvincias.push({key : '8', value: 'Entre Ríos'});
		this.listaProvincias.push({key : '9', value: 'Formosa'});
		this.listaProvincias.push({key : '10', value: 'Jujuy'});
		this.listaProvincias.push({key : '11', value: 'La Pampa'});
		this.listaProvincias.push({key : '12', value: 'La Rioja'});
		this.listaProvincias.push({key : '13', value: 'Mendoza'});
		this.listaProvincias.push({key : '14', value: 'Misiones'});
		this.listaProvincias.push({key : '15', value: 'Neuquén'});
		this.listaProvincias.push({key : '16', value: 'Río Negro'});
		this.listaProvincias.push({key : '17', value: 'Salta'});
		this.listaProvincias.push({key : '18', value: 'San Juan'});
		this.listaProvincias.push({key : '19', value: 'San Luis'});
		this.listaProvincias.push({key : '20', value: 'Santa Cruz'});
		this.listaProvincias.push({key : '21', value: 'Santa Fe'});
		this.listaProvincias.push({key : '22', value: 'Santiago del Estero'});
		this.listaProvincias.push({key : '23', value: 'Tierra del Fuego'});
		this.listaProvincias.push({key : '24', value: 'Tucumán'});

		// this.provinciaValue = this.listaProvincias[0].key;

		// this.inicializarCiudadesDeLaProvincia();
	}

	// Método que obtiene el listado de ciudades de una provincia
	public inicializarCiudadesDeLaProvincia() {
		this.loading = Loading.create({
		    content: 'Cargando ciudades'
	  	});

		// Muestra el mensaje de cargando ciudades
	  	this.nav.present(this.loading);

		return new Promise(resolve => {
			setTimeout(() => {

				// Llamada al servidor para obtener las ciudades
	      		let provinciaId = this.provinciaValue;
				this.listaCiudades = [];

				this.listaCiudades.push({key : '1', value: 'Prov ' + provinciaId + ' Ciudad 1'});
				this.listaCiudades.push({key : '2', value: 'Prov ' + provinciaId + ' Ciudad 2'});
				this.listaCiudades.push({key : '3', value: 'Prov ' + provinciaId + ' Ciudad 3'});
				this.listaCiudades.push({key : '4', value: 'Prov ' + provinciaId + ' Ciudad 4'});
				this.listaCiudades.push({key : '5', value: 'Prov ' + provinciaId + ' Ciudad 5'});
				this.listaCiudades.push({key : '6', value: 'Prov ' + provinciaId + ' Ciudad 6'});
				this.listaCiudades.push({key : '7', value: 'Prov ' + provinciaId + ' Ciudad 7'});
				this.listaCiudades.push({key : '8', value: 'Prov ' + provinciaId + ' Ciudad 8'});
				this.listaCiudades.push({key : '9', value: 'Prov ' + provinciaId + ' Ciudad 9'});
				this.listaCiudades.push({key : '10', value: 'Santa Fe'});

				this.ciudadValue = this.listaCiudades[0].key;

				// Oculta el mensaje de espera
				this.loading.dismiss();

				// Resuelve la promise
			  	resolve(true);
			}, 2000);
	    });
	}

	// Método que crea la nueva solicitud con la información ingresada en el formulario
	public guardarCambios(): void {
		this.submitted = true;
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
    	return JSON.stringify(this.nuevaSolicitudForm.value, null, 2);
  	}
}
