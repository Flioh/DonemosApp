import { Component, NgZone } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

/* Servicios utilizados */
import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/helper-service/helper-service';

/* Modelos utilizados */
import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

@Component({
  templateUrl: 	'build/pages/nueva-solicitud/nueva-solicitud.html',
  directives: 	[FORM_DIRECTIVES],
  providers: 	[AutocompleteService]
})
export class NuevaSolicitudPage {

	// Listados usados en la pagina
	private listaProvincias: any = [];
	private listaCiudades: any = [];
	private listaGruposSanguineos: any = [];
	private listaFactoresSanguineos: any = [];

	// Modelo a utilizar en el formulario
	private nuevaSolicitud: NuevaSolicitudModel;

	private submitted: boolean = false;

	constructor(private platform: Platform,
				private navCtrl: NavController, 
				private formBuilder : FormBuilder, 
				private ngZone : NgZone,
				private connectivityService : ConnectivityService,
				private autocompleteService : AutocompleteService,
				private loadingCtrl : LoadingController) {
		
		// Inicializamos el modelo
		this.nuevaSolicitud = new NuevaSolicitudModel();

		// Inicializa los listados de la pagina
		this.inicializarProvincias();
		this.inicializarGruposSanguineos();
		this.inicializarFactoresSanguineos();

		// Nos suscribimos al autocomplete para que nos envie la informacion de la direccion cuando este lista
		this.autocompleteService.autocomplete.subscribe((informacionDelLugar) => {
			this.ngZone.run(() => {
				// Ejecutamos este metodo dentro de ngZone para que angular sepa que 
				// tiene que actualizar la vista cuando finalice
				this.setearDireccion(informacionDelLugar);
			});
		});
	}

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	private setearDireccion(informacionSobreDireccion: any) {
		// Setea la institucion
		this.nuevaSolicitud.setInstitucion(informacionSobreDireccion.getName());
		
		// Setea la direccion de la institucion
		this.nuevaSolicitud.setDireccion(informacionSobreDireccion.getAdressLine1());

		// Setea la provincia y la ciudad de la institucion
		this.actualizarProvinciaYCiudad(informacionSobreDireccion.getProvince(), informacionSobreDireccion.getCity());
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de ciudades
	private actualizarProvinciaYCiudad(nombreProvincia: string, nombreCiudad: string) {
		for(let i=0; i< this.listaProvincias.length; i++) {

			// Buscamos la provincia por el nombre
			if(this.listaProvincias[i].nombre.toLowerCase() === nombreProvincia.toLowerCase()) {
				
				// Seleccionamos esta provincia
				this.nuevaSolicitud.setProvinciaID(this.listaProvincias[i].id);

				// Inicializamos las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia().then(exito => {

					if(!exito) {
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
		let indiceCiudad = -1; 
		for(let i=0; i<this.listaCiudades.length; i++) {
			// Buscamos la ciudad por su nombre
			if(this.listaCiudades[i].nombre.toLowerCase() === nombreCiudad.toLowerCase()) {
				indiceCiudad = i;
			}
		}

		// Seleccionamos la ciudad pasada como parametro o la primera en su defecto
		indiceCiudad = indiceCiudad > -1 ? indiceCiudad : 0;

		// Setea la ciudad en base a su ID
		this.nuevaSolicitud.setLocalidadID(this.listaCiudades[indiceCiudad].id);
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// TODO: Antes de ingresar, verificar si hay información no guardada
	  	// -----------------------------------------------------------------

	  	// Obtiene el input dentro del elemento ion-input
	  	let autocompleteInput = document.getElementById('autocomplete').childNodes[0].nextElementSibling;
	  	// Inicializar el autocomplete
		this.autocompleteService.initializeAutocomplete(autocompleteInput);
	}

	// Método que se ejecuta antes de que el usuario salga de la página
	ionViewWillLeave() {
	  // TODO: Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado
	  // --------------------------------------------------------------------------------------
	}

	// Metodo que inicializa el listado de grupos sanguineos
	private inicializarGruposSanguineos(): void {
		// Obtenemos el listado del helper
		this.listaGruposSanguineos = GrupoSanguineoHelper.getGruposSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setGrupoSanguineoID(this.listaGruposSanguineos[0].id);
	}

	// Metodo que inicializa el listado de factores sanguineos
	private inicializarFactoresSanguineos(): void {
		// Obtenemos el listado del helper
		this.listaFactoresSanguineos = FactorSanguineoHelper.getFactoresSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setFactorSanguineoID(this.listaFactoresSanguineos[0].id);
	}

	// Método que inicializa el listado de provincias
	private inicializarProvincias(): void {

		// TODO: reemplazar por llamada al servicio
		// ----------------------------------------
		this.listaProvincias.push({id : 1, nombre: 'Buenos Aires'});
		this.listaProvincias.push({id : 2, nombre: 'Catamarca'});
		this.listaProvincias.push({id : 3, nombre: 'Chaco'});
		this.listaProvincias.push({id : 4, nombre: 'Chubut'});
		this.listaProvincias.push({id : 5, nombre: 'Ciudad Autonoma de Bs. As.'});
		this.listaProvincias.push({id : 6, nombre: 'Córdoba'});
		this.listaProvincias.push({id : 7, nombre: 'Corrientes'});
		this.listaProvincias.push({id : 8, nombre: 'Entre Ríos'});
		this.listaProvincias.push({id : 9, nombre: 'Formosa'});
		this.listaProvincias.push({id : 10, nombre: 'Jujuy'});
		this.listaProvincias.push({id : 11, nombre: 'La Pampa'});
		this.listaProvincias.push({id : 12, nombre: 'La Rioja'});
		this.listaProvincias.push({id : 13, nombre: 'Mendoza'});
		this.listaProvincias.push({id : 14, nombre: 'Misiones'});
		this.listaProvincias.push({id : 15, nombre: 'Neuquén'});
		this.listaProvincias.push({id : 16, nombre: 'Río Negro'});
		this.listaProvincias.push({id : 17, nombre: 'Salta'});
		this.listaProvincias.push({id : 18, nombre: 'San Juan'});
		this.listaProvincias.push({id : 19, nombre: 'San Luis'});
		this.listaProvincias.push({id : 20, nombre: 'Santa Cruz'});
		this.listaProvincias.push({id : 21, nombre: 'Santa Fe'});
		this.listaProvincias.push({id : 22, nombre: 'Santiago del Estero'});
		this.listaProvincias.push({id : 23, nombre: 'Tierra del Fuego'});
		this.listaProvincias.push({id : 24, nombre: 'Tucumán'});

		// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
		// ------------------------------------------------------------------------
		this.nuevaSolicitud.setProvinciaID(this.listaProvincias[0].id);

		// Carga las ciudades de la provincia seleccionada
		this.inicializarCiudadesDeLaProvincia();
	}

	// Método que inicializa el listado de ciudades de una provincia
	public inicializarCiudadesDeLaProvincia() {
		
		let loadingPopup = this.loadingCtrl.create({
		    content: 'Cargando ciudades'
		});

		// Muestra el mensaje de cargando ciudades
		loadingPopup.present();

		return new Promise(resolve => {
			setTimeout(() => {

				// TODO: reemplazar por llamada al servicio
	      		let provinciaId = this.nuevaSolicitud.getProvinciaID();
				this.listaCiudades = [];

				this.listaCiudades.push({id : 1, nombre: 'Prov ' + provinciaId + ' Ciudad 01'});
				this.listaCiudades.push({id : 2, nombre: 'Prov ' + provinciaId + ' Ciudad 02'});
				this.listaCiudades.push({id : 3, nombre: 'Prov ' + provinciaId + ' Ciudad 03'});
				this.listaCiudades.push({id : 4, nombre: 'Prov ' + provinciaId + ' Ciudad 04'});
				this.listaCiudades.push({id : 5, nombre: 'Prov ' + provinciaId + ' Ciudad 05'});
				this.listaCiudades.push({id : 6, nombre: 'Prov ' + provinciaId + ' Ciudad 06'});
				this.listaCiudades.push({id : 7, nombre: 'Prov ' + provinciaId + ' Ciudad 07'});
				this.listaCiudades.push({id : 8, nombre: 'Prov ' + provinciaId + ' Ciudad 08'});
				this.listaCiudades.push({id : 9, nombre: 'Prov ' + provinciaId + ' Ciudad 09'});
				this.listaCiudades.push({id : 10, nombre: 'Prov ' + provinciaId + ' Ciudad 10'});

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ------------------------------------------------------------------------
				this.nuevaSolicitud.setLocalidadID(this.listaCiudades[0].id);

				// Oculta el mensaje de espera
				loadingPopup.dismiss();

				// Resuelve la promise
			  	resolve(true);
			}, 2000);
	    });
	}

	// Método que crea la nueva solicitud con la información ingresada en el formulario
	public guardarCambios(): void {
		debugger;
		this.submitted = true;
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
    	return JSON.stringify(this.nuevaSolicitud, null, 2);
  	}
}
