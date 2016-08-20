import { Component, ViewChild, provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// New angular2 forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

/* Servicios */
import { ConnectivityService } from './providers/connectivity-service/connectivity-service';
import { DataService } from './providers/data-service/data-service';

/* Paginas de la app */
import {ListaSolicitudesPage} from './pages/lista-solicitudes/lista-solicitudes';
import {NuevaSolicitudPage} from './pages/nueva-solicitud/nueva-solicitud';

/* Models */
import {MenuItemModel} from './providers/menuitem-model/menuitem-model';

@Component({
  templateUrl: 'build/app.html',
  providers: [ConnectivityService, DataService]
})
class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListaSolicitudesPage;
  paginasMenu: Array<MenuItemModel> = [];

  constructor(private platform: Platform, private menu: MenuController, private connectivityService : ConnectivityService) {
    this.inicializarApp();     
  }

  inicializarApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.cargarOpcionesMenuPrincipal(); 
      this.addConnectivityListeners();
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

  addConnectivityListeners(){
    document.addEventListener('online', () => {
      setTimeout(() => {
        console.log('Conectado');
      }, 2000);
    }, false);

    document.addEventListener('offline', () => {
      console.log('Sin conexion');
    }, false);
  }

  cargarOpcionesMenuPrincipal(): void {
    this.paginasMenu.push(new MenuItemModel('add', 'Nueva solicitud', NuevaSolicitudPage));
    this.paginasMenu.push(new MenuItemModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('checkbox', 'Requisitos para donar', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('person', 'Configurar perfil', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('settings', 'Configuración', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('log-out', 'Salir', ListaSolicitudesPage));
    this.paginasMenu.push(new MenuItemModel('information-circle', 'Sobre nosotros', ListaSolicitudesPage));
  }
}

ionicBootstrap(DonemosApp, 
  [
    disableDeprecatedForms(), // disable deprecated forms
    provideForms() // enable new forms module]
  ], 
  { 
    statusbarPadding: true 
  });


