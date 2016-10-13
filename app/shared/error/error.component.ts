// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'build/shared/error/error.html',
})
export class ErrorPage {
  constructor(public nav: NavController) {}
}
