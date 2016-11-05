// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Platform, List } from 'ionic-angular';

// Servicios
import { DonacionesService } from '../../../shared/services/donaciones.service';
import { DatosService } from '../../../shared/services/datos.service';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { EncabezadoSolicitudModel } from '../encabezado-solicitud.model';

// Paginas y componente base
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud.component';

// Objeto de configuracion
import { AppConfig } from '../../../shared/app-config';

@Component({
  selector: 'mis-solicitudes-page',
  templateUrl: 'mis-solicitudes.component.html'
})
export class MisSolicitudesPage {
  @ViewChild(List) list: List;

  public solicitudes: Array<EncabezadoSolicitudModel>;

  constructor(private platform: Platform,
              private navCtrl: NavController, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,               
              private datosService: DatosService,
              private donacionesService: DonacionesService,
              private config: AppConfig) 
  {    
    // Inicializa la lista de solicitudes
    this.solicitudes = [];

    // Cargamos las ultimas solicitudes
    this.buscarSolicitudes();
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    // Obtenemos las solicitudes del servidor
    this.datosService.getSolicitudes().subscribe((solicitudesObj) => { 
        for(let i = 0; i < solicitudesObj.length; i++) {
            let solicitud = new SolicitudModel(solicitudesObj[i]);
            let estaActiva = this.estaActiva(solicitud);
            this.solicitudes.push(new EncabezadoSolicitudModel(solicitud, estaActiva));
        }

        // Oculta el mensaje de espera
        loadingPopup.dismiss();
    });
  }

  // Método que obtiene la informacion de los tipos sanguineos buscados, resaltando el del usuario
  public obtenerInformacionTiposSanguineos(unaSolicitud: SolicitudModel): string {
      let posiblesDadores = this.donacionesService.puedeRecibirDe(unaSolicitud.grupoSanguineo.id, unaSolicitud.factorSanguineo.id);
      return posiblesDadores.join(' ');
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
