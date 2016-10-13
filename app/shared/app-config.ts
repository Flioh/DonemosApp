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

  // Google maps URLs
  public staticMapUrl: string =             'https://maps.googleapis.com/maps/api/staticmap';
  public staticMapKey: string =             'AIzaSyCW_Mlb8DXkLE4ga5YreODfY6ECo5kTiw8';

  // Auth0
  public clientId: string =                 '4gUa8ibKIj6T8gMUvec3AzxbpirH5rGq';
  public domain: string =                   'donemos.auth0.com';

  // Otras configuraciones
  public modoDebug: boolean =               false;

}