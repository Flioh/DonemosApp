// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { LoadingController, NavController, ToastController, NavParams, ModalController, AlertController } from 'ionic-angular';

// Modelo principal
import { PreferenciasUsuarioModel } from '../preferencias-usuario.model';

// Modelos compartidos
import { LocalidadModel } from '../../../shared/models/localidad.model';
import { FactorSanguineoModel } from '../../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../../shared/models/grupo-sanguineo.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';

// Servicios
import { DatosService } from '../../../shared/services/datos.service';

// Paginas y componentes
import { ListaSolicitudesPage } from '../../solicitudes/lista-solicitudes/lista-solicitudes.component';
import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';

@Component({
	selector:'editar-preferencias-page',
	templateUrl: 'editar-preferencias.component.html',
})
export class EditarPreferenciasPage {

	// Listados de la pagina
	public listaGruposSanguineos: Array<GrupoSanguineoModel>;
	public listaFactoresSanguineos: Array<FactorSanguineoModel>;
	public listaProvincias: Array<ProvinciaModel>;
	public listaLocalidades: Array<LocalidadModel>;

	// Preferencias del usuario
	public preferenciasUsuario: PreferenciasUsuarioModel;
	private datosPersonalesObj: any;

	public esRoot: boolean;

	constructor(private navCtrl: NavController,
				private loadingCtrl: LoadingController,
				private modalCtrl: ModalController,
				private alertCtrl: AlertController,
				private datosService: DatosService,
				private paramsCtrl: NavParams,
				private toastCtrl: ToastController) {

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
      	this.datosService.getListaProvincias().toPromise().then(result => {

      		if(result && result.length) {
      			this.listaProvincias = result;

      			// Si hay datos guardados, los usamos para inicializar los listados
      			this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => { 
      				// Guardamos los datos del usuario
      				this.datosPersonalesObj = preferenciasUsuario;
      			}).then(() => {
      				this.inicializarDatosUsuario().then((result) => {
      					loadingPopup.dismiss();
      				});
      			});    		
      		}
      	});
    }

    // Método que inicializa el formulario con los datos del usuario
    public inicializarDatosUsuario(): Promise<boolean> {
    	return new Promise((resolve) => {
    		
    		if(this.datosPersonalesObj.grupoSanguineoID) {
    			// Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
    			let indiceGrupoSanguineo = this.getIndicePorID(this.listaGruposSanguineos, this.datosPersonalesObj.grupoSanguineoID);
    			this.preferenciasUsuario.grupoSanguineo = this.listaGruposSanguineos[indiceGrupoSanguineo];
    		}
    		
    		if(this.datosPersonalesObj.factorSanguineoID){
    			// Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
    			let indiceFactorSanguineo = this.getIndicePorID(this.listaFactoresSanguineos, this.datosPersonalesObj.factorSanguineoID);
    			this.preferenciasUsuario.factorSanguineo = this.listaFactoresSanguineos[indiceFactorSanguineo];
    		}

    		if(this.datosPersonalesObj.provinciaID) {

    			// Obtenemos el indice de la provincia del usuario y la seleccionamos
    			let indiceProvincia = this.getIndiceProvinciaPorID(this.listaProvincias, this.datosPersonalesObj.provinciaID);    		
    			this.preferenciasUsuario.provincia = this.listaProvincias[indiceProvincia];

    			// Obtenemos el listado de localidades en base a la provincia seleccionada
    			this.datosService.getListaLocalidadesPorProvincia(this.preferenciasUsuario.provincia.id).subscribe(result => {
			    	if(result && result.length){
			    		this.listaLocalidades = result;

			    		if(this.datosPersonalesObj.ciudadID) {
			    			// Si el usuario guardo la localidad, la seleccionamos
			    			let indiceLocalidad = this.getIndicePorID(this.listaLocalidades, this.datosPersonalesObj.ciudadID);
			    			this.preferenciasUsuario.localidad = this.listaLocalidades[indiceLocalidad];
			    		}
			    		
			    		// Resolvemos la promesa
			    		resolve(true);
			      	}
		        	// TODO: manejar errores en las llamadas al servidor
		        	// -------------------------------------------------      
	    		});
    		} else {
    			// No hay datos de la provincia guardados, por lo que resolvemos la promesa
    			resolve(true);
    		}
    	});
    }

    // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
    public getIndicePorID(listado: Array<any>, id: number): number {
    	for(let i=0; i<listado.length; i++) {
    		if(id === listado[i].id)
    			return i;
    	}
    	return -1;
    }

    // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
    public getIndiceProvinciaPorID(listado: Array<any>, id: string): number {
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

	    this.datosService.getListaLocalidadesPorProvincia(this.preferenciasUsuario.provincia.id).subscribe(result => {
	    	if(result && result.length){
	    		this.listaLocalidades = result;

	          // Oculta el mensaje de espera
	          loadingPopup.dismiss();
	      }
	        // TODO: manejar errores en las llamadas al servidor
	        // -------------------------------------------------      
	    });
	}

	// Método que guarda los cambios en la base de datos local
	public guardarCambios(): void {
		let nuevosDatosUsuarioObj = {
			provinciaID : this.preferenciasUsuario.provincia ? this.preferenciasUsuario.provincia.id : null,
			ciudadID : this.preferenciasUsuario.localidad ? this.preferenciasUsuario.localidad.id : null,
			grupoSanguineoID : this.preferenciasUsuario.grupoSanguineo ? this.preferenciasUsuario.grupoSanguineo.id : null,
			factorSanguineoID : this.preferenciasUsuario.factorSanguineo ? this.preferenciasUsuario.factorSanguineo.id : null,
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

}
