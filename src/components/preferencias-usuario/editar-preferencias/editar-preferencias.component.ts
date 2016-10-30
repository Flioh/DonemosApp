// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { LoadingController, NavController, ToastController } from 'ionic-angular';

// Modelo principal
import { PreferenciasUsuarioModel } from '../preferencias-usuario.model';

// Modelos compartidos
import { CiudadModel } from '../../../shared/models/ciudad.model';
import { FactorSanguineoModel } from '../../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../../shared/models/grupo-sanguineo.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';

// Servicios
import { DatosService } from '../../../shared/services/datos.service';

@Component({
	selector:'editar-preferencias-page',
	templateUrl: 'editar-preferencias.component.html',
})
export class EditarPreferenciasPage {

	// Listados de la pagina
	public listaGruposSanguineos: Array<GrupoSanguineoModel>;
	public listaFactoresSanguineos: Array<FactorSanguineoModel>;
	public listaProvincias: Array<ProvinciaModel>;
	public listaCiudades: Array<CiudadModel>;

	// Preferencias del usuario
	public preferenciasUsuario: PreferenciasUsuarioModel;
	private datosPersonalesObj: any;

	constructor(private navCtrl: NavController,
				private loadingCtrl: LoadingController, 
				private datosService: DatosService,
				private toastCtrl: ToastController) {

		this.preferenciasUsuario = new PreferenciasUsuarioModel();
		
		this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => {
			if(!preferenciasUsuario) {
				// No hay datos guardados, por lo que inicializamos los listados sin setear ninguna opcion por defecto
				this.cargarListados(false);
			} else {
				// Inicializamos los listados con la informacion del usuario
				this.datosPersonalesObj = preferenciasUsuario;
				this.cargarListados(true);
			}
		});
	}

  	// Método que inicializa los listados de la pagina
  	public cargarListados(inicializarDatos: boolean) {

  		let mensajeEspera = inicializarDatos ? 'Cargando datos guardados' : 'Cargando listados';

  		let loadingPopup = this.loadingCtrl.create({
  			content: mensajeEspera
  		});

  		loadingPopup.present();

      	// Inicializamos todos los listados
      	this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();
      	this.listaGruposSanguineos = this.datosService.getGruposSanguineos();
      	this.datosService.getListaProvincias().subscribe(result => {

      		if(result && result.length) {
      			this.listaProvincias = result;

      			// Si hay datos guardados, los usamos para inicializar los listados
      			if(inicializarDatos) {
      				this.inicializarDatosUsuario()
      				.then((result) => {
      					loadingPopup.dismiss();
      				});
      			} else {
      				loadingPopup.dismiss();
      			}      		
      		}
      	});
    }

    // Método que inicializa el formulario con los datos del usuario
    public inicializarDatosUsuario(): Promise<boolean> {
    	return new Promise((resolve) => {
    		// Obtenemos el indice de la provincia del usuario y la seleccionamos
    		let indiceProvincia = this.getIndicePorID(this.listaProvincias, this.datosPersonalesObj.provinciaID);    		
 			  this.preferenciasUsuario.provincia = this.listaProvincias[indiceProvincia];

    		// Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
    		let indiceGrupoSanguineo = this.getIndicePorID(this.listaGruposSanguineos, this.datosPersonalesObj.grupoSanguineoID);
 			  this.preferenciasUsuario.grupoSanguineo = this.listaGruposSanguineos[indiceGrupoSanguineo];

    		// Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
    		let indiceFactorSanguineo = this.getIndicePorID(this.listaFactoresSanguineos, this.datosPersonalesObj.factorSanguineoID);
    		this.preferenciasUsuario.factorSanguineo = this.listaFactoresSanguineos[indiceFactorSanguineo];

    		this.datosService.getListaCiudadesPorProvincia(this.preferenciasUsuario.provincia.id)
	    		.subscribe(result => {
			    	if(result && result.length){

			    		// Obtenemos el listado de ciudades
			    		this.listaCiudades = result;

			    		// Seleccionamos la ciudad del usuario
			    		let indiceCiudad = this.getIndicePorID(this.listaCiudades, this.datosPersonalesObj.ciudadID);
			    		this.preferenciasUsuario.ciudad = this.listaCiudades[indiceCiudad];

			    		// Resolvemos la promesa
			    		resolve(true);
			      	}
		        	// TODO: manejar errores en las llamadas al servidor
		        	// -------------------------------------------------      
	    	});
    	});
    }

    // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
    public getIndicePorID(listado: Array<any>, id: number): number {
    	for(let i=0; i<listado.length; i++) {
    		if(id === listado[i].getId())
    			return i;
    	}
    	return -1;
    }

  	// Método que inicializa el listado de ciudades de una provincia
  	public inicializarCiudadesDeLaProvincia(): void {
  		let loadingPopup = this.loadingCtrl.create({
  			content: 'Cargando ciudades'
  		});

	    // Muestra el mensaje de cargando ciudades
	    loadingPopup.present();

	    this.datosService.getListaCiudadesPorProvincia(this.preferenciasUsuario.provincia.id)
	    .subscribe(result => {
	    	if(result && result.length){
	    		this.listaCiudades = result;

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
			provinciaID : this.preferenciasUsuario.provincia.id,
			ciudadID : this.preferenciasUsuario.ciudad.id,
			grupoSanguineoID : this.preferenciasUsuario.grupoSanguineo.id,
			factorSanguineoID : this.preferenciasUsuario.factorSanguineo.id,
		};

		this.datosService.setPreferenciasUsuario(nuevosDatosUsuarioObj)
    		.then(() => {
    			let toast = this.toastCtrl.create({
    		      message: 'Los datos se actualizaron correctamente.',
    		      position: 'bottom',
    		      duration: 3000
    		    });

    		    // Mostramos el mensaje al usuario
    		    toast.present();
    		});
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
		return JSON.stringify(this.preferenciasUsuario, null, 2);
	}

}
