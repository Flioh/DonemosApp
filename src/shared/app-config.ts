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