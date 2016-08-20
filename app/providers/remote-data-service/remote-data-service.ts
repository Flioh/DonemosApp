import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RemoteDataService {

  private listaProvincias: Array<any>;
  
  private provinciaSeleccionadaID: number;
  private listaCiudades: Array<any>;


  constructor(public http: Http) {
    this.listaProvincias = [];
    this.provinciaSeleccionadaID = null;
    this.listaCiudades = [];
  }

  public obtenerSolicitudes(): any {
    return new Promise(resolve => {
      this.http.get('./solicitudes.json')
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      });
    });
  }


  public getListaProvincias(): Promise<Array<any>>{
    return new Promise<Array<any>>(resolve => {

      this.listaProvincias = [];

      this.listaProvincias.push({id : 1, nombre: 'Buenos Aires'});
      this.listaProvincias.push({id : 2, nombre: 'Catamarca'});
      this.listaProvincias.push({id : 3, nombre: 'Chaco'});
      this.listaProvincias.push({id : 4, nombre: 'Chubut'});
      this.listaProvincias.push({id : 5, nombre: 'Ciudad Autonoma de Bs. As.'});
      this.listaProvincias.push({id : 6, nombre: 'Córdoba'});
      this.listaProvincias.push({id : 7, nombre: 'Corrientes'});
      this.listaProvincias.push({id : 8, nombre: 'Entre Ríos'});
      this.listaProvincias.push({id : 9, nombre: 'Formosa'});
      this.listaProvincias.push({id : 10, nombre: 'Jujuy'});
      this.listaProvincias.push({id : 11, nombre: 'La Pampa'});
      this.listaProvincias.push({id : 12, nombre: 'La Rioja'});
      this.listaProvincias.push({id : 13, nombre: 'Mendoza'});
      this.listaProvincias.push({id : 14, nombre: 'Misiones'});
      this.listaProvincias.push({id : 15, nombre: 'Neuquén'});
      this.listaProvincias.push({id : 16, nombre: 'Río Negro'});
      this.listaProvincias.push({id : 17, nombre: 'Salta'});
      this.listaProvincias.push({id : 18, nombre: 'San Juan'});
      this.listaProvincias.push({id : 19, nombre: 'San Luis'});
      this.listaProvincias.push({id : 20, nombre: 'Santa Cruz'});
      this.listaProvincias.push({id : 21, nombre: 'Santa Fe'});
      this.listaProvincias.push({id : 22, nombre: 'Santiago del Estero'});
      this.listaProvincias.push({id : 23, nombre: 'Tierra del Fuego'});
      this.listaProvincias.push({id : 24, nombre: 'Tucumán'});

        // Resuelve la promesa
        resolve(this.listaProvincias);
      });
  }

  public getListaCiudadesPorProvincia(provinciaID: number){

    return new Promise<Array<any>>(resolve => {

      setTimeout(() => {

        // TODO: chequear si la provincia es la ya cargada, retornar el
        //       array de ciudades sin buscarlas nuevamente del servidor
        // -------------------------------------------------------------

        this.listaCiudades = [];

        this.provinciaSeleccionadaID = provinciaID;

        this.listaCiudades.push({id : 1, nombre: 'Prov ' + provinciaID + ' Ciudad 01'});
        this.listaCiudades.push({id : 2, nombre: 'Prov ' + provinciaID + ' Ciudad 02'});
        this.listaCiudades.push({id : 3, nombre: 'Prov ' + provinciaID + ' Ciudad 03'});
        this.listaCiudades.push({id : 4, nombre: 'Prov ' + provinciaID + ' Ciudad 04'});
        this.listaCiudades.push({id : 5, nombre: 'Prov ' + provinciaID + ' Ciudad 05'});
        this.listaCiudades.push({id : 6, nombre: 'Prov ' + provinciaID + ' Ciudad 06'});
        this.listaCiudades.push({id : 7, nombre: 'Prov ' + provinciaID + ' Ciudad 07'});
        this.listaCiudades.push({id : 8, nombre: 'Prov ' + provinciaID + ' Ciudad 08'});
        this.listaCiudades.push({id : 9, nombre: 'Prov ' + provinciaID + ' Ciudad 09'});
        this.listaCiudades.push({id : 10, nombre: 'Prov ' + provinciaID + ' Ciudad 10'});

        // Resuelve la promesa
        resolve(this.listaCiudades);

      }, 1000);
    });
  }
}

