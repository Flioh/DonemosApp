// Referencias de Angular
import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Platform, MenuController, NavParams, ModalController } from 'ionic-angular';

// Servicios
import { DatosService } from '../../../shared/services/datos.service';
import { DonacionesService } from '../../../shared/services/donaciones.service';
import { LoginService } from '../../../shared/services/login.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { LocalidadModel } from '../../../shared/models/localidad.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';

// Paginas y comonentes
import { ListaSolicitudesPage } from '../lista-solicitudes/lista-solicitudes.component';
import { BasePage } from '../../../shared/components/base/base.component';
import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';

@Component({
	selector: 'nueva-solicitud-page',
	templateUrl: 'nueva-solicitud.component.html'
})
export class NuevaSolicitudPage extends BasePage{

	// Listados usados en la pagina
	public listaProvincias: Array<ProvinciaModel> = [];
	public listaLocalidades: Array<LocalidadModel> = [];
	public listaGruposSanguineos: Array<{ id: number, nombre: string }> = [];
	public listaFactoresSanguineos: Array<{ id: number, nombre: string }> = [];

	// Modelo a utilizar en el formulario
	public nuevaSolicitud: SolicitudModel;

	private mostrarAdvertenciaAlSalir: boolean;

	// Matriz con los tipos sanguineos solicitados
	public tiposSanguineos: Array<Array<{ nombre: string, seleccionado: boolean }>>;

	public mostrarErrorProvincia: boolean;
	public mostrarErrorLocalidad: boolean;

	public mostrarErrorTipoSanguineo: boolean;

	private submitted: boolean = false;

	// Propiedad que permite determinar si estamos creando una nueva solicitud
	// o modificando una ya existente
	public modoEdicion: boolean;

	constructor(private datosService: DatosService,
		private donacionesService: DonacionesService,
		private loginService: LoginService,
		private platform: Platform,
		private menuCtrl: MenuController,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController,
		private paramsCtrl: NavParams) {

		super();

		let solicitudRecibida = this.paramsCtrl.get('unaSolicitud');

		// Establecemos el modo de la pantalla
		this.modoEdicion = solicitudRecibida ? true : false;

		// Obtenemos la solicitud existente pasada como parametro o creamos una nueva insatancia
		this.nuevaSolicitud = solicitudRecibida || new SolicitudModel();
		
		if(!this.modoEdicion) {
			
			if(this.loginService.user && this.loginService.user.user_id) {
				// Si es una nueva solicitud, asignamos el ID del usuario
				this.nuevaSolicitud.usuarioID = this.loginService.user.user_id;
			} else {
				this.procesarError(this.config.excepcionEditarSolicitud, 'constructor', 'NuevaSolicitudPage', 'error', `El usuario no posee id pero accedio a editar la solicitud ${JSON.stringify(this.nuevaSolicitud)}.`, null);
				this.mostrarMensajeError('Error', this.config.errorEditarSolicitud);
			}
		}

		this.mostrarErrorLocalidad = false;
		this.mostrarErrorProvincia = false;

		this.mostrarErrorTipoSanguineo = false;

		// Inicializa los listados de la pagina
		this.inicializarListado();
		this.inicializarTiposSanguineos();
	}

	// Método que inicializa el estado de los botones de tipos sanguineos
	private inicializarTiposSanguineos(): void{
		
		// En la primer fila se muestran todos los positivos, en la segunda todos los negativos
		this.tiposSanguineos = new Array(2);
		for(let i=0; i<this.tiposSanguineos.length; i++) {

			// En cada columna se muestra un grupo sanguineo: 0 A B AB			
			this.tiposSanguineos[i] = new Array(4);
			for(let j=0; j<this.tiposSanguineos[i].length; j++) {
				this.tiposSanguineos[i][j] = {
					nombre : this.donacionesService.getDescripcionCompleta(j, i),
					seleccionado : false
				}
			}
		}

		if(this.nuevaSolicitud.tiposSanguineos){
			// Si estamos editando, preseleccionamos los tipos de la solicitud
			for(let i=0; i< this.nuevaSolicitud.tiposSanguineos.length; i++) {
				let grupoSanguineoId = this.nuevaSolicitud.tiposSanguineos[i].grupoSanguineo;
				let factorSanguineoId = this.nuevaSolicitud.tiposSanguineos[i].factorSanguineo;
				this.tiposSanguineos[factorSanguineoId][grupoSanguineoId] = {
					nombre : this.donacionesService.getDescripcionCompleta(grupoSanguineoId, factorSanguineoId),
					seleccionado : true
				};
			}
		}

	}

	// Método que cambia el estado al presionar el boton correspondiente a un tipo sanguineo
	public toggleTipoSanguineo(tipoSanguineo: {nombre: string, seleccionado: boolean}): void {
		tipoSanguineo.seleccionado = !tipoSanguineo.seleccionado;

		// Si no quedo ningun tipo sanguineo seleccionado, mostramos un error
		this.mostrarErrorTipoSanguineo = this.seleccionoAlgunTipoSanguineo() ? false : true;
	}

	// Método que devuelve verdadero si hay algun tipo sanguineo seleccionado
	private seleccionoAlgunTipoSanguineo(): boolean {
		for(let i=0; i<2; i++) {
			for(let j=0; j<4; j++) {
				if(this.tiposSanguineos[i][j].seleccionado)
					return true;
			}
		}
		return false;
	}

	// Método que recibe la dirección del autocomplete y la ingresa en el formulario
	public setearDireccion(informacionSobreDireccion: any) {
		// Setea la institucion
		this.nuevaSolicitud.institucion = informacionSobreDireccion.getNombreInstitucion();
		
		// Setea la direccion de la institucion
		this.nuevaSolicitud.direccion = informacionSobreDireccion.getDireccion();

		// Setea la provincia y la localidad de la institucion
		this.actualizarProvinciaLocalidad(informacionSobreDireccion.getNombreProvincia(), informacionSobreDireccion.getNombreLocalidad());
	}

	// Método que dado el nombre de una provincia, la setea como seleccionada en el formulario y actualiza el listado de localidades
	private actualizarProvinciaLocalidad(nombreProvincia: string, nombreLocalidad: string) {
		for(let i=0; i< this.listaProvincias.length; i++) {

			// Buscamos la provincia por el nombre
			if(this.listaProvincias[i].nombre.toLowerCase() === nombreProvincia.toLowerCase()) {

				// Seleccionamos esta provincia
				this.nuevaSolicitud.provincia = this.listaProvincias[i];

				// Inicializamos las localidades de la provincia seleccionada
				this.inicializarLocalidadesDeLaProvincia(nombreLocalidad);
			}
		}
	}

	// Método que dado el nombre de una localidad, la setea como seleccionada en el formulario
	private actualizarLocalidad(nombreLocalidad: string) {
		let indiceLocalidad = -1; 
		for(let i=0; i<this.listaLocalidades.length; i++) {

			// Buscamos la localidad por su nombre
			if(this.listaLocalidades[i].nombre.toLowerCase() === nombreLocalidad.toLowerCase()) {
				indiceLocalidad = i;
			}
		}

		// Seleccionamos la localidad pasada como parametro o la primera en su defecto
		indiceLocalidad = indiceLocalidad > -1 ? indiceLocalidad : 0;

		// Setea la localidad en base a su ID
		this.nuevaSolicitud.localidad = this.listaLocalidades[indiceLocalidad];
	}

	// Método que se ejecuta antes de que el usuario ingrese a la página
	ionViewDidEnter() {
		this.mostrarAdvertenciaAlSalir = true;
	}

	// Método que se ejecuta antes de que el usuario salga de la página
	ionViewCanLeave() {
		if(this.mostrarAdvertenciaAlSalir) {
			let popupAdvertencia = this.alertCtrl.create({
				title: 'Salir',
				message: '¿Estás seguro que deseas salir? Se perderán los cambios no guardados.',
				buttons: [{
					text: 'Salir',
					handler: () => {
						popupAdvertencia.dismiss().then(() => {
							this.volverAtras();
						});			
					}
				},
				{
					text: 'Permanecer',
					handler: () => {

					}
				}]
			});

			// Mostramos el popup
			popupAdvertencia.present();

			// Devolvemos false para evitar que se cierre la pagina
			return false;
		}
	}

	// Método que vuelve a la pantalla anterior
	private volverAtras() {
		this.mostrarAdvertenciaAlSalir = false;
		this.navCtrl.pop();
	}

	// Método que inicializa los listados de la página
	private inicializarListado(): void {

		// Inicializamos el listado de grupos sanguineos
		this.listaGruposSanguineos = this.datosService.getGruposSanguineos();
		
		// Inicializamos el listado de factores sanguineos
		this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();

		// Obtenemos el listado de provincias del servidor
		this.datosService.getListaProvincias().subscribe(
			(result) => {
				if(result && result.length) {

					// Inicializamos el listado de provincias
					this.listaProvincias = result;

					let indiceProvincia;

					if(this.nuevaSolicitud.provincia.id) {
						indiceProvincia = this.getIndicePorID(this.listaProvincias, this.nuevaSolicitud.provincia.id);
					}

					if(indiceProvincia){
						// Asignamos el objeto del listado para que se muestre correctamente
						this.nuevaSolicitud.provincia = this.listaProvincias[indiceProvincia];

						// Carga las localidades de la provincia seleccionada
						this.inicializarLocalidadesDeLaProvincia(this.nuevaSolicitud.localidad.nombre);
					}
				} else {
					this.procesarError(this.config.excepcionListaProvincias, 'inicializarListado', 'NuevaSolicitudPage', 'error', 'Error al obtener el listado de provincias.', result);
					this.mostrarMensajeError('Error', this.config.errorProvincias);
				}
			},
			(error) => {
				this.procesarError(this.config.excepcionListaProvincias, 'inicializarListado', 'NuevaSolicitudPage', 'error', 'Error al obtener el listado de provincias.', error);
				this.mostrarMensajeError('Error', this.config.errorProvincias);
			});
	}

	// Método que inicializa el listado de localidades de una provincia
	public inicializarLocalidadesDeLaProvincia(nombreLocalidad?: string): void {
		let provinciaId = this.nuevaSolicitud.provincia.id;

		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando localidades'
		});

		// Muestra el mensaje de cargando localidades
		loadingPopup.present();

		this.datosService.getListaLocalidadesPorProvincia(provinciaId).subscribe(
			(result) => {
				if(result && result.length){
					this.listaLocalidades = result;

					if(nombreLocalidad) {
						// Si recibimos el nombre de la localidad (autocomplete), seleccionamos esa localidad
						this.actualizarLocalidad(nombreLocalidad);
					}

					// Oculta el mensaje de espera
					loadingPopup.dismiss();
				} else {

					// Oculta el mensaje de espera
					loadingPopup.dismiss();

					this.procesarError(this.config.excepcionListaLocalidades, 'inicializarLocalidadesDeLaProvincia', 'NuevaSolicitudPage', 'error', `Error al obtener el listado de localidades de la provincia ${provinciaId}.`, result);
					this.mostrarMensajeError('Error', this.config.errorLocalidades);
				}				
			}, (error) => {

				// Oculta el mensaje de espera
				loadingPopup.dismiss();

				this.procesarError(this.config.excepcionListaLocalidades, 'inicializarLocalidadesDeLaProvincia', 'NuevaSolicitudPage', 'error', `Error al obtener el listado de localidades de la provincia ${provinciaId}.`, error);
				this.mostrarMensajeError('Error', this.config.errorLocalidades);
			});
	}

	// Método que obtiene el indice del elemento cuyo id es el pasado como parametro
	public getIndicePorID(listado: Array<any>, id: string): number {

		for(let i=0; i<listado.length; i++) {
			if(id === listado[i].id)
				return i;
		}

		return -1;
	}

	// Método que crea la nueva solicitud con la información ingresada en el formulario
	public guardarCambios(): void {

		let loadingPopup = this.loadingCtrl.create({
			content: 'Guardando solicitud'
		});

		loadingPopup.present();

		this.submitted = true;

		this.mostrarAdvertenciaAlSalir = false;

		// Nos aseguramos que la cantidad sea un numero
		this.nuevaSolicitud.cantidadDadores = +this.nuevaSolicitud.cantidadDadores;

		// Seteamos los tipos sanguineos solicitados en la solicitud
		this.nuevaSolicitud.tiposSanguineos = [];

		// Las filas representan los factores sanguineos
		for(let i=0; i<this.tiposSanguineos.length; i++) {

			// Las columnas representan los grupos sanguineos
			for(let j=0; j<this.tiposSanguineos[i].length; j++) {

				if(this.tiposSanguineos[i][j].seleccionado) {
					this.nuevaSolicitud.tiposSanguineos.push({
						grupoSanguineo: j,
						factorSanguineo: i
					});
				}
			}
		}

		let solicitudId = this.modoEdicion ? this.nuevaSolicitud.solicitudID : null;

		this.datosService.guardarSolicitud(this.nuevaSolicitud, solicitudId)
		.subscribe(
			(result) => { 

				// Ocultamos el mensaje de espera
				loadingPopup.dismiss().then(() => {

					// Mostramos el listado de solicitudes cargadas por el usuario
					this.navCtrl.setRoot(ListaSolicitudesPage);
				});

			},
			(error) => { 

				// Ocultamos el mensaje de espera
				loadingPopup.dismiss();

				if(!this.modoEdicion) {
					this.procesarError(this.config.excepcionCrearSolicitud, 'guardarCambios', 'NuevaSolicitudPage', 'error', `Error al crear la solicitud ${JSON.stringify(this.nuevaSolicitud)}.`, error);
					this.mostrarMensajeError('Error', this.config.errorCrearSolicitud);
				} else {
					this.procesarError(this.config.excepcionEditarSolicitud, 'guardarCambios', 'NuevaSolicitudPage', 'error', `Error al editar la solicitud ${JSON.stringify(this.nuevaSolicitud)}.`, error);
					this.mostrarMensajeError('Error', this.config.errorEditarSolicitud);
				}
				
			});
	}


	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
		return JSON.stringify(this.nuevaSolicitud, null, 2);
	}

	// Método que muestra un listado de provincias
	public abrirModalProvincias() {
		// Creamos el componente
		let provinciaModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Provincia', listaOpciones: this.listaProvincias });

		provinciaModal.onDidDismiss(opcionSeleccionada => {

			if(opcionSeleccionada) {
				// Si el usuario selecciono alguna de las opciones
				this.nuevaSolicitud.provincia = opcionSeleccionada;

				// Ocultamos el mensaje de error
				this.mostrarErrorProvincia = false;

				this.inicializarLocalidadesDeLaProvincia();

			} else if(!this.nuevaSolicitud.provincia.id) {
				// Si no selecciono ninguna provincia y no habia ninguna seleccionada de antes, mostramos el error
				this.mostrarErrorProvincia = true;
			}
		});

		// Mostramos el modal
		provinciaModal.present();
	}

	// Método que muestra un listado de localidades
	public abrirModalLocalidades() {

		if(!this.nuevaSolicitud.provincia || !this.nuevaSolicitud.provincia.id) {
			// Si no hay ninguna provincia seleccionada, mostramos un error
			let popupAdvertencia = this.alertCtrl.create({
				title: 'Error',
				message: 'Debe seleccionar una provincia antes de seleccionar una localidad.',
				buttons: [
				{
					text: 'Ok',
					handler: () => {

					}
				}]
			});

			// Mostramos el popup
			popupAdvertencia.present();
			return;
		}

		// Creamos el componente
		let localidadesModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Localidad', listaOpciones: this.listaLocalidades });

		localidadesModal.onDidDismiss(opcionSeleccionada => {
			if(opcionSeleccionada) {
				// Si el usuario selecciono alguna de las opciones
				this.nuevaSolicitud.localidad = opcionSeleccionada;

				// Ocultamos el mensaje de error
				this.mostrarErrorLocalidad = false;
			} else if(!this.nuevaSolicitud.localidad.id) {
				// Si no selecciono ninguna localidad y no habia ninguna seleccionada de antes, mostramos el error
				this.mostrarErrorLocalidad = true;
			}
		});

		// Mostramos el modal
		localidadesModal.present();
	}

	// Método muestra un mensaje de error al usuario
	private mostrarMensajeError(titulo: string, mensajeUsuario: string, callback?: () => void) {
		let popupError = this.alertCtrl.create({
			title: titulo,
			message: mensajeUsuario,
			buttons: [
			{
				text: 'Ok',
				handler: () => {
					if(callback) {
						callback();
					}
				}
			}]
		});

		popupError.present();
	}
}
