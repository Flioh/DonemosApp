// Referencias de Angular
import { Directive, ElementRef, Input, EventEmitter, OnInit } from '@angular/core';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from './app-config';

@Directive({ 
    selector: '[mapaEstatico]' 
})
export class MapaEstaticoDirective implements OnInit {
    @Input() direccion: string;

    constructor(public element: ElementRef, public config: AppConfig) { }

    public ngOnInit() {
        // Obtenemos la URL del mapa en base a la direccion
        this.element.nativeElement.src = `${ this.config.staticMapUrl }?zoom=${ this.config.zoom }&size=${ this.config.largo }x${ this.config.alto }&markers=color:red%7C${ this.direccion.replace(/ /g, '+') }&key=${ this.config.staticMapKey }`;
    }
}