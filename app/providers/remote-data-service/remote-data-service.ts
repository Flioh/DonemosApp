import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

/* Models usados en el servicio */
import { SolicitudModel } from '../solicitud-model/solicitud-model';
import { ProvinciaModel } from '../provincia-model/provincia-model';
import { CiudadModel } from '../ciudad-model/ciudad-model';
import { FactorSanguineoModel } from '../factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../grupo-sanguineo-model/grupo-sanguineo-model';

/* Helpers */
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../donemos-helper-service/donemos-helper-service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../donemos-helper-service/donemos-helper-service';

/* Objeto con las configuraciones de la app */
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from '../../app-config.ts';

@Injectable()
export class RemoteDataService {

  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  private provinciaSeleccionadaID: number;

  private apiEndPointProvincias : string = './provincias.json';
  private apiEndPointLocalidades: string = './localidades.json';
  private apiEndPointSolicitudes: string = './solicitudes.json';

  constructor(public http: Http) {
    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];
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
    
    return Observable.create(observer => {
      this.http.get(this.apiEndPointSolicitudes)
        .map(res => res.json())
        .subscribe(listadoSolicitudes => {

          for(let i=0; i<listadoSolicitudes.length; i++) {
            listadoSolicitudes[i].provincia = new ProvinciaModel(1, "Provincia 1");
            listadoSolicitudes[i].ciudad = new CiudadModel(1, "Ciudad 1");
            listadoSolicitudes[i].grupoSanguineo = new GrupoSanguineoModel(GrupoSanguineoEnum.A, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.A));
            listadoSolicitudes[i].factorSanguineo = new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhPositivo));
          }

          // Simulamos un retardo al buscar las solicitudes
          setTimeout(() => {            
            observer.next(listadoSolicitudes);            
            observer.complete();
          }, 1000);        
        });
    });

  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Observable<Array<ProvinciaModel>>{

    return Observable.create(observer => {
      this.http.get(this.apiEndPointProvincias)
        .map(res => res.json())
        .subscribe(listadoProvincias => {

          this.listaProvincias = [];

          for(let i=0; i<listadoProvincias.length; i++) {
            this.listaProvincias.push(new ProvinciaModel(listadoProvincias[i].id, listadoProvincias[i].nombre));
          }

          // Simulamos un retardo al buscar las provincias
          setTimeout(() => {           
            observer.next(this.listaProvincias);            
            observer.complete();
          }, 1000);        
        });
    });

  }

  // Obtiene el listado de ciudades de la provincia pasada como parametro
  public getListaCiudadesPorProvincia(provinciaID: number): Observable<Array<CiudadModel>>{

    return Observable.create(observer => {
      if(this.provinciaSeleccionadaID == provinciaID) {
          // Ya tenemos cargadas las ciudades de esa provincia, por lo que no hacemos la llamada http al servidor
          observer.next(this.listaCiudades);
          observer.complete();  
       } else {
           this.listaCiudades = [];

           // Guardamos el ID de la provincia para evitar volver a pedir las ciudades si ya tenemos ese listado cargado
           this.provinciaSeleccionadaID = provinciaID;

           this.http.get(this.apiEndPointLocalidades)
           .map(res => res.json().filter(function(unaCiudad) {

                  // TODO: Remover esta parte cuando se reemplace por la llamada a la API
                  if(unaCiudad.provincia == provinciaID)
                    return true;
                  return false;
                }))

           .subscribe(listadoCiudades => {
             for(let i=0; i<listadoCiudades.length; i++) {
               this.listaCiudades.push(new CiudadModel(listadoCiudades[i].id, listadoCiudades[i].nombre));
             }

              // Simulamos un retardo al buscar las solicitudes
              setTimeout(() => {
                observer.next(this.listaCiudades);
                observer.complete();
              }, 1000);        
           });
        }
    })
  }
}

