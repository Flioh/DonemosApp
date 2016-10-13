// Referencias de angular
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

// Referencias de Ionic
import { SqlStorage, Storage } from 'ionic-angular';

// Referencias de RxJS
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// Modelos a usar
import { SolicitudModel } from '../../solicitudes/solicitud.model';
import { FactorSanguineoHelper, GrupoSanguineoHelper, FactorSanguineoEnum, GrupoSanguineoEnum  } from './donaciones.service';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';
import { CiudadModel } from '../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

@Injectable()
export class DatosService {

  // Listados
  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  private provinciaSeleccionadaID: number;

  // Preferencias del usuario
  private storage: Storage;
  private datosUsuarioObj: any;
  private datosUsuarioObserver: any;
  public preferenciasUsuario: Observable<any>;

  // URL de las APIs
  private apiEndPointProvincias : string;
  private apiEndPointLocalidades: string;
  private apiEndPointSolicitudes: string;

  constructor(public http: Http, public config: AppConfig) {

    // Obtenemos las API desde el archivo de configuracion
    this.apiEndPointLocalidades = config.apiEndPointLocalidades;
    this.apiEndPointProvincias = config.apiEndPointProvincias;
    this.apiEndPointSolicitudes = config.apiEndPointSolicitudes;

    // Reseteamos los listados
    this.listaProvincias = [];    
    this.listaCiudades = [];

    this.provinciaSeleccionadaID = null;

    // Inicializa los datos del usuario
    this.datosUsuarioObj = null;

    // Inicializamos el observable
    this.datosUsuarioObserver = null;
    this.preferenciasUsuario = Observable.create(observer => {
        this.datosUsuarioObserver = observer;
    });

    // Inicializa el objeto storage
    if(!this.storage) {
      this.storage = new Storage(SqlStorage);  
    }
  }

  // Método que obtiene los datos del usuario
	public getPreferenciasUsuario(): Promise<any> {
		return new Promise((resolve)=> {

			if(this.datosUsuarioObj === null) {
				// Aún no se consulto si habia o no datos, por lo que hacemos la consulta
				this.storage.get('datosUsuarioObj').then((preferenciasUsuario) => {
					if(!preferenciasUsuario) {
			          // No hay datos guardados, por lo que seteamos la variable en false
			          this.datosUsuarioObj = false;			         
			          resolve(this.datosUsuarioObj);
			      } else {
			          // Inicializamos los listados con la informacion del usuario
			          this.datosUsuarioObj = JSON.parse(preferenciasUsuario);	          
			          resolve(this.datosUsuarioObj);          
			      }
	  			});

			} else {
				// Devolver los datos guardados ya sea false o el objeto con la informacion
				resolve(this.datosUsuarioObj);
			}			
		});
	}

  // Guarda las preferencias del usuario
	public setPreferenciasUsuario(preferenciasUsuario: any): Promise<any> {
		return this.storage.set('datosUsuarioObj', JSON.stringify(preferenciasUsuario))
				.then(() => { 
					this.datosUsuarioObj = preferenciasUsuario;
					this.datosUsuarioObserver.next(preferenciasUsuario);
				});
	}

  // Obtiene el listado de factores sanguineos
  public getFactoresSanguineos(): Array<FactorSanguineoModel> {
    let listaFactoresSanguineos = [];

    listaFactoresSanguineos.push(new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhPositivo)));
    listaFactoresSanguineos.push(new FactorSanguineoModel(FactorSanguineoEnum.RhNegativo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhNegativo)));

    return listaFactoresSanguineos;
  }

  // Obtiene el listado de grupos sanguineos
  public getGruposSanguineos(): Array<GrupoSanguineoModel> {
    let listaGruposSanguineos = [];

    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.Cero, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.Cero)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.A, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.A)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.AB, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.AB)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.B, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.B)));

    return listaGruposSanguineos;
  }

  // Obtiene el listado de solicitudes
  public getSolicitudes(): Observable<Array<SolicitudModel>> {

    return this.http.get(this.apiEndPointSolicitudes)
      .delay(1000) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json());
  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Observable<Array<ProvinciaModel>>{
    return this.http.get(this.apiEndPointProvincias)
      .delay(1000) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json())
      .map(listadoProvincias => {
        this.listaProvincias = [];

        for(let i=0; i<listadoProvincias.length; i++) {
          this.listaProvincias.push(new ProvinciaModel(listadoProvincias[i].id, listadoProvincias[i].nombre));
        }

        return this.listaProvincias;
      });
  }

  // Obtiene el listado de ciudades de la provincia pasada como parametro
  public getListaCiudadesPorProvincia(provinciaID: number): Observable<Array<CiudadModel>>{

    if(this.provinciaSeleccionadaID == provinciaID) {
      // Ya tenemos cargadas las ciudades de esa provincia, por lo que no hacemos la llamada http al servidor
      return Observable.from([this.listaCiudades]);
    }

    this.listaCiudades = [];

    // Guardamos el ID de la provincia para evitar volver a pedir las ciudades si ya tenemos ese listado cargado
    this.provinciaSeleccionadaID = provinciaID;

    return this.http.get(this.apiEndPointLocalidades)
      .delay(1000) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json().filter(unaCiudad => unaCiudad.provincia == provinciaID))
      .map(listadoCiudades => {
        for(let i=0; i<listadoCiudades.length; i++) {
          this.listaCiudades.push(new CiudadModel(listadoCiudades[i].id, listadoCiudades[i].nombre));
        }
        return this.listaCiudades;
      });
  }
}
