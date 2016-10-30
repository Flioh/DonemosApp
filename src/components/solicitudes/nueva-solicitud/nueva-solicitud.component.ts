// Referencias de Angular
import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Platform, MenuController } from 'ionic-angular';

// Servicios
import { DatosService } from '../../../shared/services/datos.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { CiudadModel } from '../../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';
import { FactorSanguineoModel } from '../../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../../shared/models/grupo-sanguineo.model';

@Component({
	selector: 'nueva-solicitud-page',
	templateUrl: 'nueva-solicitud.component.html'
})
export class NuevaSolicitudPage {

	// Listados usados en la pagina
	public listaProvincias: Array<ProvinciaModel> = [];
	public listaCiudades: Array<CiudadModel> = [];
	public listaGruposSanguineos: Array<GrupoSanguineoModel> = [];
	public listaFactoresSanguineos: Array<FactorSanguineoModel> = [];

	// Modelo a utilizar en el formulario
	public nuevaSolicitud: SolicitudModel;

	private submitted: boolean = false;

	constructor(private datosService: DatosService,
		private platform: Platform,
		private menuCtrl: MenuController,
		private navCtrl: NavController, 
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController) {

		// Creamos e inicializamos el modelo
		this.nuevaSolicitud = new SolicitudModel();
		this.inicializarSolicitud();

		// Inicializa los listados de la pagina
		this.inicializarProvincias();
		this.inicializarGruposSanguineos();
		this.inicializarFactoresSanguineos();
	}

	// Método que inicializa la solicitud con los datos del usuario
	private inicializarSolicitud() {

		// TODO: setar la propiedad usuarioID de la nueva solicitud
		// --------------------------------------------------------
		// this.nuevaSolicitud.setUsuarioID(usuarioID);
	}	

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	public setearDireccion(informacionSobreDireccion: any) {
		// Setea la institucion
		this.nuevaSolicitud.institucion = informacionSobreDireccion.getNombreInstitucion();
		
		// Setea la direccion de la institucion
		this.nuevaSolicitud.direccion = informacionSobreDireccion.getDireccion();

		// Setea la provincia y la ciudad de la institucion
		this.actualizarProvinciaCiudad(informacionSobreDireccion.getNombreProvincia(), informacionSobreDireccion.getNombreCiudad());
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de ciudades
	private actualizarProvinciaCiudad(nombreProvincia: string, nombreCiudad: string) {
		for(let i=0; i< this.listaProvincias.length; i++) {

			// Buscamos la provincia por el nombre
			if(this.listaProvincias[i].nombre.toLowerCase() === nombreProvincia.toLowerCase()) {

				// Seleccionamos esta provincia
				this.nuevaSolicitud.provincia = this.listaProvincias[i];

				// Inicializamos las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia(nombreCiudad);
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
		this.nuevaSolicitud.ciudad = this.listaCiudades[indiceCiudad];
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// TODO: Antes de ingresar, verificar si hay información no guardada
	  	// -----------------------------------------------------------------

		// Deshabilitamos el menu lateral
		//this.menuCtrl.enable(false, 'unauthenticated');

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
		// Obtenemos el listado del helper
		this.listaGruposSanguineos = this.datosService.getGruposSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.grupoSanguineo = this.listaGruposSanguineos[0];
	}

	// Metodo que inicializa el listado de factores sanguineos
	private inicializarFactoresSanguineos(): void {
		// Obtenemos el listado del helper
		this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.factorSanguineo = this.listaFactoresSanguineos[0];
	}

	// Método que inicializa el listado de provincias
	private inicializarProvincias(): void {
		// Obtenemos el listado de provincias del servidor
		this.datosService.getListaProvincias().subscribe(result => {
			if(result && result.length) {
				
				// Inicializamos el listado de provincias
				this.listaProvincias = result;

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ---------------------------------------------------------------------------
				this.nuevaSolicitud.provincia = this.listaProvincias[0];

				// Carga las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia();
			} else {
					// TODO: manejar errores en las llamadas al servidor
					// -------------------------------------------------
				}
			});
	}

	// Método que inicializa el listado de ciudades de una provincia
	public inicializarCiudadesDeLaProvincia(nombreCiudad?: string): void {
		let provinciaId = this.nuevaSolicitud.provincia.id;

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
						this.nuevaSolicitud.ciudad = this.listaCiudades[0];	
					}

					// Oculta el mensaje de espera
					loadingPopup.dismiss();
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