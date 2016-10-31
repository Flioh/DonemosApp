// Referencias de Angular
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

// Referencias de Ionic
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
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
              public loginService: LoginService,
              public eventCtrl: Events,
              public changeDetectorCtrl: ChangeDetectorRef) {
    this.inicializarApp();
  }

  public inicializarApp() {
    this.platform.ready().then(() => {
      
      // En este punto los plugins ya estan cargados y listos
      StatusBar.styleDefault();
      Splashscreen.hide();

      // Iniciamos los principales componentes de la app
      this.cargarOpcionesMenuPrincipal(); 
      this.inicializarLogin();
    });
  }

  // Método que inicializa las opciones de login y sus eventos
  public inicializarLogin(): void {
    // Muestra las opciones de login
    this.loginService.inicializarLogin();

    this.eventCtrl.subscribe('login:usuario', () => {      
      this.actualizarMenuPrincipal(true);
    });

    this.eventCtrl.subscribe('logout:usuario', () => {
      this.actualizarMenuPrincipal(false);
    });
  }

  // Método que actualiza el menu principal segun si esta logueado o no el usuario
  private actualizarMenuPrincipal(estaLogueado: boolean): void {
    
    // Cerramos el menu
    this.menuCtrl.close();

    if(!estaLogueado) {
      // Muestra nuevamente las opciones del login
      this.loginService.inicializarLogin();
    }

    // Forzamos a Angular a que detecte los cambios en el menu
    this.changeDetectorCtrl.detectChanges();
  }

  // Método que inicializa el menú principal
  public cargarOpcionesMenuPrincipal(): void {    
    this.paginasMenu.push(new ItemMenuModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true, false));
    this.paginasMenu.push(new ItemMenuModel('bookmarks', 'Mis solicitudes', ErrorPage, false, true));
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', ErrorPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('settings', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('exit', 'Salir', null, false, true));
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', ErrorPage, false, false));
  }

  // Método que abre la pagina pasada como parametro
  public abrirPagina(pagina: ItemMenuModel) {

    this.menuCtrl.close();

    if(!pagina.componente) {
      this.loginService.logout();
    } else {
      if(pagina.esRoot) {
        this.nav.setRoot(pagina.componente);
      } else {
        this.nav.push(pagina.componente);
      }
    }
  }
}
