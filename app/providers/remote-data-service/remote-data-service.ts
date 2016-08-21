import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NuevaSolicitudModel } from '../nueva-solicitud-model/nueva-solicitud-model';
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from '../../app-config.ts';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class RemoteDataService {

  private listaProvincias: Array<any>;
  
  private provinciaSeleccionadaID: number;
  private listaCiudades: Array<any>;

  private apiEndPointProvincias : string = './provincias.json';
  private apiEndPointLocalidades: string = './localidades.json';
  private apiEndPointSolicitudes: string = './solicitudes.json';

  constructor(public http: Http) {
    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];
  }

  // Obtiene el listado de solicitudes
  public getSolicitudes(): Observable<Array<NuevaSolicitudModel>> {
    
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
  public getListaProvincias(): Observable<Array<any>>{

    return Observable.create(observer => {
      this.http.get(this.apiEndPointProvincias)
        .map(res => res.json())
        .subscribe(listadoProvincias => {

          this.listaProvincias = listadoProvincias;

          // Simulamos un retardo al buscar las provincias
          setTimeout(() => {           
            observer.next(this.listaProvincias);            
            observer.complete();
          }, 1000);        
        });
    });

  }

  // Obtiene el listado de ciudades de la provincia pasada como parametro
  public getListaCiudadesPorProvincia(provinciaID: number): Observable<Array<any>>{

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
              .map(res => res.json().filter(function(unaLocalidad) {
                  if(unaLocalidad.provincia == provinciaID)
                    return true;
                  return false;
              }))
              .subscribe(listadoCiudades => {
                this.listaCiudades = listadoCiudades;
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

