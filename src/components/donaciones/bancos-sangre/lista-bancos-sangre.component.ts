// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

@Component({
  selector:'lista-bancos-sangre-page',
  templateUrl: 'lista-bancos-sangre.component.html',
})
export class ListaBancosSangrePage {
  constructor(public nav: NavController) {}
}