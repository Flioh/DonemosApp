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
  // public apiEndPointProvincias: string =	  './provincias.json';
  // public apiEndPointLocalidades: string = 	'./localidades.json';
  // public apiEndPointSolicitudes: string =	'./solicitudes.json';

  public apiEndPointProvincias: string =	    'https://4692a01d.ngrok.io/provincia';
  public apiEndPointLocalidades: string = 	  'https://4692a01d.ngrok.io/localidad';
  public apiEndPointSolicitudes: string =	    'https://4692a01d.ngrok.io/solicitud';
  public apiEndPointBancosSangre: string =    'https://4692a01d.ngrok.io/banco';

  // Google maps
  public autocompleteKey: string =            'AIzaSyCK3zLNXPwaGq3DlPV48fFUlFGjV_eIk4o';
  public staticMapUrl: string =               'https://maps.googleapis.com/maps/api/staticmap';
  public staticMapKey: string =               'AIzaSyC1PIj9RJRdOerMNN5S-hz6B9uqUjOfi9E';
  public staticMapTamanio: number =           400;
  public staticMapZoom: number =              16;

  // Auth0
  public authClientId: string =               'DY8adElNXTxdjzEpdWl3E6VL6XkuYog1';
  public authDomain: string =                 'donemos.auth0.com';

  // Otras configuraciones
  public modoDebug: boolean =                 true;
  public mesesParaOcultarSolicitud =          2;

  // Excepciones
  public excepcionPreferenciasUsuario =               'ObtenerPreferenciasUsuarioException';
  public excepcionGuardarPreferenciasUsuario =        'GuardarPreferenciasUsuarioException';

  public excepcionListaSolicitudes =                  'ListaSolicitudesException';
  public excepcionListaBancosSangre =                 'ListaBancosSangreException';
  public excepcionListaSolicitudesUsuario =           'ListaSolicitudesUsuarioException';
  public excepcionListaLocalidades =                  'ListaLocalidadesException';
  public excepcionListaProvincias =                   'ListaProvinciasException';

  public excepcionEliminarSolicitud =                 'EliminarSolicitudException';
  public excepcionCrearSolicitud =                    'CrearSolicitudException';
  public excepcionEditarSolicitud =                   'EditarSolicitudException';

  // Mensajes de Error
  public errorSolicitudes: string =                   'Se ha producido un error al buscar solicitudes. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorBancosSangre: string =                  'Se ha producido un error al buscar los bancos de sangre. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorMisSolicitudes: string =                'Se ha producido un error al buscar las solicitudes cargadas por vos. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorProvincias: string =                    'Se ha producido un error al buscar el listado de provincias. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorLocalidades: string =                   'Se ha producido un error al buscar el listado de localidades. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorSinConexion: string =                   'Se requiere acceso a internet para poder obtener las solicitudes. Comprueba tu conexión a internet y vuelve a intentarlo nuevamente.';

  public errorEliminarSolicitud: string =             'Se ha producido un error al eliminar la solicitud. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorCrearSolicitud: string =                'Se ha producido un error al crear la solicitud. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorEditarSolicitud: string =               'Se ha producido un error al editar la solicitud. Por favor vuelva a intentarlo nuevamente más tarde.';

  public errorPreferenciasUsuario: string =           'Se ha producido un error al obtener sus preferencias de usuario. Por favor vuelva a intentarlo nuevamente más tarde.';
  public errorGuardarPreferenciasUsuario: string =    'Se ha producido un error al guardar sus preferencias de usuario. Por favor vuelva a intentarlo nuevamente más tarde.';


}