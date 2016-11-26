// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { LoadingController, NavController, NavParams, Content } from 'ionic-angular';

// Servicios
import { LocalizacionService } from '../../../shared/services/localizacion.service';
import { DatosService } from '../../../shared/services/datos.service';

import { RequisitosPage } from '../../donaciones/requisitos/requisitos.component';

// Modelos
import { BancoSangreModel } from '../../bancos-sangre/banco-sangre.model';

@Component({
  selector: 'detalles-banco-sangre-page',
	templateUrl: 'detalles-banco-sangre.component.html'
})
export class DetallesBancoSangrePage {
  @ViewChild(Content) content: Content;

	// Variables de la clase
	public bancoSeleccionado: BancoSangreModel;
  public coordenadas: string;

	constructor(private navCtrl: NavController, 
              private navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private datosService: DatosService,
              private localizacionService: LocalizacionService) {
  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.bancoSeleccionado = navParams.get('bancoSangre');

      // Obtenemos las coordenadas del banco de sangre para que se muestre en el mapa
      this.coordenadas = `${ this.bancoSeleccionado.coordenadas.lat },${ this.bancoSeleccionado.coordenadas.lon }`;
  	}

    // Método que abre la aplicacion de GPS por defecto del usuario para guiarlo hacia la institucion
    public mostrarRuta():void {   

      // Invocamos al servicio usando la direccion y el nombre de la institucion 
      this.localizacionService.mostrarRutaHaciaCoordenadas(this.coordenadas, this.bancoSeleccionado.nombre);
    }

    // Método que muestra los requisitos para poder donar
    public verRequisitos() {
      this.navCtrl.push(RequisitosPage);
    }
  }