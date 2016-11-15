// Referencias de Angular
import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Platform, MenuController, NavParams, ModalController } from 'ionic-angular';

// Servicios
import { DatosService } from '../../../shared/services/datos.service';
import { DonacionesService } from '../../../shared/services/donaciones.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { LocalidadModel } from '../../../shared/models/localidad.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';

// Paginas y comonentes
import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';

@Component({
	selector: 'nueva-solicitud-page',
	templateUrl: 'nueva-solicitud.component.html'
})
export class NuevaSolicitudPage {

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

	private submitted: boolean = false;

	// Propiedad que permite determinar si estamos creando una nueva solicitud
	// o modificando una ya existente
	public modoEdicion: boolean;

	constructor(private datosService: DatosService,
		private donacionesService: DonacionesService,
		private platform: Platform,
		private menuCtrl: MenuController,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private formBuilder : FormBuilder, 
		private ngZone : NgZone,
		private loadingCtrl : LoadingController,
		private alertCtrl : AlertController,
		private paramsCtrl: NavParams) {

		let solicitudRecibida = this.paramsCtrl.get('unaSolicitud');

		// Establecemos el modo de la pantalla
		this.modoEdicion = solicitudRecibida ? true : false;

		// Obtenemos la solicitud existente pasada como parametro o creamos una nueva insatancia
		this.nuevaSolicitud = solicitudRecibida || new SolicitudModel();
		
		this.mostrarErrorLocalidad = false;
		this.mostrarErrorProvincia = false;

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
				message: '¿Está seguro que desea salir? Los cambios que haya hecho se perderán.',
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
		this.datosService.getListaProvincias().subscribe(result => {
			if(result && result.length) {
				
				// Inicializamos el listado de provincias
				this.listaProvincias = result;

				// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
				// ---------------------------------------------------------------------------				
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
					// TODO: manejar errores en las llamadas al servidor
					// -------------------------------------------------
				}
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
		this.datosService.getListaLocalidadesPorProvincia(provinciaId).subscribe(result => {
			if(result && result.length){
				this.listaLocalidades = result;
					if(nombreLocalidad) {
						// Si recibimos el nombre de la localidad (autocomplete), seleccionamos esa localidad
						this.actualizarLocalidad(nombreLocalidad);
					} else {
						// TODO: usar geolocalizacion para cargar por defecto la provincia del usuario
						// ---------------------------------------------------------------------------

						// Setea la localidad en base a su ID
						//this.nuevaSolicitud.localidad = this.listaLocalidades[0];	
					}

					// Oculta el mensaje de espera
					loadingPopup.dismiss();
				}
				// TODO: manejar errores en las llamadas al servidor
				// -------------------------------------------------			
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
		this.submitted = true;

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
          		data => { console.log('saved'); },
          		err => { debugger; });
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
}
