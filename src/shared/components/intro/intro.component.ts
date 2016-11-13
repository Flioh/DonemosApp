// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController, AlertController } from 'ionic-angular';

// Paginas
import { ListaSolicitudesPage } from '../../../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { EditarPreferenciasPage } from '../../../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';

// Servicios
import { DatosService } from '../../services/datos.service';

@Component({
  selector:'intro-page',
  templateUrl: 'intro.component.html',
})
export class IntroPage {

    public opcionesSlider: any;

    constructor(public navCtrl: NavController,
                public datosService: DatosService,
                private alertCtrl: AlertController) {
        this.opcionesSlider = {
            pager: true
        };
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

    // Método que muestra la pantalla de preferencias
    public inicializarPreferencias() {
        this.datosService.setMostrarIntro(false).then(() => {
            this.navCtrl.setRoot(EditarPreferenciasPage, { esRoot: true });
        });
    }
}
