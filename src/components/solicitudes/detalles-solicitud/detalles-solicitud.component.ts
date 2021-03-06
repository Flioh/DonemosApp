// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { LoadingController, Events, NavController, NavParams, Platform, Content, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Servicios
import { LocalizacionService } from '../../../shared/services/localizacion.service';
import { DatosService } from '../../../shared/services/datos.service';
import { DonacionesService } from '../../../shared/services/donaciones.service';

// Paginas y componente base
import { BasePage } from '../../../shared/components/base/base.component';
import { RequisitosPage } from '../../donaciones/requisitos/requisitos.component';

// Modelos
import { SolicitudModel } from '../../solicitudes/solicitud.model';

@Component({
  selector: 'detalles-solicitud-page',
  templateUrl: 'detalles-solicitud.component.html'
})
export class DetallesSolicitudPage extends BasePage{
  @ViewChild(Content) content: Content;

  // Variables de la clase
  public solicitudSeleccionada: SolicitudModel;
  public tiposSanguineosSolicitud: string;
  public compatibleConUsuario: boolean;
  public direccionCompleta: string;

  public mostrarNombrePaciente: boolean;

  constructor(private platform: Platform,
    private nav: NavController, 
    private navParams: NavParams, 
    private loadingCtrl: LoadingController, 
    private datosService: DatosService,
    private localizacionService: LocalizacionService,
    private donacionesService: DonacionesService,
    private eventsCtrl: Events,
    private alertCtrl: AlertController,
    private storage: Storage) {

    super();

    // Obtenemos la solicitud seleccionada a traves de navParams
    this.solicitudSeleccionada = navParams.get('unaSolicitud');

    this.mostrarNombrePaciente = false;

    this.obtenerDatosUsuario();

    // Obtenemos la direccion de la institución
    this.direccionCompleta = `${ this.solicitudSeleccionada.direccion },${ this.solicitudSeleccionada.localidad.nombre },${ this.solicitudSeleccionada.provincia.nombre },Argentina`;
  }

  // Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
  public mostrarRuta():void {   

    // Invocamos al servicio usando la direccion y el nombre de la institucion 
    this.localizacionService.mostrarRuta(this.direccionCompleta, this.solicitudSeleccionada.institucion);
  }

  // Método que muestra los datos personales del paciente
  public mostrarDatos(){
    this.mostrarNombrePaciente = true;
  }

  // Método que obtiene los datos del usuario
  public obtenerDatosUsuario() {

    let tiposSanguineosBuscados = [];

    for(let i=0; i<this.solicitudSeleccionada.tiposSanguineos.length; i++) {
      let grupoSanguineo = this.solicitudSeleccionada.tiposSanguineos[i].grupoSanguineo;
      let factorSanguineo = this.solicitudSeleccionada.tiposSanguineos[i].factorSanguineo;
      tiposSanguineosBuscados.push(this.donacionesService.getDescripcionCompleta(grupoSanguineo, factorSanguineo));
    }

    this.tiposSanguineosSolicitud = tiposSanguineosBuscados.join(' ');
    this.compatibleConUsuario = false;

    // Obtenemos los datos del servicio de datos del usuario
    this.datosService.getPreferenciasUsuario().then(
      (preferenciasUsuario) => {
        if(preferenciasUsuario) {
          let tipoSanguineoUsuario = this.donacionesService.getDescripcionCompleta(preferenciasUsuario.grupoSanguineoID, preferenciasUsuario.factorSanguineoID);

          // Si es compatible mostramos un mensjae informandolo
          this.compatibleConUsuario = this.tiposSanguineosSolicitud.indexOf(tipoSanguineoUsuario) > -1;

          // Resaltamos el tipo sanguineo del usuario
          this.tiposSanguineosSolicitud = this.tiposSanguineosSolicitud.replace(tipoSanguineoUsuario, '<span class="marked">' + tipoSanguineoUsuario + '</span> ');
        }
      }, 

      (error) => {
        this.procesarError(this.config.excepcionPreferenciasUsuario, 'obtenerDatosUsuario', 'DetallesSolicitudPage', 'error', 'Error al obtener las preferencias del usuario', error);
        this.mostrarMensajeError('Error', this.config.errorPreferenciasUsuario);
      });
  }

  // Método que muestra los requisitos para poder donar
  public verRequisitos() {
    this.nav.push(RequisitosPage);
  }

  // Método muestra un mensaje de error al usuario
  private mostrarMensajeError(titulo: string, mensajeUsuario: string, callback?: () => void) {
    let popupError = this.alertCtrl.create({
      title: titulo,
      message: mensajeUsuario,
      buttons: [
      {
        text: 'Ok',
        handler: () => {
          if(callback) {
            callback();
          }
        }
      }]
    });

    popupError.present();
  }


}