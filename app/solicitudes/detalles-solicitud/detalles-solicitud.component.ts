// Referencias de Angular
import { Component, Inject } from '@angular/core';
import { LoadingController, NavController, NavParams, Platform } from 'ionic-angular';

// Objeto de configuracion
import { MY_CONFIG, MY_CONFIG_TOKEN, ApplicationConfig } from '../../shared/app-config';

// Servicios
import { ConectividadService } from '../../shared/services/conectividad.service';
import { LocalizacionService } from '../../shared/services/localizacion.service';
import { DatosService } from '../../shared/services/datos.service';
import { DonacionesHelper } from '../../shared/services/donaciones.service';

// Modelos
import { SolicitudModel } from '../../solicitudes/solicitud.model';

// Pipes
import { FormatearFechaPipe } from '../../shared/formatear-fecha.pipe';

@Component({
	templateUrl: 'build/solicitudes/detalles-solicitud/detalles-solicitud.component.html',
  pipes: [ FormatearFechaPipe ]
})
export class DetallesSolicitudPage {

	// Variables de la clase
	private solicitudSeleccionada: SolicitudModel;

  // Informacion del mapa
  private mapSrc: string;

  private tiposSanguineosSolicitud: string;
  private compatibleConUsuario: boolean;

  private storage: Storage;

	constructor(private platform: Platform,
              private nav: NavController, 
              private navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private datosService: DatosService,
              private localizacionService: LocalizacionService,
              @Inject(MY_CONFIG_TOKEN) config: ApplicationConfig) {
      
      if(this.datosService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / constructor');
      }

  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');

      this.obtenerDatosUsuario();

      // Crea el mapa
      this.obteneMapaUrl(config.staticMapUrl, config.staticMapKey, 400, 400, 16);

      if(this.datosService.modoDebugActivado()) {
        console.timeEnd('DetallesSolicitudPage / constructor');
      }
  	}

    // Método que crea la imagen del mapa
    public obteneMapaUrl(mapUrl: string, mapKey: string, width: number, height: number, zoom: number): void {
    
      // Obtenemos la direccion de la institución
      let direccion = `${ this.solicitudSeleccionada.getDireccion() },${ this.solicitudSeleccionada.getCiudad().getNombre() },${ this.solicitudSeleccionada.getProvincia().getNombre() },Argentina`;

      // Generamos la url del mapa estatico
      this.mapSrc = `${ mapUrl }?zoom=${ zoom }&size=${ width }x${ height }&markers=color:red%7C${ direccion.replace(/ /g, '+') }&key=${ mapKey }`;
    }

    // Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
    public mostrarRuta():void {   

      // Obtenemos la direccion de la institución
      let direccion = `${ this.solicitudSeleccionada.getDireccion() },${ this.solicitudSeleccionada.getCiudad().getNombre() },${ this.solicitudSeleccionada.getProvincia().getNombre() },Argentina`;

      // Invocamos al servicio usando la direccion y el nombre de la institucion 
      this.localizacionService.mostrarRuta(direccion, this.solicitudSeleccionada.getInstitucion());
    }

    // Método que obtiene los datos del usuario
    public obtenerDatosUsuario(){

      if(this.datosService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / obtenerDatosUsuario');
      }

      this.tiposSanguineosSolicitud = DonacionesHelper.puedeRecibirDe(this.solicitudSeleccionada.getGrupoSanguineo().getId(), 
                                                                      this.solicitudSeleccionada.getFactorSanguineo().getId()).join(' ');
      this.compatibleConUsuario = false;

      // Obtenemos los datos del servicio de datos del usuario
      this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => {
        if(preferenciasUsuario) {
          let tipoSanguineoUsuario = DonacionesHelper.getDescripcion(preferenciasUsuario.grupoSanguineoID, preferenciasUsuario.factorSanguineoID);

          // Si es compatible mostramos un mensjae informandolo
          this.compatibleConUsuario = this.tiposSanguineosSolicitud.indexOf(tipoSanguineoUsuario) > -1;

          // Resaltamos el tipo sanguineo del usuario
          this.tiposSanguineosSolicitud = this.tiposSanguineosSolicitud.replace(tipoSanguineoUsuario, '<span class="marked">' + tipoSanguineoUsuario + '</span> ');

          if(this.datosService.modoDebugActivado()) {
            console.timeEnd('DetallesSolicitudPage / obtenerDatosUsuario');
          }
        }
      });
    }
  }


