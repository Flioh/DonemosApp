// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

@Component({
  selector:'requisitos-page',
  templateUrl: 'requisitos.component.html',
})
export class RequisitosPage {

	public seccion: string;

  	constructor(public nav: NavController) {
  		this.seccion = "requisitos";
  	}
}
