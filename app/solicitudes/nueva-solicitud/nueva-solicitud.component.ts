// Referencias de Angular
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FORM_DIRECTIVES } from '@angular/forms';

// Referencias de Ionic
import { AlertController, Events, LoadingController, NavController, Platform, MenuController } from 'ionic-angular';

// Servicios
import { DatosService } from '../../shared/services/datos.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';

// Componente base
import { BasePage } from '../../shared/components/base/base.component';

import { CiudadModel } from '../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';

// Directivas
import { InstitucionesAutocompleteDirective } from '../../shared/directives/instituciones-autocomplete.directive';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

@Component({
	templateUrl: 'build/solicitudes/nueva-solicitud/nueva-solicitud.component.html',
	directives: [ InstitucionesAutocompleteDirective, FORM_DIRECTIVES ]
})
export class NuevaSolicitudPage extends BasePage{

	// Listados usados en la pagina
	private listaProvincias: Array<ProvinciaModel> = [];
	private listaCiudades: Array<CiudadModel> = [];
	private listaGruposSanguineos: Array<GrupoSanguineoModel> = [];
	private listaFactoresSanguineos: Array<FactorSanguineoModel> = [];

	// Modelo a utilizar en el formulario
	private nuevaSolicitud: SolicitudModel;

	private submitted: boolean = false;

	constructor(private datosService: DatosService,
		private platform: Platform,
		private menuCtrl: MenuController,
		private navCtrl: NavController, 
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController,
		eventsCtrl: Events,
		config: AppConfig) {

		// Inicializa la clase padre manualmente debido a un issue de angular
		// https://github.com/angular/angular/issues/5155
		super(eventsCtrl, config);

		this.iniciarTimer('NuevaSolicitudPage / constructor');

		// Creamos e inicializamos el modelo
		this.nuevaSolicitud = new SolicitudModel();
		this.inicializarSolicitud();

		// Inicializa los listados de la pagina
		this.inicializarProvincias();
		this.inicializarGruposSanguineos();
		this.inicializarFactoresSanguineos();

		this.detenerTimer('NuevaSolicitudPage / constructor');
	}

	// Método que inicializa la solicitud con los datos del usuario
	private inicializarSolicitud() {

		// TODO: setar la propiedad usuarioID de la nueva solicitud
		// --------------------------------------------------------
		// this.nuevaSolicitud.setUsuarioID(usuarioID);
	}	

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	private setearDireccion(informacionSobreDireccion: any) {

		this.iniciarTimer('NuevaSolicitudPage / setearDireccion');

		// Setea la institucion
		this.nuevaSolicitud.setInstitucion(informacionSobreDireccion.getNombreInstitucion());
		
		// Setea la direccion de la institucion
		this.nuevaSolicitud.setDireccion(informacionSobreDireccion.getDireccion());

		// Setea la provincia y la ciudad de la institucion
		this.actualizarProvinciaCiudad(informacionSobreDireccion.getNombreProvincia(), informacionSobreDireccion.getNombreCiudad());

		this.detenerTimer('NuevaSolicitudPage / setearDireccion');	
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de ciudades
	private actualizarProvinciaCiudad(nombreProvincia: string, nombreCiudad: string) {

		this.iniciarTimer('NuevaSolicitudPage / actualizarProvinciaCiudad');

		for(let i=0; i< this.listaProvincias.length; i++) {

			// Buscamos la provincia por el nombre
			if(this.listaProvincias[i].getNombre().toLowerCase() === nombreProvincia.toLowerCase()) {

				// Seleccionamos esta provincia
				this.nuevaSolicitud.setProvincia(this.listaProvincias[i]);

				// Inicializamos las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia(nombreCiudad);
			}
		}

		this.detenerTimer('NuevaSolicitudPage / actualizarProvinciaCiudad');
	}

	// Método que dado el nombre de una ciudad, la setea como seleccionada en el formulario
	private actualizarCiudad(nombreCiudad: string) {

		this.iniciarTimer('NuevaSolicitudPage / actualizarCiudad');

		let indiceCiudad = -1; 
		for(let i=0; i<this.listaCiudades.length; i++) {

			// Buscamos la ciudad por su nombre
			if(this.listaCiudades[i].getNombre().toLowerCase() === nombreCiudad.toLowerCase()) {
				indiceCiudad = i;
			}
		}

		// Seleccionamos la ciudad pasada como parametro o la primera en su defecto
		indiceCiudad = indiceCiudad > -1 ? indiceCiudad : 0;

		// Setea la ciudad en base a su ID
		this.nuevaSolicitud.setCiudad(this.listaCiudades[indiceCiudad]);

		this.detenerTimer('NuevaSolicitudPage / actualizarCiudad');
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// TODO: Antes de ingresar, verificar si hay información no guardada
	  	// -----------------------------------------------------------------

		// Deshabilitamos el menu lateral
		this.menuCtrl.enable(false, 'unauthenticated');

	  	// Obtiene el input dentro del elemento ion-input
	  	//let autocompleteInput = document.getElementById('autocomplete').childNodes[1];
	  	// Inicializar el autocomplete
	  	//this.autocompleteService.initializeAutocomplete(autocompleteInput);
	}

	// Método que se ejecuta antes de que el usuario salga de la página
	ionViewWillLeave() {
	  // TODO: Antes de salir de la pantalla, guardar cualquier cambio que no se haya guardado
	  // --------------------------------------------------------------------------------------
	}

	// Metodo que inicializa el listado de grupos sanguineos
	private inicializarGruposSanguineos(): void {

		this.iniciarTimer('NuevaSolicitudPage / inicializarGruposSanguineos');

		// Obtenemos el listado del helper
		this.listaGruposSanguineos = this.datosService.getGruposSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setGrupoSanguineo(this.listaGruposSanguineos[0]);

		this.detenerTimer('NuevaSolicitudPage / inicializarGruposSanguineos');
	}

	// Metodo que inicializa el listado de factores sanguineos
	private inicializarFactoresSanguineos(): void {

		this.iniciarTimer('NuevaSolicitudPage / inicializarFactoresSanguineos');

		// Obtenemos el listado del helper
		this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setFactorSanguineo(this.listaFactoresSanguineos[0]);

		this.detenerTimer('NuevaSolicitudPage / inicializarFactoresSanguineos');
	}

	// Método que inicializa el listado de provincias
	private inicializarProvincias(): void {

		this.iniciarTimer('NuevaSolicitudPage / inicializarProvincias');

		// Obtenemos el listado de provincias del servidor
		this.datosService.getListaProvincias().subscribe(result => {
			if(result && result.length) {
				
				// Inicializamos el listado de provincias
				this.listaProvincias = result;

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ---------------------------------------------------------------------------
				this.nuevaSolicitud.setProvincia(this.listaProvincias[0]);

				// Carga las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia();

				this.detenerTimer('NuevaSolicitudPage / inicializarProvincias');

			} else {
					// TODO: manejar errores en las llamadas al servidor
					// -------------------------------------------------
				}
			});
	}

	// Método que inicializa el listado de ciudades de una provincia
	public inicializarCiudadesDeLaProvincia(nombreCiudad?: string): void {

		this.iniciarTimer('NuevaSolicitudPage / inicializarCiudadesDeLaProvincia');
		
		let provinciaId = this.nuevaSolicitud.getProvincia().getId();

		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando ciudades'
		});

		// Muestra el mensaje de cargando ciudades
		loadingPopup.present();
		this.datosService.getListaCiudadesPorProvincia(provinciaId)
		.subscribe(result => {
			if(result && result.length){
				this.listaCiudades = result;
					if(nombreCiudad) {
						// Si recibimos el nombre de la ciudad (autocomplete), seleccionamos esa ciudad
						this.actualizarCiudad(nombreCiudad);
					} else {
						// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
						// ---------------------------------------------------------------------------

						// Setea la ciudad en base a su ID
						this.nuevaSolicitud.setCiudad(this.listaCiudades[0]);	
					}

					// Oculta el mensaje de espera
					loadingPopup.dismiss();

					this.detenerTimer('NuevaSolicitudPage / inicializarCiudadesDeLaProvincia');
				}
				// TODO: manejar errores en las llamadas al servidor
				// -------------------------------------------------			
			});
	}

	// Método que crea la nueva solicitud con la información ingresada en el formulario
	public guardarCambios(): void {
		this.submitted = true;
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
		return JSON.stringify(this.nuevaSolicitud, null, 2);
	}
}
