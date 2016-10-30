// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

@Component({
  selector:'error-page',
  templateUrl: 'error.component.html',
})
export class ErrorPage {
  constructor(public nav: NavController) {}
}
