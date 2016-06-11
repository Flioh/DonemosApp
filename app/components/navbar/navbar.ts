import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NuevaSolicitudPage} from '../../pages/nueva-solicitud/nueva-solicitud';

@Component({
    selector: 'navbar',
    templateUrl: 'build/components/navbar/navbar.html'
})
export class CustomNavbar {
    constructor(private nav: NavController) {
    }

    nuevaSolicitud(): void {
		this.nav.setRoot(NuevaSolicitudPage);
    }
}