// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

// Paginas
import { ListaSolicitudesPage } from '../../../components/solicitudes/lista-solicitudes/lista-solicitudes.component';

// Servicios
import { DatosService } from '../../services/datos.service';

@Component({
  selector:'intro-page',
  templateUrl: 'intro.component.html',
})
export class IntroPage {

    public opcionesSlider: any;

    constructor(public navCtrl: NavController,
                public datosService: DatosService) {
        this.opcionesSlider = {
            pager: true
        };
    }

    // Método que muestra el listado de solicitudes
    public verListaSolicitudes() {
        this.datosService.setMostrarIntro(false).then(() => {
            this.navCtrl.setRoot(ListaSolicitudesPage);
        });
    }
}
