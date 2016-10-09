import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { CiudadModel } from '../../models/ciudad-model/ciudad-model';
import { FactorSanguineoModel } from '../../models/factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../../models/grupo-sanguineo-model/grupo-sanguineo-model';
import { ProvinciaModel } from '../../models/provincia-model/provincia-model';
import { DatosRemotosService } from '../../providers/datos-remotos-service/datos-remotos-service';
import { SolicitudModel } from '../../models/solicitud-model/solicitud-model';
import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FORM_DIRECTIVES } from '@angular/forms';
import { AlertController, LoadingController, NavController, Platform, MenuController } from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/nueva-solicitud/nueva-solicitud.html',
	directives: [FORM_DIRECTIVES],
	providers: [AutocompleteService]
})
export class NuevaSolicitudPage {

	// Listados usados en la pagina
	private listaProvincias: Array<ProvinciaModel> = [];
	private listaCiudades: Array<CiudadModel> = [];
	private listaGruposSanguineos: Array<GrupoSanguineoModel> = [];
	private listaFactoresSanguineos: Array<FactorSanguineoModel> = [];

	// Modelo a utilizar en el formulario
	private nuevaSolicitud: SolicitudModel;

	private submitted: boolean = false;

	constructor(private datosRemotosService: DatosRemotosService,
		private platform: Platform,
		private menuCtrl: MenuController,
		private navCtrl: NavController, 
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private autocompleteService : AutocompleteService,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController) {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / constructor');
    	}

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

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / constructor');
    	}
	}

	private inicializarSolicitud() {

		// TODO: setar la propiedad usuarioID de la nueva solicitud
		// --------------------------------------------------------
		// this.nuevaSolicitud.setUsuarioID(usuarioID);
	}	

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	private setearDireccion(informacionSobreDireccion: any) {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / setearDireccion');
    	}

		// Setea la institucion
		this.nuevaSolicitud.setInstitucion(informacionSobreDireccion.getName());
		
		// Setea la direccion de la institucion
		this.nuevaSolicitud.setDireccion(informacionSobreDireccion.getAdressLine1());

		// Setea la provincia y la ciudad de la institucion
		this.actualizarProvinciaYCiudad(informacionSobreDireccion.getProvince(), informacionSobreDireccion.getCity());

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / setearDireccion');
    	}		
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de ciudades
	private actualizarProvinciaYCiudad(nombreProvincia: string, nombreCiudad: string) {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / actualizarProvinciaYCiudad');
    	}

		for(let i=0; i< this.listaProvincias.length; i++) {

			// Buscamos la provincia por el nombre
			if(this.listaProvincias[i].getNombre().toLowerCase() === nombreProvincia.toLowerCase()) {

				// Seleccionamos esta provincia
				this.nuevaSolicitud.setProvincia(this.listaProvincias[i]);

				// Inicializamos las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia(nombreCiudad);
			}
		}

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / actualizarProvinciaYCiudad');
    	}
	}

	// Método que dado el nombre de una ciudad, la setea como seleccionada en el formulario
	private actualizarCiudad(nombreCiudad: string) {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / actualizarCiudad');
    	}

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

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / actualizarCiudad');
    	}
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
	  	// TODO: Antes de ingresar, verificar si hay información no guardada
	  	// -----------------------------------------------------------------

		// Deshabilitamos el menu lateral
		this.menuCtrl.enable(false, 'unauthenticated');

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

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / inicializarGruposSanguineos');
    	}

		// Obtenemos el listado del helper
		this.listaGruposSanguineos = this.datosRemotosService.getGruposSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setGrupoSanguineo(this.listaGruposSanguineos[0]);

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / inicializarGruposSanguineos');
    	}
	}

	// Metodo que inicializa el listado de factores sanguineos
	private inicializarFactoresSanguineos(): void {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / inicializarFactoresSanguineos');
    	}

		// Obtenemos el listado del helper
		this.listaFactoresSanguineos = this.datosRemotosService.getFactoresSanguineos();

		// TODO: asignar el que hayan configurado en la pagina de preferencias
		// -------------------------------------------------------------------
		this.nuevaSolicitud.setFactorSanguineo(this.listaFactoresSanguineos[0]);

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.timeEnd('NuevaSolicitudPage / inicializarFactoresSanguineos');
    	}
	}

	// Método que inicializa el listado de provincias
	private inicializarProvincias(): void {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / inicializarProvincias');
    	}

		// Obtenemos el listado de provincias del servidor
		this.datosRemotosService.getListaProvincias().subscribe(result => {
			if(result && result.length) {
				
				// Inicializamos el listado de provincias
				this.listaProvincias = result;

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ---------------------------------------------------------------------------
				this.nuevaSolicitud.setProvincia(this.listaProvincias[0]);

				// Carga las ciudades de la provincia seleccionada
				this.inicializarCiudadesDeLaProvincia();

				if(this.datosRemotosService.modoDebugActivado()) {
      				console.timeEnd('NuevaSolicitudPage / inicializarProvincias');
    			}

			} else {
					// TODO: manejar errores en las llamadas al servidor
					// -------------------------------------------------
				}
			});
	}

	// Método que inicializa el listado de ciudades de una provincia
	public inicializarCiudadesDeLaProvincia(nombreCiudad?: string): void {

		if(this.datosRemotosService.modoDebugActivado()) {
      		console.time('NuevaSolicitudPage / inicializarCiudadesDeLaProvincia');
    	}
		
		let provinciaId = this.nuevaSolicitud.getProvincia().getId();

		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando ciudades'
		});

		// Muestra el mensaje de cargando ciudades
		loadingPopup.present();
		this.datosRemotosService.getListaCiudadesPorProvincia(provinciaId)
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

					if(this.datosRemotosService.modoDebugActivado()) {
      					console.timeEnd('NuevaSolicitudPage / inicializarCiudadesDeLaProvincia');
    				}
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
