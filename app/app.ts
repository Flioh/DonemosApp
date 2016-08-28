import { Component, ViewChild, provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// Nueva API de angular para forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

/* Servicios */
import { ConnectivityService } from './providers/connectivity-service/connectivity-service';
import { RemoteDataService } from './providers/remote-data-service/remote-data-service';

// Configuracion de la app
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from './app-config.ts';

// Paginas
import {ListaSolicitudesPage} from './pages/lista-solicitudes/lista-solicitudes';
import {NuevaSolicitudPage} from './pages/nueva-solicitud/nueva-solicitud';

// Modelos
import {MenuItemModel} from './providers/menuitem-model/menuitem-model';

@Component({
  templateUrl: 'build/app.html',
  providers: [ConnectivityService, RemoteDataService, { provide: MY_CONFIG_TOKEN, useValue: MY_CONFIG }]
})
export class DonemosApp {
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

  addConnectivityListeners() {

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
    platforms: {
      ios: {
        statusbarPadding: true 
      }
  }});


