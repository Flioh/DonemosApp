// Referencias de angular
import { Injectable } from '@angular/core';

export class DatosExcepcion {
	public nombre: string;
	public descripcion: string;
	public categoria: string;
	public mensajeUsuario: string;

	constructor(nombre, descripcion, categoria, mensajeUsuario?: string) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.categoria = categoria;
		this.mensajeUsuario = mensajeUsuario ? mensajeUsuario : 'Ha ocurrido un error.';
	}
}

@Injectable()
export class ExcepcionesService {

	// Excepciones
	// ---------------------------------------------------------------------------------------

	private mensajeIntentarMasTarde = 'Por favor volvé a intentarlo más tarde.';

	// Preferencias de usuario
	public obtenerPreferenciasUsuario: DatosExcepcion;
	public guardarPreferenciasUsuario: DatosExcepcion;

	// Listados
	public obtenerListaSolicitudes: DatosExcepcion;
	
	public obtenerListaBancosSangre: DatosExcepcion;
	public obtenerListaBancosSangreCoordenadas: DatosExcepcion;

	public obtenerListaSolicitudesUsuario: DatosExcepcion;
	public obtenerListaLocalidades: DatosExcepcion;
	public obtenerListaProvincias: DatosExcepcion;

	// ABM solicitudes
	public eliminarSolicitud: DatosExcepcion;
	public crearSolicitud: DatosExcepcion;
	public editarSolicitud: DatosExcepcion;
	public editarSolicitudSinId: DatosExcepcion;

	// Ubicacion usuario
	public coordenadasUsuario: DatosExcepcion;

	public obtenerSolicitudesUsuarioSinId: DatosExcepcion;


	constructor() {
		this.obtenerPreferenciasUsuario = new DatosExcepcion('ObtenerPreferenciasUsuarioException', 'Error al obtener las preferencias del usuario', 'error', `Se ha producido un error al obtener tus preferencias de usuario. ${this.mensajeIntentarMasTarde}`);
		this.guardarPreferenciasUsuario = new DatosExcepcion('GuardarPreferenciasUsuarioException', 'Error al guardar las preferencias del usuario', 'error', `Se ha producido un error al guardar tus preferencias de usuario. ${this.mensajeIntentarMasTarde}`);

		this.obtenerListaSolicitudes = new DatosExcepcion('ListaSolicitudesException', 'Error al obtener el listado de solicitudes', 'error', `Se ha producido un error al buscar solicitudes. ${this.mensajeIntentarMasTarde}`);
		this.obtenerListaSolicitudesUsuario = new DatosExcepcion('ListaSolicitudesUsuarioException', 'Error al buscar solicitudes del usuario', 'error', `Se ha producido un error al buscar tus solicitudes. ${this.mensajeIntentarMasTarde}`);
		this.obtenerSolicitudesUsuarioSinId = new DatosExcepcion('SolicitudesUsuarioSinIdException', 'El usuario no posee id pero accedio al listado de mis solicitudes', 'error', `Se ha producido un error al buscar tus solicitudes. ${this.mensajeIntentarMasTarde}`);

		this.obtenerListaBancosSangre = new DatosExcepcion('ListaBancosSangreException', 'Error al obtener el listado de bancos de sangre para la provincia', 'error', `Se ha producido un error al buscar los bancos de sangre. ${this.mensajeIntentarMasTarde}`);
		this.obtenerListaBancosSangreCoordenadas = new DatosExcepcion('ListaBancosSangreCoordenadasException', 'Error al obtener el listado de bancos de sangre según las coordenadas', 'error', `Se ha producido un error al buscar los bancos de sangre. ${this.mensajeIntentarMasTarde}`);

		this.obtenerListaLocalidades = new DatosExcepcion('ListaLocalidadesException', 'Error al obtener el listado de localidades de la provincia', 'error', `Se ha producido un error al buscar el listado de localidades. ${this.mensajeIntentarMasTarde}`);
		this.obtenerListaProvincias = new DatosExcepcion('ListaProvinciasException', 'Error al obtener el listado de provincias.', 'error', `Se ha producido un error al buscar el listado de provincias. ${this.mensajeIntentarMasTarde}`);

		this.eliminarSolicitud = new DatosExcepcion('EliminarSolicitudException', 'Error al eliminar la solicitud', 'error', `Se ha producido un error al eliminar la solicitud. ${this.mensajeIntentarMasTarde}`);
		this.crearSolicitud = new DatosExcepcion('CrearSolicitudException', 'Error al crear la solicitud', 'error', `Se ha producido un error al crear la solicitud. ${this.mensajeIntentarMasTarde}`);
		this.editarSolicitud = new DatosExcepcion('EditarSolicitudException', 'Error al editar la solicitud', 'error', `Se ha producido un error al editar la solicitud. ${this.mensajeIntentarMasTarde}`);
		this.editarSolicitudSinId = new DatosExcepcion('EditarSolicitudSinIdException', 'El usuario no posee id pero accedio a editar la solicitud', 'error', `Se ha producido un error al editar la solicitud. ${this.mensajeIntentarMasTarde}`);

		this.coordenadasUsuario = new DatosExcepcion('CoordenadasUsuarioException', 'Error al obtener la ubicación actual del usuario', 'warning', 'No hemos podido obtener tu ubicación actual. No te preocupes, es algo común. Por favor volvé a intentarlo más tarde o buscá bancos de sangre por provincia');
	}

	// Método que reporta las excepciones usando el servicio de Bugsnag
	public notificarExcepcion(errorObj: any, excepcion: DatosExcepcion, pagina: any, nombreMetodo: string, informacionAdicional?: string): void {
		let descripcion = informacionAdicional ? `${excepcion.descripcion} ${informacionAdicional}` : excepcion.descripcion;
		
        // Obtenemos el nombre de la pagina para no enviar todo el objeto
        let nombrePagina = pagina.toString().substr(9, pagina.toString().indexOf('(') - 9);

		if(errorObj) {
			Bugsnag.notifyException(errorObj, 
									excepcion.nombre, 
									{ 
										'metodo': nombreMetodo, 
										'pagina': nombrePagina, 
										'descripcion': descripcion 
									}, 
									excepcion.categoria);
		} else {
			Bugsnag.notify(excepcion.nombre, 
						   excepcion.descripcion, 
						   { 
						   		'metodo': nombreMetodo, 
						   		'pagina': nombrePagina
						   	}, 
						   excepcion.categoria);
		}
	}
}