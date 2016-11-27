	// Referencias de Angular
	import { Component } from '@angular/core';

	// Referencias de Ionic
	import { LoadingController, NavController, ToastController, NavParams, ModalController, AlertController } from 'ionic-angular';

	// Modelo principal
	import { PreferenciasUsuarioModel } from '../preferencias-usuario.model';

	// Modelos compartidos
	import { LocalidadModel } from '../../../shared/models/localidad.model';
	import { ProvinciaModel } from '../../../shared/models/provincia.model';

	// Servicios
	import { DatosService } from '../../../shared/services/datos.service';

	// Paginas y componentes
	import { BasePage } from '../../../shared/components/base/base.component';
	import { ListaSolicitudesPage } from '../../solicitudes/lista-solicitudes/lista-solicitudes.component';
	import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';

	@Component({
		selector:'editar-preferencias-page',
		templateUrl: 'editar-preferencias.component.html',
	})
	export class EditarPreferenciasPage extends BasePage{

		// Listados de la pagina
		public listaGruposSanguineos: Array<{ id: number, nombre: string }>;
		public listaFactoresSanguineos: Array<{ id: number, nombre: string }>;
		public listaProvincias: Array<ProvinciaModel>;
		public listaLocalidades: Array<LocalidadModel>;

		// Preferencias del usuario
		public preferenciasUsuario: PreferenciasUsuarioModel;
		private datosUsuarioObj: any;

		public esRoot: boolean;

		constructor(private navCtrl: NavController,
			private loadingCtrl: LoadingController,
			private modalCtrl: ModalController,
			private alertCtrl: AlertController,
			private datosService: DatosService,
			private paramsCtrl: NavParams,
			private toastCtrl: ToastController) {

			super();

			// Identificamos si la pagina se abrio como root o mediante un push
			this.esRoot = this.paramsCtrl.get('esRoot') || false;

			// Iniciaizamos el modelo que contiene los datos del formulario
			this.preferenciasUsuario = new PreferenciasUsuarioModel();
			
			// Inicializamos los listados
			this.cargarListados();
		}

		// Método que inicializa los listados de la pagina
		public cargarListados() {

			let loadingPopup = this.loadingCtrl.create({
				content: 'Inicializando datos'
			});

			loadingPopup.present();

			// Inicializamos todos los listados
			this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();
			this.listaGruposSanguineos = this.datosService.getGruposSanguineos();
			this.datosService.getListaProvincias().toPromise().then(
				(result) => {

					if(result && result.length) {
						this.listaProvincias = result;

						// Si hay datos guardados, los usamos para inicializar los listados
						this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => { 
							// Guardamos los datos del usuario
							this.datosUsuarioObj = preferenciasUsuario;
						}).then(() => {
							this.inicializarDatosUsuario().then((result) => {
								loadingPopup.dismiss();
							});
						});    		
					} else {

						// Oculta el mensaje de espera
          				loadingPopup.dismiss();

						this.procesarError(this.config.excepcionListaProvincias, 'cargarListados', 'EditarPreferenciasPage', 'error', 'Error al obtener el listado de provincias.', result);
						this.mostrarMensajeError('Error', this.config.errorProvincias);
					}
				}, 
				(error) => {

					// Oculta el mensaje de espera
					loadingPopup.dismiss();

					this.procesarError(this.config.excepcionListaProvincias, 'cargarListados', 'EditarPreferenciasPage', 'error', 'Error al obtener el listado de provincias.', error);
					this.mostrarMensajeError('Error', this.config.errorProvincias);
				});
		}

		// Método que inicializa el formulario con los datos del usuario
		public inicializarDatosUsuario(): Promise<boolean> {
			return new Promise((resolve) => {

				// Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
				this.preferenciasUsuario.grupoSanguineo = this.datosUsuarioObj.grupoSanguineoID;

				// Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
				this.preferenciasUsuario.factorSanguineo = this.datosUsuarioObj.factorSanguineoID 

				if(this.datosUsuarioObj.provinciaID) {

					// Obtenemos el indice de la provincia del usuario y la seleccionamos
					let indiceProvincia = this.getIndicePorID(this.listaProvincias, this.datosUsuarioObj.provinciaID);    		
					this.preferenciasUsuario.provincia = this.listaProvincias[indiceProvincia];

					// Obtenemos el listado de localidades en base a la provincia seleccionada
					this.datosService.getListaLocalidadesPorProvincia(this.preferenciasUsuario.provincia.id).subscribe(
						(result) => {
							if(result && result.length){
								this.listaLocalidades = result;

								if(this.datosUsuarioObj.localidadID) {
									// Si el usuario guardo la localidad, la seleccionamos
									let indiceLocalidad = this.getIndicePorID(this.listaLocalidades, this.datosUsuarioObj.localidadID);
									this.preferenciasUsuario.localidad = this.listaLocalidades[indiceLocalidad];
								}

								// Resolvemos la promesa
								resolve(true);
							} else {
								this.procesarError(this.config.excepcionListaLocalidades, 'inicializarDatosUsuario', 'EditarPreferenciasPage', 'error', `Error al obtener el listado de localidades de la provincia ${this.preferenciasUsuario.provincia.id}.`, result);
								this.mostrarMensajeError('Error', this.config.errorLocalidades);
							}

						}, (error) => {
							this.procesarError(this.config.excepcionListaLocalidades, 'inicializarDatosUsuario', 'EditarPreferenciasPage', 'error', `Error al obtener el listado de localidades de la provincia ${this.preferenciasUsuario.provincia.id}.`, error);
							this.mostrarMensajeError('Error', this.config.errorLocalidades);
						});
				} else {
					// No hay datos de la provincia guardados, por lo que resolvemos la promesa
					resolve(true);
				}
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

		// Método que inicializa el listado de localidades de una provincia
		public inicializarLocalidadesDeLaProvincia(): void {
			let loadingPopup = this.loadingCtrl.create({
				content: 'Cargando localidades'
			});

			// Muestra el mensaje de cargando localidades
			loadingPopup.present();

			this.datosService.getListaLocalidadesPorProvincia(this.preferenciasUsuario.provincia.id).subscribe(
				(result) => {
					if(result && result.length){
						this.listaLocalidades = result;

						// Oculta el mensaje de espera
						loadingPopup.dismiss();
					} else {

						// Oculta el mensaje de espera
						loadingPopup.dismiss();

						this.procesarError(this.config.excepcionListaLocalidades, 'inicializarLocalidadesDeLaProvincia', 'EditarPreferenciasPage', 'error', `Error al obtener el listado de localidades de la provincia ${this.preferenciasUsuario.provincia.id}.`, result);
						this.mostrarMensajeError('Error', this.config.errorLocalidades);
					}
				}, 
				(error) => {

					// Oculta el mensaje de espera
					loadingPopup.dismiss();

					this.procesarError(this.config.excepcionListaLocalidades, 'inicializarLocalidadesDeLaProvincia', 'EditarPreferenciasPage', 'error', `Error al obtener el listado de localidades de la provincia ${this.preferenciasUsuario.provincia.id}.`, error);
					this.mostrarMensajeError('Error', this.config.errorLocalidades);
				});
		}

		// Método que guarda los cambios en la base de datos local
		public guardarCambios(): void {
			let nuevosDatosUsuarioObj = {
				provinciaID : this.preferenciasUsuario.provincia ? this.preferenciasUsuario.provincia.id : null,
				localidadID : this.preferenciasUsuario.localidad ? this.preferenciasUsuario.localidad.id : null,
				grupoSanguineoID : this.preferenciasUsuario.grupoSanguineo,
				factorSanguineoID : this.preferenciasUsuario.factorSanguineo,
			};

			// Guardamos los datos
			this.datosService.setPreferenciasUsuario(nuevosDatosUsuarioObj)
			.then(() => {
				if(this.esRoot) {
					this.mostrarListado();
				} else {
					let toast = this.toastCtrl.create({
						message: 'Los datos se actualizaron correctamente.',
						position: 'bottom',
						duration: 3000
					});

					// Mostramos el mensaje al usuario
					toast.present();
				}
			}, (error) => {
				this.procesarError(this.config.excepcionGuardarPreferenciasUsuario, 'guardarCambios', 'EditarPreferenciasPage', 'error', `Error al guardar las preferencias ${JSON.stringify(nuevosDatosUsuarioObj)}`, error);
				this.mostrarMensajeError('Error', this.config.errorGuardarPreferenciasUsuario);
			});
		}

		// Método que lleva al usuario al menu principal
		public mostrarListado(): void {
			this.navCtrl.setRoot(ListaSolicitudesPage);
		}

		// Método usado para debug, muestra el contenido del form en tiempo real
		get contenidoDelFormulario(): string {
			return JSON.stringify(this.preferenciasUsuario, null, 2);
		}

		// Método que muestra un listado de provincias
		public abrirModalProvincias() {
			// Creamos el componente
			let provinciaModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Provincia', listaOpciones: this.listaProvincias });

			provinciaModal.onDidDismiss(opcionSeleccionada => {

				if(opcionSeleccionada) {
					// Si el usuario selecciono alguna de las opciones
					this.preferenciasUsuario.provincia = opcionSeleccionada;
					this.inicializarLocalidadesDeLaProvincia();
				}
			});

			// Mostramos el modal
			provinciaModal.present();
		}

		// Método que muestra un listado de localidades
		public abrirModalLocalidades() {

			if(!this.preferenciasUsuario.provincia) {
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
			let ciudadesModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Localidad', listaOpciones: this.listaLocalidades });

			ciudadesModal.onDidDismiss(opcionSeleccionada => {
				if(opcionSeleccionada) {
					// Si el usuario selecciono alguna de las opciones
					this.preferenciasUsuario.localidad = opcionSeleccionada;
				}
			});

			// Mostramos el modal
			ciudadesModal.present();
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
