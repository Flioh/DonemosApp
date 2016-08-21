import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { NuevaSolicitudModel } from '../nueva-solicitud-model/nueva-solicitud-model';
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from '../../app-config.ts';
import 'rxjs/add/operator/map';

@Injectable()
export class RemoteDataService {

  private listaProvincias: Array<any>;
  
  private provinciaSeleccionadaID: number;
  private listaCiudades: Array<any>;

  private apiEndPointProvincias: string;
  private apiEndPointLocalidades: string;
  private apiEndPointSolicitudes: string; 

  constructor(public http: Http, @Inject(MY_CONFIG_TOKEN) config: ApplicationConfig) {
    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];

    // Seteamos las URLs de las APIs
    this.apiEndPointLocalidades = config.apiEndPointLocalidades;
    this.apiEndPointProvincias = config.apiEndPointProvincias;
    this.apiEndPointSolicitudes = config.apiEndPointSolicitudes; 
  }

  // Obtiene el listado de solicitudes
  public obtenerSolicitudes(): Promise<Array<NuevaSolicitudModel>> {
    
    return new Promise(resolve => {
      this.http.get(this.apiEndPointSolicitudes)
      .map(res => res.json())
      .subscribe(data => {

        // Simulamos un retardo al buscar las solicitudes
        setTimeout(() => {
          resolve(data);
        }, 1000);        
      });
    });
  }

  // Obtiene el listado de provincias
  public getListaProvincias(): Promise<Array<any>>{

      return new Promise(resolve => {
        this.http.get(this.apiEndPointProvincias)
        .map(res => res.json())
        .subscribe(listadoProvincias => {

          this.listaProvincias = listadoProvincias;

          // Simulamos un retardo al buscar las solicitudes
          setTimeout(() => {
            resolve(listadoProvincias);
            }, 1000);        
          });
      });
  }

  // Obtiene el listado de ciudades de la provincia pasada como parametro
  public getListaCiudadesPorProvincia(provinciaID: number){

    return new Promise<Array<any>>(resolve => {

        if(this.provinciaSeleccionadaID == provinciaID) {
          // Ya tenemos cargadas las ciudades de esa provincia, por lo que no
          // hacemos la llamada http al servidor
          resolve(this.listaCiudades);        
        } else {
            this.listaCiudades = [];
            // Guardamos el ID de la provincia para evitar volver a pedir las ciudades si ya tenemos ese listado cargado
            this.provinciaSeleccionadaID = provinciaID;

            this.http.get(this.apiEndPointLocalidades)
              .map(res => res.json()
                .filter(function(unaLocalidad) {
                if(unaLocalidad.provincia == provinciaID)
                  return true;
                return false;
              }))
              .subscribe(listadoCiudades => {
                this.listaCiudades = listadoCiudades;
                // Simulamos un retardo al buscar las solicitudes
                setTimeout(() => {
                  resolve(listadoCiudades);
                  }, 1000);        
                });

        }
    });
  }
}

