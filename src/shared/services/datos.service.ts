// Referencias de angular
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

// Referencias de Ionic
import { Storage } from '@ionic/storage';

// Referencias de RxJS
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

// Modelos a usar
import { SolicitudModel } from '../../components/solicitudes/solicitud.model';
import { FactorSanguineoEnum, GrupoSanguineoEnum, DonacionesService } from './donaciones.service';
import { LocalidadModel } from '../../shared/models/localidad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';

// Objeto de configuracion
import { AppConfig } from '../../shared/app-config';

@Injectable()
export class DatosService {

  // Listados
  private listaProvincias: Array<ProvinciaModel>;
  private listaLocalidades: Array<LocalidadModel>;

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
              public authHttp: AuthHttp,
              public config: AppConfig) {

    // Obtenemos las API desde el archivo de configuracion
    this.apiEndPointLocalidades = config.apiEndPointLocalidades;
    this.apiEndPointProvincias = config.apiEndPointProvincias;
    this.apiEndPointSolicitudes = config.apiEndPointSolicitudes;

    // Reseteamos los listados
    this.listaProvincias = [];    
    this.listaLocalidades = [];

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
					if(this.datosUsuarioObserver)
            this.datosUsuarioObserver.next(preferenciasUsuario);
				});
	}

  // Método que devuelve true si el usuario vio la introduccion
  public getMostrarIntro() {
    return this.storage.get('mostrarIntro').then(mostrarIntro => {
      return mostrarIntro === null || mostrarIntro === true ? true : false;
    })
  }

  // Método que setea si la introduccion se debe mostrar o no
  public setMostrarIntro(mostrarIntro: boolean) {
    return this.storage.set('mostrarIntro', mostrarIntro);
  }

  // Obtiene el listado de factores sanguineos
  public getFactoresSanguineos(): Array<{ id: number, nombre: string }> {
    let listaFactoresSanguineos = [];

    listaFactoresSanguineos.push({ 
        id: FactorSanguineoEnum.RhPositivo, 
        nombre : this.donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo) 
    });

    listaFactoresSanguineos.push({
      id : FactorSanguineoEnum.RhNegativo, 
      nombre: this.donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhNegativo)
    });

    return listaFactoresSanguineos;
  }

  // Obtiene el listado de grupos sanguineos
  public getGruposSanguineos(): Array<{ id: number, nombre: string }> {
    let listaGruposSanguineos = [];

    listaGruposSanguineos.push({ 
      id: GrupoSanguineoEnum.O, 
      nombre: this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.O) 
    });
    listaGruposSanguineos.push({ 
      id: GrupoSanguineoEnum.A, 
      nombre: this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A) 
    });
    listaGruposSanguineos.push({ 
      id: GrupoSanguineoEnum.AB,
      nombre: this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.AB) 
     });
    listaGruposSanguineos.push({ 
      id: GrupoSanguineoEnum.B, 
      nombre: this.donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.B) 
    });

    return listaGruposSanguineos;
  }

  // Obtiene el listado de solicitudes
  public getSolicitudes(): Observable<Array<SolicitudModel>> {
    return this.http.get(this.config.apiEndPointSolicitudes)
      .map(res => res.json());
  }

  // Método que guarda una solicitud en la base de datos
  public guardarSolicitud(unaSolicitud: SolicitudModel, solicitudId?: number) {
    if (solicitudId) {
      return this.authHttp.put(`${this.apiEndPointSolicitudes}/${solicitudId}`,
        JSON.stringify(unaSolicitud))
        .map(res => res.json());
    } else {
      return this.authHttp.post(this.apiEndPointSolicitudes,
        JSON.stringify(unaSolicitud))
        .map(res => res.json());
    }
  }
  
  // Método que elimina una solicitud en la base de datos
  public eliminarSolicitud(unaSolicitud: SolicitudModel) {
    return this.authHttp.delete(`${this.apiEndPointSolicitudes}/${unaSolicitud.solicitudID}`);
    
  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Observable<Array<ProvinciaModel>>{
    return this.http.get(this.apiEndPointProvincias)
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

  // Obtiene el listado de localidades de la provincia pasada como parametro
  public getListaLocalidadesPorProvincia(provinciaID: string): Observable<Array<LocalidadModel>>{

    this.listaLocalidades = [];

    return this.http.get(`${this.apiEndPointLocalidades}/${provinciaID}`)
      .map(res => res.json().filter(unaLocalidad => unaLocalidad.provincia == provinciaID))
      .map(listadoLocalidades => {

        // Creamos el listado de localidades usando el modelo LocalidadModel
        for(let i=0; i<listadoLocalidades.length; i++) {
          this.listaLocalidades.push(new LocalidadModel(listadoLocalidades[i].id, listadoLocalidades[i].nombre));
        }
        return this.listaLocalidades;
      });
  }
}
