// Referencias de Angular
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

// Referencias de Ionic
import { Content } from 'ionic-angular';

import { AppConfig } from '../app-config';

@Directive({ 
    selector: '[mapaEstatico]' 
})
export class MapaEstaticoDirective implements OnInit {
    @Input() coordenadas: string;
    @Input() direccion: string;
    @Input() content: Content;

    constructor(public element: ElementRef, public config: AppConfig) { }

    public ngOnInit() {

        // Obtenemos el tamanio del mapa en base al ancho del dispositivo
        let tamanio = this.content ? this.content.getDimensions().width : this.config.staticMapTamanio;

        // Usamos las coordenadas si estan disponibles, sino la direccion completa
        let ubicacionMarcador = this.coordenadas || this.direccion.replace(/ /g, '+');

        // Obtenemos la URL del mapa en base a la direccion
        this.element.nativeElement.src = `${ this.config.staticMapUrl }?zoom=${ this.config.staticMapZoom }&size=${ tamanio }x${ tamanio }&markers=color:red%7C${ ubicacionMarcador }&key=${ this.config.staticMapKey }`;
    }
}