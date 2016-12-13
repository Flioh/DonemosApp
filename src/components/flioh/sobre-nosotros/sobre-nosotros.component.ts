// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

@Component({
  selector:'sobre-nosotros-page',
  templateUrl: 'sobre-nosotros.component.html',
})
export class SobreNosotrosPage {
  constructor(public nav: NavController) {}
}
