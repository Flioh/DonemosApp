// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { ViewController, NavParams, Searchbar, Content } from 'ionic-angular';

@Component({
  selector:'dropdown-page',
  templateUrl: 'dropdown.component.html',
})
export class DropdownPage {
    @ViewChild('searchbar') searchbar: Searchbar;
    @ViewChild(Content) content: Content;

    public titulo: string;
    public listaOpciones: Array<any>;
    public opcionSeleccionada: any;

    constructor(private viewCtrl: ViewController,
                private paramsCtrl: NavParams) {
        this.titulo = this.paramsCtrl.get('titulo');
        this.listaOpciones = this.paramsCtrl.get('listaOpciones');
        this.opcionSeleccionada = null;
    }

    // Método que se ejecuta al cargar la vista
    public ionViewDidLoad() {
        setTimeout(() => {
            this.searchbar.setFocus();
        }, 100);
    }

    // Método que cierra el popup y devuelve la opcion seleccionada
    public volver():void {
        this.viewCtrl.dismiss(this.opcionSeleccionada);
    }

    // Método que vuelve a mostrar todas las opciones disponibles
    private inicializarOpciones(){
        this.listaOpciones = this.paramsCtrl.get('listaOpciones');
        this.opcionSeleccionada = null;
        this.content.resize();
    }

    // Método que selecciona una opcion y la devuelve al llamador
    public seleccionarOpcion(opcion: any){
        this.opcionSeleccionada = opcion;
        this.viewCtrl.dismiss(this.opcionSeleccionada);
    }

    // Metodo que solo muestra las opciones de acuerdo a lo ingresado en el campo de busqueda
    public filtrarOpciones(event: any) {
        this.inicializarOpciones();

        let textoIngresado = event.target.value;

        if (textoIngresado && textoIngresado.trim() != '') {
            this.listaOpciones = this.listaOpciones.filter((opcion) => {
                return (opcion.nombre.replace(" ", "").toLowerCase().indexOf(textoIngresado.replace(" ", "").toLowerCase()) > -1);
            })
        }
    }

    public identificarOpcion(index: number, opcion: any) { 
        return opcion.id; 
    }
}

