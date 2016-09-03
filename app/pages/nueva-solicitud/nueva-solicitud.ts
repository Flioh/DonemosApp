import { Component, NgZone } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController } from 'ionic-angular';
import {FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

/* Servicios utilizados */
import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/donemos-helper-service/donemos-helper-service';

/* Modelos utilizados */
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';

@Component({
	templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
	directives: [FORM_DIRECTIVES],
	providers: [AutocompleteService]
})
export class NuevaSolicitudPage {

	// Listados usados en la pagina
	private listaProvincias: any = [];
	private listaCiudades: any = [];
	private listaGruposSanguineos: any = [];
	private listaFactoresSanguineos: any = [];

	// Modelo a utilizar en el formulario
	private nuevaSolicitud: SolicitudModel;

	private submitted: boolean = false;

	constructor(private remoteDataService: RemoteDataService,
		private platform: Platform,
		private navCtrl: NavController, 
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private connectivityService : ConnectivityService,
		private autocompleteService : AutocompleteService,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController) {
		
		// Creamos e inicializamos el modelo
		this.nuevaSolicitud = new SolicitudModel();
		this.inicializarSolicitud();

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

	private inicializarSolicitud() {

		// TODO: setar la propiedad usuarioID de la nueva solicitud
		// --------------------------------------------------------
		// this.nuevaSolicitud.setUsuarioID(usuarioID);

		this.nuevaSolicitud.setHoraDesde('08:00');
		this.nuevaSolicitud.setHoraHasta('20:00');
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
		this.nuevaSolicitud.setLocalidadID(this.listaCiudades[indiceCiudad].id);
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// TODO: Antes de ingresar, verificar si hay información no guardada
	  	// -----------------------------------------------------------------

	  	// Obtiene el input dentro del elemento ion-input
	  	let autocompleteInput = document.getElementById('autocomplete').childNodes[1];
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

		// Obtenemos el listado de provincias del servidor
		this.remoteDataService.getListaProvincias().subscribe(result => {
			if(result && result.length) {
				
				// Inicializamos el listado de provincias
				this.listaProvincias = result;

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ------------------------------------------------------------------------
				this.nuevaSolicitud.setProvinciaID(this.listaProvincias[0].id);

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
		
		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando ciudades'
		});

		// Muestra el mensaje de cargando ciudades
		loadingPopup.present();

		this.remoteDataService.getListaCiudadesPorProvincia(this.nuevaSolicitud.getProvinciaID())
		.subscribe(result => {
			if(result && result.length){
				this.listaCiudades = result;

				if(nombreCiudad) {
						// Si recibimos el nombre de la ciudad (autocomplete), seleccionamos esa ciudad
						this.actualizarCiudad(nombreCiudad);
					} else {
						// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
						// ------------------------------------------------------------------------	
						this.nuevaSolicitud.setLocalidadID(this.listaCiudades[0].id);	
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
		debugger;
		this.submitted = true;
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
		return JSON.stringify(this.nuevaSolicitud, null, 2);
	}
}
