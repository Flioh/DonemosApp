// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { LoadingController, Events, NavController, NavParams, Platform, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Servicios
import { LocalizacionService } from '../../../shared/services/localizacion.service';
import { DatosService } from '../../../shared/services/datos.service';
import { DonacionesService } from '../../../shared/services/donaciones.service';

// Modelos
import { SolicitudModel } from '../../solicitudes/solicitud.model';

@Component({
  selector: 'detalles-solicitud-page',
	templateUrl: 'detalles-solicitud.component.html'
})
export class DetallesSolicitudPage {
  @ViewChild(Content) content: Content;

	// Variables de la clase
	public solicitudSeleccionada: SolicitudModel;
  public tiposSanguineosSolicitud: string;
  public compatibleConUsuario: boolean;
  public direccionCompleta: string;

	constructor(private platform: Platform,
              private nav: NavController, 
              private navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private datosService: DatosService,
              private localizacionService: LocalizacionService,
              private donacionesService: DonacionesService,
              private eventsCtrl: Events,
              private storage: Storage) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');

      this.obtenerDatosUsuario();

      // Obtenemos la direccion de la institución
      this.direccionCompleta = `${ this.solicitudSeleccionada.direccion },${ this.solicitudSeleccionada.ciudad.nombre },${ this.solicitudSeleccionada.provincia.nombre },Argentina`;
  	}

    // Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
    public mostrarRuta():void {   

      // Invocamos al servicio usando la direccion y el nombre de la institucion 
      this.localizacionService.mostrarRuta(this.direccionCompleta, this.solicitudSeleccionada.institucion);
    }

    // Método que obtiene los datos del usuario
    public obtenerDatosUsuario() {
      this.tiposSanguineosSolicitud = this.donacionesService.puedeRecibirDe(this.solicitudSeleccionada.grupoSanguineo.id, this.solicitudSeleccionada.factorSanguineo.id).join(' ');
      this.compatibleConUsuario = false;

      // Obtenemos los datos del servicio de datos del usuario
      this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => {
        if(preferenciasUsuario) {
          let tipoSanguineoUsuario = this.donacionesService.getDescripcionCompleta(preferenciasUsuario.grupoSanguineoID, preferenciasUsuario.factorSanguineoID);

          // Si es compatible mostramos un mensjae informandolo
          this.compatibleConUsuario = this.tiposSanguineosSolicitud.indexOf(tipoSanguineoUsuario) > -1;

          // Resaltamos el tipo sanguineo del usuario
          this.tiposSanguineosSolicitud = this.tiposSanguineosSolicitud.replace(tipoSanguineoUsuario, '<span class="marked">' + tipoSanguineoUsuario + '</span> ');
        }
      });
    }
  }