// Referencias de Angular
import { Component, ViewChild } from '@angular/core';

// Referencias de Ionic
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Paginas
import { ListaSolicitudesPage } from '../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { EditarPreferenciasPage } from '../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';
import { ErrorPage } from '../shared/components/error/error.component';

// Modelos
import { ItemMenuModel } from '../shared/models/item-menu.model';

// Servicios
import { LoginService } from '../shared/services/login.service';

@Component({
  templateUrl: 'app.html'
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  // Iniciamos la app mostrando el listado de solicitudes
  public rootPage: any = ListaSolicitudesPage;
  public paginasMenu: Array<ItemMenuModel> = [];

  public estaLogueado: boolean;

  constructor(public platform: Platform, 
              public menuCtrl: MenuController,
              public login: LoginService) {
    this.inicializarApp();
  }

  public inicializarApp() {
    this.platform.ready().then(() => {
      
      // En este punto los plugins ya estan cargados y listos
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.cargarOpcionesMenuPrincipal(); 

      // Muestra las opciones de login
      this.login.login();

    });
  }

  // Método que inicializa el menú principal
  public cargarOpcionesMenuPrincipal(): void {    
    this.paginasMenu.push(new ItemMenuModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true, false));
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', ErrorPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('person', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', ErrorPage, false, false));
  }

  // Método que abre la pagina pasada como parametro
  public abrirPagina(pagina: ItemMenuModel) {

    if(pagina.esRoot) {
      this.nav.popToRoot().then(() => {
        this.menuCtrl.close();
      });
    } else {
      this.nav.push(pagina.componente).then(() => {
        this.menuCtrl.close();
      });
    }
  }
}
