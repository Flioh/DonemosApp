import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, App, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ListaSolicitudesPage} from './pages/lista-solicitudes/lista-solicitudes';
import {MenuItemModel} from './providers/menuitem-model/menuitem-model';

@Component({
  templateUrl: 'build/app.html',
})
class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListaSolicitudesPage;
  paginasMenu: Array<MenuItemModel>;

  constructor(private platform: Platform, private menu: MenuController) {
    this.initializeApp();

    this.paginasMenu = [];
    this.cargarOpcionesMenuPrincipal();  
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  abrirPagina(pagina: MenuItemModel) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    // navigate to the new page if it is not the current page
    this.nav.setRoot(pagina.getComponente());
  }

  login(servicio: string) {
    console.log(servicio);
  }

  cargarOpcionesMenuPrincipal(): void {
    this.paginasMenu.push(new MenuItemModel('add', 'Nueva solicitud', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('checkbox', 'Requisitos para donar', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('person', 'Configurar perfil', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('settings', 'Configuración', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('log-out', 'Salir', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('information-circle', 'Sobre nosotros', ListaSolicitudesPage));
  }
}

// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/
ionicBootstrap(DonemosApp, [], {
  //statusbarPadding: true
});