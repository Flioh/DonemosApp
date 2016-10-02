import { OpaqueToken } from '@angular/core';

export interface ApplicationConfig {
  apiEndPointProvincias: string;
  apiEndPointLocalidades: string;
  apiEndPointSolicitudes: string;
  staticMapUrl: string;
  staticMapKey: string;
}

// Objeto de configuracion para la aplicacion
export const MY_CONFIG: ApplicationConfig = {
  apiEndPointProvincias: 	  './provincias.json',
  apiEndPointLocalidades: 	'./localidades.json',
  apiEndPointSolicitudes: 	'./solicitudes.json',
  staticMapUrl:             'https://maps.googleapis.com/maps/api/staticmap',
  staticMapKey:             'AIzaSyCW_Mlb8DXkLE4ga5YreODfY6ECo5kTiw8'
};

// Creamos un token para evitar conflictos por nombres
export const MY_CONFIG_TOKEN = new OpaqueToken('config');