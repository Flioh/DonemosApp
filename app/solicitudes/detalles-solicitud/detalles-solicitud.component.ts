// Referencias de Angular
import { Component, Inject } from '@angular/core';
import { LoadingController, Events, NavController, NavParams, Page, Platform } from 'ionic-angular';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

// Servicios
import { ConectividadService } from '../../shared/services/conectividad.service';
import { LocalizacionService } from '../../shared/services/localizacion.service';
import { DatosService } from '../../shared/services/datos.service';
import { DonacionesHelper } from '../../shared/services/donaciones.service';

// Modelos
import { SolicitudModel } from '../../solicitudes/solicitud.model';

// Pipes
import { FormatearFechaPipe } from '../../shared/formatear-fecha.pipe';

// Componente base
import { BasePage } from '../../shared/base/base.component';

@Component({
	templateUrl: 'build/solicitudes/detalles-solicitud/detalles-solicitud.component.html',
  pipes: [ FormatearFechaPipe ]
})
export class DetallesSolicitudPage extends BasePage {

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
              eventsCtrl: Events,            
              config: AppConfig) {
      
      // Inicializa la clase padre manualmente debido a un issue de angular
      // https://github.com/angular/angular/issues/5155
      super(eventsCtrl, config);

      this.iniciarTimer('DetallesSolicitudPage / constructor');

  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');

      this.obtenerDatosUsuario();

      // Crea el mapa
      this.obteneMapaUrl(config.staticMapUrl, config.staticMapKey, 400, 400, 16);

      this.detenerTimer('DetallesSolicitudPage / constructor');
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

      this.iniciarTimer('DetallesSolicitudPage / obtenerDatosUsuario');

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

          this.detenerTimer('DetallesSolicitudPage / obtenerDatosUsuario');
        }
      });
    }
  }


