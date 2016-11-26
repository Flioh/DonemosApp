// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Events, Platform, List } from 'ionic-angular';

// Servicios
import { DonacionesService } from '../../../shared/services/donaciones.service';
import { DatosService } from '../../../shared/services/datos.service';
import { LoginService } from '../../../shared/services/login.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { ResumenMiSolicitudModel } from '../resumen-mi-solicitud.model';

// Paginas y componente base
import { BasePage } from '../../../shared/components/base/base.component';
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud.component';

// Objeto de configuracion
import { AppConfig } from '../../../shared/app-config';

@Component({
  selector: 'mis-solicitudes-page',
  templateUrl: 'mis-solicitudes.component.html'
})
export class MisSolicitudesPage extends BasePage {
  @ViewChild(List) list: List;

  public solicitudes: Array<ResumenMiSolicitudModel>;

  constructor(private platform: Platform,
    private navCtrl: NavController, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private eventsCtrl: Events,           
    private datosService: DatosService,
    private loginService: LoginService,
    private donacionesService: DonacionesService) 
  {    
    super();

    // Inicializa la lista de solicitudes
    this.solicitudes = [];

    // Cargamos las ultimas solicitudes
    this.buscarSolicitudes();
  }

  // Método que se ejecutan al haber cambios en el estado de la conexion
  public inicializarEventosConexion() {
    this.eventsCtrl.subscribe('conexion:conectado', () => {

      // Si el usuario vuelve a tener conexion a internet, buscamos nuevamente las solicitudes
      this.buscarSolicitudes();
    });
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {
    this.solicitudes = [];

    // Obtenemos el id del usuario
    let usuarioId = this.loginService.user ? this.loginService.user.user_id : null;

    if(usuarioId) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Cargando solicitudes'
      });

      // Muestra el mensaje de cargando ciudades
      loadingPopup.present();

      // Obtenemos las solicitudes del servidor
      this.datosService.getSolicitudesUsuario(usuarioId).subscribe(
        (solicitudesObj) => { 
          for(let i = 0; i < solicitudesObj.length; i++) {
            let solicitud = new SolicitudModel(solicitudesObj[i]);
            let estaActiva = this.estaActiva(solicitud);
            this.solicitudes.push(new ResumenMiSolicitudModel(solicitud, estaActiva));
          }

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

        }, (error) => {

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          this.procesarError(this.config.excepcionListaSolicitudesUsuario, 'buscarSolicitudes', 'MisSolicitudesPage', 'error', `Error al buscar solicitudes del usuario ${usuarioId}.`, error);
          this.mostrarMensajeError('Error', this.config.errorMisSolicitudes);

        });

    } else {
      this.procesarError(this.config.excepcionListaSolicitudesUsuario, 'buscarSolicitudes', 'MisSolicitudesPage', 'error', `El usuario no posee id pero accedio al listado de mis solicitudes.`, null);
      this.mostrarMensajeError('Error', this.config.errorMisSolicitudes);
    }
  }

  // Método que obtiene la informacion de los tipos sanguineos buscados, resaltando el del usuario
  public obtenerInformacionTiposSanguineos(unaSolicitud: SolicitudModel): string {

    let tiposSanguineosBuscados = [];

    for(let i=0; i<unaSolicitud.tiposSanguineos.length; i++) {
      let grupoSanguineo = unaSolicitud.tiposSanguineos[i].grupoSanguineo;
      let factorSanguineo = unaSolicitud.tiposSanguineos[i].factorSanguineo;
      tiposSanguineosBuscados.push(this.donacionesService.getDescripcionCompleta(grupoSanguineo, factorSanguineo));
    }

    return tiposSanguineosBuscados.join(' ');
  }

  // Método que determina si una solicitud esta activa o no segun su fecha de creación
  public estaActiva(solicitud: SolicitudModel): boolean {

    // Obtenemos la fecha de creacion de la solicitud
    let fechaSolicitud = typeof solicitud.fechaCreacion == 'string' 
    ? new Date(solicitud.fechaCreacion) 
    : solicitud.fechaCreacion;

    let fechaHoy = new Date();

    // Obtenemos los meses de cada una de las fechas
    let mesesSolicitud = fechaSolicitud.getFullYear() + fechaSolicitud.getMonth();
    let mesesDiaHoy = fechaHoy.getFullYear() + fechaHoy.getMonth();

    // Retornamos true si pasaron menos de los meses establecidos en la configuracion
    return mesesDiaHoy - mesesSolicitud < this.config.mesesParaOcultarSolicitud;
  } 

  // Método que abre la pagina de edicion de la solicitud
  public editarSolicitud(unaSolicitud: SolicitudModel): void {

    // Abrimos la pagina de edicion de la solicitud
    this.navCtrl.push(NuevaSolicitudPage, 
      { 'unaSolicitud' : unaSolicitud },
      { animate: true, direction: 'forward' })

    .then(() => {
      // Volvemos todos los items a su posicion original
      this.list.closeSlidingItems();
    });
  }

  // Método que solicita la eliminación de la solicitud.
  public eliminarSolicitud(unaSolicitud: SolicitudModel): void {
    
    let confirmacionPopup = this.alertCtrl.create({
      title: 'Confirmar',
      message: '',
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Borrar Solicitud',
        handler: () => {
          
          this.datosService.eliminarSolicitud(unaSolicitud).subscribe(
            (res) => {
              if (res.ok) {
                // TODO: Confirm, remove from displayed list
              } else {
                this.procesarError(this.config.excepcionEliminarSolicitud, 'eliminarSolicitud', 'MisSolicitudesPage', 'error', `Error al eliminar la solicitud ${unaSolicitud.solicitudID}`, res);
                this.mostrarMensajeError('Error', this.config.errorEliminarSolicitud);
              }
            }, 

            (error) => {
              this.procesarError(this.config.excepcionEliminarSolicitud, 'eliminarSolicitud', 'MisSolicitudesPage', 'error', `Error al eliminar la solicitud ${unaSolicitud.solicitudID}`, error);
              this.mostrarMensajeError('Error', this.config.errorEliminarSolicitud);
            });
          
        }
      }]
    });    
  }

  // Método que abre la pagina de detalles de la solicitud
  public verDetalles(unaSolicitud: SolicitudModel): void {

    // Abrimos la pagina de detalles de la solicitud
    this.navCtrl.push(DetallesSolicitudPage, 
      { 'unaSolicitud' : unaSolicitud },
      { animate: true, direction: 'forward' })

    .then(() => {
      // Volvemos todos los items a su posicion original
      this.list.closeSlidingItems();
    });;
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

  // Método que muestra ayuda sobre las funciones de la página
  public mostrarAyuda() {
    let alert = this.alertCtrl.create({
      title: 'Mis Solicitudes',
      message: `A continuación se muestran las solicitudes que creaste. Para editar o ver los detalles detalles
      desliza la solicitud hacia la izquierda. Las solicitudes que poseen el ícono en gris es porque
      ya no estan activas (debido a que fueron creadas hace más de un mes). Puedes activarlas nuevamente
      deslizando la solicitud y presionando <strong>Editar</strong>`,
      buttons: ['Ok']
    });

    alert.present();
  }
}
