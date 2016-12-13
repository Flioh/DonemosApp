// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { NavController, AlertController, Slides } from 'ionic-angular';

// Paginas
import { ListaSolicitudesPage } from '../../../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { EditarPreferenciasPage } from '../../../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';

// Servicios
import { DatosService } from '../../services/datos.service';

@Component({
  selector:'tutorial-page',
  templateUrl: 'tutorial.component.html',
})
export class TutorialPage {
    @ViewChild('tutorialSlider') slider: Slides;

    public opcionesSlider: any;
    public mostrarBotonesConfiguracion: boolean;

    constructor(public navCtrl: NavController,
                public datosService: DatosService,
                private alertCtrl: AlertController) {
        this.opcionesSlider = {
            pager: true
        };

        this.mostrarBotonesConfiguracion = true;

        // Si el usuario ya cargo las preferencias, no mostramos los botones de configuracion
        this.datosService.getPreferenciasUsuario().then(preferenciasUsuario => {
          if(preferenciasUsuario) {
            this.mostrarBotonesConfiguracion = false;
          }
        });
    }

    public volver() {
      this.navCtrl.pop();
    }

    // Método que muestra el listado de solicitudes
    public verListaSolicitudes() {

        let popupAdvertencia = this.alertCtrl.create({
        title: 'Confirmar',
        message: '¿Estas seguro? Si configuras las preferencias podrás ver solicitudes que coincidan con tu perfil y muchas otras cosas más.',
        buttons: [
          {
            text: 'Omitir',
            handler: () => {
                     
                this.datosService.setMostrarIntro(false).then(() => {
                    this.navCtrl.setRoot(ListaSolicitudesPage);
                });   
            }
          },
          {
            text: 'Configurar',
            handler: () => {
                this.inicializarPreferencias();
            }
          }]
      });

      // Mostramos el popup
      popupAdvertencia.present();

        
    }

    // Método que selecciona el slider cuyo indice se pasa como parametro
    public mostrarSlider(indice: number) {
      this.slider.slideTo(indice, 500);
    }

    // Método que muestra la pantalla de preferencias
    public inicializarPreferencias() {
        this.datosService.setMostrarIntro(false).then(() => {
            this.navCtrl.setRoot(EditarPreferenciasPage, { esRoot: true });
        });
    }
}
