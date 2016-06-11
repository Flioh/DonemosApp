import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NuevaSolicitudPage} from '../../pages/nueva-solicitud/nueva-solicitud';

@Component({
    selector: 'navbar',
    templateUrl: 'build/components/navbar/navbar.html',
    inputs: ['ocultarIconoNuevaSolicitud']
})
export class CustomNavbar {

	public ocultarIconoNuevaSolicitud: string;

    constructor(private nav: NavController) {
    }

    nuevaSolicitud(): void {
		this.nav.setRoot(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
    }
}