import 'rxjs/add/operator/map';
import { CiudadModel } from '../../models/ciudad-model/ciudad-model';
import { FactorSanguineoHelper, GrupoSanguineoHelper } from '../donaciones-service/donaciones-service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../donaciones-service/donaciones-service';
import { FactorSanguineoModel } from '../../models/factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../../models/grupo-sanguineo-model/grupo-sanguineo-model';
import { ProvinciaModel } from '../../models/provincia-model/provincia-model';
import { SolicitudModel } from '../../models/solicitud-model/solicitud-model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DatosRemotosService {

  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  private provinciaSeleccionadaID: number;

  // TODO: usar las propiedades del objeto de configuracion
  private apiEndPointProvincias : string = './provincias.json';
  private apiEndPointLocalidades: string = './localidades.json';
  private apiEndPointSolicitudes: string = './solicitudes.json';

  private modoDebug: boolean;

  constructor(public http: Http) {

    // Loguea en la consola cada vez que se inicia o finaliza un método
    this.modoDebug = false;

    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];
  }

  // Método que devuelve true si el modo debug esta activado
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
