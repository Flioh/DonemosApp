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
  public apiEndPointProvincias: string    =	          'https://d70bcd30.ngrok.io/provincia';
  public apiEndPointLocalidades: string   = 	        'https://d70bcd30.ngrok.io/localidad';
  public apiEndPointSolicitudes: string   =	          'https://d70bcd30.ngrok.io/solicitud';
  public apiEndPointBancosSangre: string  =           'https://d70bcd30.ngrok.io/banco';

  // Google maps
  public staticMapUrl: string =                       'https://maps.googleapis.com/maps/api/staticmap';
  public autocompleteKey: string =                    '';
  public staticMapKey: string =                       '';
  public staticMapTamanio: number =                   400;
  public staticMapZoom: number =                      16;

  // Auth0
  public authClientId: string =                       '';
  public authDomain: string =                         '';

  // Otras configuraciones
  public bugSnagApiKey: string =                      '';
  public modoDebug: boolean =                         false;
}