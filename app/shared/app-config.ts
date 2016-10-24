// Referencias de Angular
import { Injectable } from '@angular/core';

// Interface utilizada para evitar warnings de Typescript
export interface ApplicationConfig {
  apiEndPointProvincias: string;
  apiEndPointLocalidades: string;
  apiEndPointSolicitudes: string;
  staticMapUrl: string;
  staticMapKey: string;
}

@Injectable()
export class AppConfig {

  // Endpoints
  public apiEndPointProvincias: string =	  './provincias.json';
  public apiEndPointLocalidades: string = 	'./localidades.json';
  public apiEndPointSolicitudes: string =	  './solicitudes.json';

  // Google maps
  public autocompleteKey: string =          '';
  public staticMapUrl: string =             'https://maps.googleapis.com/maps/api/staticmap';
  public staticMapKey: string =             '';
  public alto: number =                     400;
  public largo: number =                    400;
  public zoom: number =                     16;

  // Auth0
  public clientId: string =                 '';
  public domain: string =                   '';

  // Otras configuraciones
  public modoDebug: boolean =               false;

}