import 'rxjs/add/operator/map';
import { CiudadModel } from '../ciudad-model/ciudad-model';
import { FactorSanguineoHelper, GrupoSanguineoHelper } from '../donemos-helper-service/donemos-helper-service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../donemos-helper-service/donemos-helper-service';
import { FactorSanguineoModel } from '../factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../grupo-sanguineo-model/grupo-sanguineo-model';
import { ProvinciaModel } from '../provincia-model/provincia-model';
import { SolicitudModel } from '../solicitud-model/solicitud-model';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

/* Models usados en el servicio */

/* Helpers */

/* Objeto con las configuraciones de la app */

@Injectable()
export class RemoteDataService {

  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  private provinciaSeleccionadaID: string;

  private baseUrl: string = 'http://192.168.1.7:8080';

  private apiEndPointProvincias : string = `${this.baseUrl}/provincia`
  private apiEndPointLocalidades: string = `${this.baseUrl}/localidad`;
  private apiEndPointSolicitudes: string = `${this.baseUrl}/solicitud`;

  private modoDebug: boolean;

  constructor(public http: Http) {

    // Loguea en la consola cada vez que se inicia o finaliza un método
    this.modoDebug = true;

    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];
  }


  public modoDebugActivado(): boolean {
    return this.modoDebug;
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
    .map(res => res.json())
    .catch(err => {
      console.error(err);
      return Observable.from([]);
    });

  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Observable<Array<ProvinciaModel>>{

    return this.http.get(this.apiEndPointProvincias)
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
  public getListaCiudadesPorProvincia(provinciaID: string): Observable<Array<CiudadModel>>{

    if(this.provinciaSeleccionadaID == provinciaID) {
      // Ya tenemos cargadas las ciudades de esa provincia, por lo que no hacemos la llamada http al servidor
      return Observable.from([this.listaCiudades]);
    }

    this.listaCiudades = [];

    // Guardamos el ID de la provincia para evitar volver a pedir las ciudades si ya tenemos ese listado cargado
    this.provinciaSeleccionadaID = provinciaID;

    return this.http.get(`${this.apiEndPointLocalidades}/${provinciaID}`)
    .map(res => res.json())
    .map(listadoCiudades => {
      for(let i=0; i<listadoCiudades.length; i++) {
        this.listaCiudades.push(new CiudadModel(listadoCiudades[i].id, listadoCiudades[i].nombre));
      }
      return this.listaCiudades;
    });
  }

  public postSolicitud(solicitud: SolicitudModel): Observable<SolicitudModel> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http
    .post(this.apiEndPointSolicitudes, JSON.stringify(solicitud))
    .map(res => res.json());
  }
}
