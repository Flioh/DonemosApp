import { Component, ViewChild, provide, PLATFORM_DIRECTIVES } from '@angular/core';
import { ionicBootstrap, App, Platform, AlertController, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// Nueva API de angular para forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

/* Servicios */
import { ConnectivityService } from './providers/connectivity-service/connectivity-service';
import { RemoteDataService } from './providers/remote-data-service/remote-data-service';

// Configuracion de la app
import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from './app-config.ts';

// Paginas
import { ListaSolicitudesPage } from './pages/lista-solicitudes/lista-solicitudes';
import { NuevaSolicitudPage } from './pages/nueva-solicitud/nueva-solicitud';

// Modelos
import { MenuItemModel } from './providers/menuitem-model/menuitem-model';

@Component({
  templateUrl: 'build/app.html',
  providers: [ConnectivityService, RemoteDataService, { provide: MY_CONFIG_TOKEN, useValue: MY_CONFIG }]
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListaSolicitudesPage;
  paginasMenu: Array<MenuItemModel> = [];

  constructor(private platform: Platform, private alertCtrl: AlertController, public events: Events, private menu: MenuController, private connectivityService : ConnectivityService) {
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

    if(pagina.getEsRoot()) {
      this.nav.popToRoot().then(() => {
        this.menu.close();
      });
    } else {
      this.nav.push(pagina.getComponente()).then(() => {
        this.menu.close();
      });
    }
  }

  login(servicio: string) {
    console.log(servicio);
  }

  addConnectivityListeners() {

  }

  cargarOpcionesMenuPrincipal(): void {    
    this.paginasMenu.push(new MenuItemModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true));
    this.paginasMenu.push(new MenuItemModel('checkbox', 'Requisitos para donar', ListaSolicitudesPage, false));
    this.paginasMenu.push(new MenuItemModel('person', 'Configurar perfil', ListaSolicitudesPage, false));
    this.paginasMenu.push(new MenuItemModel('settings', 'Configuración', ListaSolicitudesPage, false));
    this.paginasMenu.push(new MenuItemModel('log-out', 'Salir', ListaSolicitudesPage, false));
    this.paginasMenu.push(new MenuItemModel('information-circle', 'Sobre nosotros', ListaSolicitudesPage, false));
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


