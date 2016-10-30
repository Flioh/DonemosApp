// Referencias de angular
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// Referencias de Ionic
import { Storage } from '@ionic/storage';

// Referencias de RxJS
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// Modelos a usar
import { SolicitudModel } from '../../components/solicitudes/solicitud.model';
import { FactorSanguineoEnum, GrupoSanguineoEnum, DonacionesService } from './donaciones.service';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';
import { CiudadModel } from '../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';

// Objeto de configuracion
import { AppConfig } from '../../shared/app-config';

@Injectable()
export class DatosService {

  // Listados
  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  // Preferencias del usuario
  private datosUsuarioObj: any;
  private datosUsuarioObserver: any;
  public preferenciasUsuario: Observable<any>;

  // URL de las APIs
  private apiEndPointProvincias : string;
  private apiEndPointLocalidades: string;
  private apiEndPointSolicitudes: string;

  constructor(public http: Http, 
              public donacionesService: DonacionesService,
              public storage: Storage,
              public config: AppConfig) {

    // Obtenemos las API desde el archivo de configuracion
    this.apiEndPointLocalidades = config.apiEndPointLocalidades;
    this.apiEndPointProvincias = config.apiEndPointProvincias;
    this.apiEndPointSolicitudes = config.apiEndPointSolicitudes;

    // Reseteamos los listados
    this.listaProvincias = [];    
    this.listaCiudades = [];

    // Inicializa los datos del usuario
    this.datosUsuarioObj = null;

    // Inicializamos el observable
    this.datosUsuarioObserver = null;
    this.preferenciasUsuario = Observable.create(observer => {
        this.datosUsuarioObserver = observer;
    });
  }

  // Método que obtiene los datos del usuario
	public getPreferenciasUsuario(): Promise<any> {
		return this.storage.get('datosUsuarioObj').then((preferenciasUsuario) => {
					if(!preferenciasUsuario) {
			          // No hay datos guardados, por lo que seteamos la variable en false
			          this.datosUsuarioObj = false;       
			      } else {
			          // Inicializamos los listados con la informacion del usuario
			          this.datosUsuarioObj = JSON.parse(preferenciasUsuario);	                 
			      }
            return this.datosUsuarioObj;
      });
	}

  // Guarda las preferencias del usuario
	public setPreferenciasUsuario(preferenciasUsuario: any): Promise<any> {
		return this.storage.set('datosUsuarioObj', JSON.stringify(preferenciasUsuario))
				.then(() => { 
					this.datosUsuarioObj = preferenciasUsuario;

          // Avisamos a los subscriptores que los datos fueron actualizados
					this.datosUsuarioObserver.next(preferenciasUsuario);
				});
	}

  // Obtiene el listado de factores sanguineos
  public getFactoresSanguineos(): Array<FactorSanguineoModel> {
    let listaFactoresSanguineos = [];

    listaFactoresSanguineos.push(new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, this.donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)));
    listaFactoresSanguineos.push(new FactorSanguineoModel(FactorSanguineoEnum.RhNegativo, this.donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhNegativo)));

    return listaFactoresSanguineos;
  }

  // Obtiene el listado de grupos sanguineos
  public getGruposSanguineos(): Array<GrupoSanguineoModel> {
    let listaGruposSanguineos = [];

    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.Cero, this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.Cero)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.A, this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.AB, this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.AB)));
    listaGruposSanguineos.push(new GrupoSanguineoModel(GrupoSanguineoEnum.B, this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.B)));

    return listaGruposSanguineos;
  }

  // Obtiene el listado de solicitudes
  public getSolicitudes(): Observable<Array<SolicitudModel>> {
    return this.http.get(this.apiEndPointSolicitudes)
      .delay(500) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json());
  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Observable<Array<ProvinciaModel>>{
    return this.http.get(this.apiEndPointProvincias)
      .delay(500) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json())
      .map(listadoProvincias => {
        this.listaProvincias = [];

        // Creamos el listado de provincias usando el modelo ProvinciaModel
        for(let i=0; i<listadoProvincias.length; i++) {
          this.listaProvincias.push(new ProvinciaModel(listadoProvincias[i].id, listadoProvincias[i].nombre));
        }

        return this.listaProvincias;
      });
  }

  // Obtiene el listado de ciudades de la provincia pasada como parametro
  public getListaCiudadesPorProvincia(provinciaID: number): Observable<Array<CiudadModel>>{

    this.listaCiudades = [];

    return this.http.get(this.apiEndPointLocalidades)
      .delay(1000) // Simulamos un retardo al buscar las solicitudes
      .map(res => res.json().filter(unaCiudad => unaCiudad.provincia == provinciaID))
      .map(listadoCiudades => {

        // Creamos el listado de ciudades usando el modelo CiudadModel
        for(let i=0; i<listadoCiudades.length; i++) {
          this.listaCiudades.push(new CiudadModel(listadoCiudades[i].id, listadoCiudades[i].nombre));
        }
        return this.listaCiudades;
      });
  }
}
