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
  public autocompleteKey: string =          'AIzaSyCK3zLNXPwaGq3DlPV48fFUlFGjV_eIk4o';
  public staticMapUrl: string =             'https://maps.googleapis.com/maps/api/staticmap';
  public staticMapKey: string =             'AIzaSyC1PIj9RJRdOerMNN5S-hz6B9uqUjOfi9E';
  public alto: number =                     400;
  public largo: number =                    400;
  public zoom: number =                     16;

  // Auth0
  public clientId: string =                 'DY8adElNXTxdjzEpdWl3E6VL6XkuYog1';
  public domain: string =                   'donemos.auth0.com';

  // Otras configuraciones
  public modoDebug: boolean =               true;

}