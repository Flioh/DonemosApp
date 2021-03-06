// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController, LoadingController, ModalController, AlertController } from 'ionic-angular';

// Modelos
import { ProvinciaModel } from '../../../shared/models/provincia.model';
import { BancoSangreModel } from '../banco-sangre.model';

// Servicios
import { LocalizacionService } from '../../../shared/services/localizacion.service'
import { DatosService } from '../../../shared/services/datos.service';

// Paginas y componente base
import { BasePage } from '../../../shared/components/base/base.component';
import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';
import { DetallesBancoSangrePage } from '../detalles-banco-sangre/detalles-banco-sangre.component';

@Component({
	selector:'lista-bancos-sangre-page',
	templateUrl: 'lista-bancos-sangre.component.html',
})
export class ListaBancosSangrePage extends BasePage {

	public listaBancosSangre: Array<BancoSangreModel>;
	public mapBancosSangre: Map<string, Array<BancoSangreModel>>;

	public listaProvincias: Array<ProvinciaModel>;
	public provinciaSeleccionada: ProvinciaModel;

	public distancia: number = 10;
	public seccion: string = 'busquedaUbicacion';

	public mostrarMensajeResultadosVaciosPorCercania: boolean;
	public mostrarMensajeResultadosVaciosPorProvincia: boolean;

	constructor(public navCtrl: NavController,
		private loadingCtrl: LoadingController,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		private localizacionService: LocalizacionService,
		private datosService: DatosService) {

		super();

		this.mapBancosSangre = new Map();
		this.provinciaSeleccionada = null;

		this.listaBancosSangre = [];

		// Evitamos mostrar el mensaje si el usuario no realizó ninguna busqueda
		this.mostrarMensajeResultadosVaciosPorCercania = false;
		this.mostrarMensajeResultadosVaciosPorProvincia = false;

		// Cargamos el listado de provincias
		this.cargarProvincias();
	}

	// Método que carga el listado de provincias
	private cargarProvincias() {

		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando listados'
		});

		loadingPopup.present();

		this.datosService.getListaProvincias().subscribe(
			(result) => {
				if(result && result.length) {
					this.listaProvincias = result;

					// Ocultamos el mensaje de espera
					loadingPopup.dismiss();
				} else {

					// Ocultamos el mensaje de espera
					loadingPopup.dismiss();

					this.procesarError(this.config.excepcionListaProvincias, 'cargarProvincias', 'ListaBancosSangrePage', 'error', 'Error al obtener el listado de provincias.', result);
					this.mostrarMensajeError('Error', this.config.errorProvincias);
				}
			}, (error) => {

				// Ocultamos el mensaje de espera
				loadingPopup.dismiss();

				this.procesarError(this.config.excepcionListaProvincias, 'cargarProvincias', 'ListaBancosSangrePage', 'error', 'Error al obtener el listado de provincias.', error);
				this.mostrarMensajeError('Error', this.config.errorProvincias);
			});
	}

	// Método que agrupa los bancos de sangre por la ciudad a la que pertenecen
	private agruparBancosPorCiudad(){
		this.listaBancosSangre.forEach((banco) => {
			const key = banco.nombreCiudad;
			
			if (!this.mapBancosSangre.has(key)) {
				this.mapBancosSangre.set(key, [banco]);
			} else {
				this.mapBancosSangre.get(key).push(banco);
			}
		});
	}

	// Método que muestra un listado de provincias
	public abrirModalProvincias() {
		// Creamos el componente
		let provinciaModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Provincia', listaOpciones: this.listaProvincias });

		provinciaModal.onDidDismiss(opcionSeleccionada => {

			if(opcionSeleccionada) {
				// Si el usuario selecciono alguna de las opciones
				this.provinciaSeleccionada = opcionSeleccionada;
				this.buscarBancosPorProvincia();
			} else {
				this.provinciaSeleccionada = null;
				this.listaBancosSangre = null;
				this.mapBancosSangre = new Map();
			}
		});

		// Mostramos el modal
		provinciaModal.present();
	}

	// Método que obtiene el listado de bancos de sangre en base a la provincia pasada como parametro
	private buscarBancosPorProvincia() {
		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando bancos de sangre'
		});

		// Muestra el mensaje de cargando bancos de sangre
		loadingPopup.present();

		this.listaBancosSangre = null;
		this.mapBancosSangre = new Map();

		this.datosService.getListaBancosSangrePorProvincia(this.provinciaSeleccionada.id).subscribe(
			(bancosSangre) => {
				this.listaBancosSangre = bancosSangre;

				if(this.listaBancosSangre.length) {
					this.mostrarMensajeResultadosVaciosPorProvincia = false;
					this.agruparBancosPorCiudad();
				} else {
					this.mostrarMensajeResultadosVaciosPorProvincia = true;
				}

				// Ocultamos el mensaje de espera
				loadingPopup.dismiss();

			}, (error) => {

				this.mostrarMensajeResultadosVaciosPorProvincia = false;

				// Oculta el mensaje de espera
          		loadingPopup.dismiss();

          		// Enviamos el error a Bugsnag
				this.procesarError(this.config.excepcionListaBancosSangre, 'buscarBancosPorProvincia', 'ListaBancosSangrePage', 'error', `Error al obtener el listado de bancos de sangre para la provincia ${this.provinciaSeleccionada.id}`, error);
				
				this.mostrarMensajeError('Error', this.config.errorBancosSangre);
			});
	}

	// Método que obtiene el listado de bancos de sangre en base a la ubicacion del usuario
	public buscarBancosCercanos() {
		let loadingPopup = this.loadingCtrl.create({
			content: 'Cargando bancos de sangre'
		});

		// Muestra el mensaje de cargando bancos de sangre
		loadingPopup.present();

		this.listaBancosSangre = null;

		this.localizacionService.habilitarGps().then(gpsActivado => {

			if(!gpsActivado) {
				// Oculta el mensaje de espera
				loadingPopup.dismiss();

				let mensajeError = this.alertCtrl.create({
					title: 'Error',
					message: `Ha ocurrido un error al intentar activar el servicio de ubicación. ¿Querés ir a la pantalla de Configuración para activarlo manualmente?`,
					buttons: [
					{
						text: 'Cancelar'
					},
					{
						text: 'Aceptar',
						handler: () => {
							this.localizacionService.mostrarPantallaOpcionesLocalizacion();
						}
					}
					]
				});

				mensajeError.present();

				// Enviamos el error a Bugsnag
				this.procesarError(this.config.excepcionListaBancosSangre, 'buscarBancosCercanos', 'ListaBancosSangrePage', 'warning', `Servicio de ubicación no disponible. Se muestra la pantalla de configuración.`, {});
				return;
			}

			// El GPS esta activado, procedemos a buscar la ubicacion del usuario
			this.localizacionService.obtenerCoordenadasCordovaGeolocationPlugin().then(posicion => {

				if(!posicion) {
					// No ha sido posible encontrar la ubicación actual del usuario				
					loadingPopup.dismiss();

					let mensajeError = this.alertCtrl.create({
						title: ':(',
						message: `No hemos podido obtener tu ubicación actual. No te preocupes, es algo común. Por favor volvé a intentarlo más tarde o buscá bancos de sangre por provincia.`,
						buttons: ['Aceptar']
					});

					mensajeError.present();

					// Enviamos el error a Bugsnag
					this.procesarError(this.config.excepcionListaBancosSangre, 'buscarBancosCercanos', 'ListaBancosSangrePage', 'warning', `Error al obtener la ubicación actual del usuario.`, {});
					return;
				}

				// Tenemos la ubicación del usuario, ahora buscamos los bancos cercanos
				let latitud = posicion.coords.latitude;
				let longitud = posicion.coords.longitude;

				this.datosService.getListaBancosSangrePorUbicacion(latitud, longitud, this.distancia * 1000).subscribe(
					(bancosSangre) => {

						this.listaBancosSangre = bancosSangre;

						this.mostrarMensajeResultadosVaciosPorCercania = this.listaBancosSangre.length === 0 ? true : false; 

						// Ocultamos el mensaje de espera
						loadingPopup.dismiss();

					}, (error) => {

						this.mostrarMensajeResultadosVaciosPorCercania = false;

						// Oculta el mensaje de espera
						loadingPopup.dismiss();

						this.procesarError(this.config.excepcionListaBancosSangre, 'buscarBancosCercanos', 'ListaBancosSangrePage', 'error', `Error al obtener el listado de bancos de sangre para las coordenadas ${latitud}, ${longitud}`, error);
						this.mostrarMensajeError('Error', this.config.errorBancosSangre);
					});
			});

		});
	}

	// Método que se ejecuta al cambiar la seccion seleccionada
	public resetearDatos() {
		// Limpiamos los resultados
		this.listaBancosSangre = null;
		this.mapBancosSangre = new Map();

		// Limpiamos los filtros de busqueda
		this.provinciaSeleccionada = null;
		this.distancia = 10;
	}

	// Método que muestra los detalles del banco de sangre seleccionado
	public abrirDetallesBancoSangre(bancoSangreSeleccionado: BancoSangreModel): void {
		this.navCtrl.push(DetallesBancoSangrePage, { bancoSangre: bancoSangreSeleccionado });
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

	// Método que muestra ayuda sobre las funciones de la página
    public mostrarAyuda() {
      let alert = this.alertCtrl.create({
        title: 'Bancos de Sangre',
        message: `No hay que esperar a la emergencia. Podés acercarte a cualquier banco de sangre a donar de forma voluntaria y altruista. Buscá los más cercanos en base a tu ubicación actual, o según tu provincia.`,
        buttons: ['Ok']
      });

      alert.present();
    }

    public ocultarMensajeResultadoVacioPorCercania(): void {
    	this.mostrarMensajeResultadosVaciosPorCercania = false;
    }
}





