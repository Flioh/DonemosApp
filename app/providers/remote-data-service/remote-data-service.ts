import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from '../../app-config.ts';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { SolicitudModel } from '../solicitud-model/solicitud-model';
import { ProvinciaModel } from '../provincia-model/provincia-model';
import { CiudadModel } from '../ciudad-model/ciudad-model';

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

  // Obtiene el listado de solicitudes
  public getSolicitudes(): Observable<Array<SolicitudModel>> {
    
    return Observable.create(observer => {
      this.http.get(this.apiEndPointSolicitudes)
        .map(res => res.json())
        .subscribe(listadoSolicitudes => {

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

