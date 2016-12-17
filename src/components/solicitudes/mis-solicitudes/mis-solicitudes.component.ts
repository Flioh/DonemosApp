// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Events, Platform, List } from 'ionic-angular';

// Servicios
import { DonacionesService } from '../../../shared/services/donaciones.service';
import { DatosService } from '../../../shared/services/datos.service';
import { LoginService } from '../../../shared/services/login.service';
import { ExcepcionesService } from '../../../shared/services/excepciones.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';

// Paginas y componente base
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud.component';

@Component({
  selector: 'mis-solicitudes-page',
  templateUrl: 'mis-solicitudes.component.html'
})
export class MisSolicitudesPage {
  @ViewChild(List) list: List;

  public solicitudes: Array<SolicitudModel>;
  public isIos: boolean;
  public mostrarMensajeResultadoVacio: boolean;

  constructor(private platform: Platform,
              private navCtrl: NavController, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private eventsCtrl: Events,           
              private datosService: DatosService,
              private excepcionesService: ExcepcionesService,
              private loginService: LoginService,
              private donacionesService: DonacionesService) {    
    // Determinamos si es ios o no para ocultar/mostrar el boton flotante
    this.isIos = this.platform.is('ios');

    // Ocultamos el mensaje por defecto
    this.mostrarMensajeResultadoVacio = false;

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
            this.solicitudes.push(solicitud);
          }

          this.mostrarMensajeResultadoVacio = solicitudesObj.length === 0 ? true : false; 

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

        }, (error) => {

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          this.excepcionesService.notificarExcepcion(error, this.excepcionesService.obtenerListaSolicitudesUsuario, MisSolicitudesPage, 'buscarSolicitudes', usuarioId.toString());
          this.mostrarMensajeError('Error', this.excepcionesService.obtenerListaSolicitudesUsuario.mensajeUsuario);
        });

    } else {
      this.excepcionesService.notificarExcepcion(null, this.excepcionesService.obtenerSolicitudesUsuarioSinId, MisSolicitudesPage, 'buscarSolicitudes');
      this.mostrarMensajeError('Error', this.excepcionesService.obtenerSolicitudesUsuarioSinId.mensajeUsuario);
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
      message: `¿Estás seguro que querés borrar la solicitud de ${unaSolicitud.nombrePaciente}?`,
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Borrar',
        handler: () => {
          
          this.datosService.eliminarSolicitud(unaSolicitud).subscribe(
            (resultado) => {
              if (resultado.ok) {
                
                // Cargamos las ultimas solicitudes
                this.buscarSolicitudes();

              } else {
                // Ocultamos el mensaje
                confirmacionPopup.dismiss();
                this.excepcionesService.notificarExcepcion(null, this.excepcionesService.eliminarSolicitud, MisSolicitudesPage, 'eliminarSolicitud', unaSolicitud.solicitudID.toString());
                this.mostrarMensajeError('Error', this.excepcionesService.eliminarSolicitud.mensajeUsuario);
              }
            }, 

            (error) => {
              // Ocultamos el mensaje
              confirmacionPopup.dismiss();
              this.excepcionesService.notificarExcepcion(null, this.excepcionesService.eliminarSolicitud, MisSolicitudesPage, 'eliminarSolicitud', unaSolicitud.solicitudID.toString());
              this.mostrarMensajeError('Error', this.excepcionesService.eliminarSolicitud.mensajeUsuario);
            });
          
        }
      }]
    });

    confirmacionPopup.present();
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

  // Método que lleva a la pantalla de creación de solicitudes
  public nuevaSolicitud(): void {
    this.navCtrl.push(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
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
      message: `Se muestran las solicitudes que creaste. Para editar o ver los detalles, deslizá la solicitud hacia la izquierda. Las solicitudes que hayan sido creadas hace más de un mes dejan de mostrarse.`,
      buttons: ['Ok']
    });

    alert.present();
  }
}
