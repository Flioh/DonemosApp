import { CiudadModel } from '../../models/ciudad-model/ciudad-model';
import { DatosPersonalesModel } from '../../models/datos-personales-model/datos-personales-model';
import { FactorSanguineoModel } from '../../models/factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../../models/grupo-sanguineo-model/grupo-sanguineo-model';
import { ProvinciaModel } from '../../models/provincia-model/provincia-model';
import { DatosRemotosService } from '../../providers/datos-remotos-service/datos-remotos-service';
import { DatosPersonalesService } from '../../providers/datos-personales-service/datos-personales-service';
import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/datos-personales/datos-personales.html',
})
export class DatosPersonalesPage {

	private listaGruposSanguineos: Array<GrupoSanguineoModel>;
	private listaFactoresSanguineos: Array<FactorSanguineoModel>;
	private listaProvincias: Array<ProvinciaModel>;
	private listaCiudades: Array<CiudadModel>;

	private datosPersonales: DatosPersonalesModel;
	private datosPersonalesObj: any;

	private storage: Storage;

	constructor(private navCtrl: NavController,
		private loadingCtrl: LoadingController, 
		private datosRemotosService: DatosRemotosService,
    	private datosPersonalesService: DatosPersonalesService,
		private toastCtrl: ToastController) {

		if(this.datosRemotosService.modoDebugActivado()) {
        	console.time('DatosPersonalesPage / constructor');
      	}

		this.datosPersonales = new DatosPersonalesModel();
		
		this.datosPersonalesService.getDatosUsuario().then((datosPersonales) => {
			
			if(!datosPersonales) {
				// No hay datos guardados, por lo que inicializamos los listados sin setear ninguna opcion por defecto
				this.cargarListados(false);

				if(this.datosRemotosService.modoDebugActivado()) {
          			console.timeEnd('DatosPersonalesPage / constructor');
        		}
			} else {
				// Inicializamos los listados con la informacion del usuario
				this.datosPersonalesObj = datosPersonales;
				this.cargarListados(true);

				if(this.datosRemotosService.modoDebugActivado()) {
          			console.timeEnd('DatosPersonalesPage / constructor');
       	 		}
			}
		});
	}

  	// Método que inicializa los listados de la pagina
  	public cargarListados(inicializarDatos: boolean) {

  		if(this.datosRemotosService.modoDebugActivado()) {
        	console.time('DatosPersonalesPage / cargarListados');
        }

  		let mensajeEspera = inicializarDatos ? 'Cargando datos guardados' : 'Cargando listados';

  		let loadingPopup = this.loadingCtrl.create({
  			content: mensajeEspera
  		});

  		loadingPopup.present();

      	// Inicializamos todos los listados
      	this.listaFactoresSanguineos = this.datosRemotosService.getFactoresSanguineos();
      	this.listaGruposSanguineos = this.datosRemotosService.getGruposSanguineos();
      	this.datosRemotosService.getListaProvincias().subscribe(result => {

      		if(result && result.length) {
      			this.listaProvincias = result;

      			// Si hay datos guardados, los usamos para inicializar los listados
      			if(inicializarDatos) {
      				this.inicializarDatosUsuario()
      				.then((result) => {
      					loadingPopup.dismiss();

      					if(this.datosRemotosService.modoDebugActivado()) {
        					console.timeEnd('DatosPersonalesPage / cargarListados');
        				}
      				});
      			} else {
      				loadingPopup.dismiss();

      				if(this.datosRemotosService.modoDebugActivado()) {
        				console.timeEnd('DatosPersonalesPage / cargarListados');
        			}	
      			}      		
      		}
      	});
    }

    // Método que inicializa el formulario con los datos del usuario
    public inicializarDatosUsuario(): Promise<boolean> {
    	return new Promise((resolve) => {
    		
    		if(this.datosRemotosService.modoDebugActivado()) {
        		console.time('DatosPersonalesPage / inicializarDatosUsuario');
        	}

    		// Obtenemos el indice de la provincia del usuario y la seleccionamos
    		let indiceProvincia = this.getIndicePorID(this.listaProvincias, this.datosPersonalesObj.provinciaID);    		
 			  this.datosPersonales.setProvincia(this.listaProvincias[indiceProvincia]);

    		// Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
    		let indiceGrupoSanguineo = this.getIndicePorID(this.listaGruposSanguineos, this.datosPersonalesObj.grupoSanguineoID);
 			  this.datosPersonales.setGrupoSanguineo(this.listaGruposSanguineos[indiceGrupoSanguineo]);

    		// Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
    		let indiceFactorSanguineo = this.getIndicePorID(this.listaFactoresSanguineos, this.datosPersonalesObj.factorSanguineoID);
    		this.datosPersonales.setFactorSanguineo(this.listaFactoresSanguineos[indiceFactorSanguineo]);

    		this.datosRemotosService.getListaCiudadesPorProvincia(this.datosPersonales.getProvincia().getId())
	    		.subscribe(result => {
			    	if(result && result.length){

			    		// Obtenemos el listado de ciudades
			    		this.listaCiudades = result;

			    		// Seleccionamos la ciudad del usuario
			    		let indiceCiudad = this.getIndicePorID(this.listaCiudades, this.datosPersonalesObj.ciudadID);
			    		this.datosPersonales.setCiudad(this.listaCiudades[indiceCiudad]);

			    		// Resolvemos la promesa
			    		resolve(true);

			    		if(this.datosRemotosService.modoDebugActivado()) {
        					console.timeEnd('DatosPersonalesPage / inicializarDatosUsuario');
        				}
			      	}
		        	// TODO: manejar errores en las llamadas al servidor
		        	// -------------------------------------------------      
	    	});
    	});
    }

    // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
    public getIndicePorID(listado: Array<any>, id: number): number {
    	
    	if(this.datosRemotosService.modoDebugActivado()) {
    		console.time('DatosPersonalesPage / getIndicePorID');
    	}

    	for(let i=0; i<listado.length; i++) {
    		if(id === listado[i].getId())
    			return i;
    	}

    	if(this.datosRemotosService.modoDebugActivado()) {
    		console.timeEnd('DatosPersonalesPage / getIndicePorID');
    	}

    	return -1;
    }

  	// Método que inicializa el listado de ciudades de una provincia
  	public inicializarCiudadesDeLaProvincia(): void {

  		if(this.datosRemotosService.modoDebugActivado()) {
    		console.time('DatosPersonalesPage / inicializarCiudadesDeLaProvincia');
    	}

  		let loadingPopup = this.loadingCtrl.create({
  			content: 'Cargando ciudades'
  		});

	    // Muestra el mensaje de cargando ciudades
	    loadingPopup.present();

	    this.datosRemotosService.getListaCiudadesPorProvincia(this.datosPersonales.getProvincia().getId())
	    .subscribe(result => {
	    	if(result && result.length){
	    		this.listaCiudades = result;

	          // Oculta el mensaje de espera
	          loadingPopup.dismiss();

	          if(this.datosRemotosService.modoDebugActivado()) {
    			console.timeEnd('DatosPersonalesPage / inicializarCiudadesDeLaProvincia');
    		  }
	      }
	        // TODO: manejar errores en las llamadas al servidor
	        // -------------------------------------------------      
	    });
	}

	// Método que guarda los cambios en la base de datos local
	public guardarCambios(): void {

		if(this.datosRemotosService.modoDebugActivado()) {
    		console.time('DatosPersonalesPage / guardarCambios');
    	}

		let nuevosDatosUsuarioObj = {
			provinciaID : this.datosPersonales.getProvincia().getId(),
			ciudadID : this.datosPersonales.getCiudad().getId(),
			grupoSanguineoID : this.datosPersonales.getGrupoSanguineo().getId(),
			factorSanguineoID : this.datosPersonales.getFactorSanguineo().getId(),
		};

		this.datosPersonalesService.setDatosUsuario(nuevosDatosUsuarioObj)
    		.then(() => {
    			let toast = this.toastCtrl.create({
    		      message: 'Los datos se actualizaron correctamente.',
    		      position: 'bottom',
    		      duration: 3000
    		    });

    		    // Mostramos el mensaje al usuario
    		    toast.present();

    		    if(this.datosRemotosService.modoDebugActivado()) {
        			console.timeEnd('DatosPersonalesPage / guardarCambios');
        		}
    		});
	}

	// Método usado para debug, muestra el contenido del form en tiempo real
	get contenidoDelFormulario(): string {
		return JSON.stringify(this.datosPersonales, null, 2);
	}

}
