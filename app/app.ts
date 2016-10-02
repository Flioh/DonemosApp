import { MY_CONFIG, MY_CONFIG_TOKEN } from './app-config.ts';
import { DatosPersonalesPage } from './pages/datos-personales/datos-personales';
import { ErrorPage } from './pages/error/error';
import { ListaSolicitudesPage } from './pages/lista-solicitudes/lista-solicitudes';
import { AuthService } from './providers/auth-service/auth-service';
import { ConnectivityService } from './providers/connectivity-service/connectivity-service';
import { MenuItemModel } from './providers/menuitem-model/menuitem-model';
import { NavigationService } from './providers/navigation-service/navigation-service';
import { RemoteDataService } from './providers/remote-data-service/remote-data-service';
import { UserDataService } from './providers/user-data-service/user-data-service';
import { Component, enableProdMode, provide, ViewChild } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Http } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AlertController, Events, ionicBootstrap, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

@Component({
  templateUrl: 'build/app.html',
  providers: [ConnectivityService, 
              NavigationService, 
              UserDataService, 
              RemoteDataService, 
              { provide: MY_CONFIG_TOKEN, useValue: MY_CONFIG },
              provide(AuthHttp, {
                useFactory: (http) => {
                  return new AuthHttp(new AuthConfig({noJwtError: true}), http);
                }, deps: [Http]
              }),
              AuthService]
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  private userData: any;

  rootPage: any = ListaSolicitudesPage;
  paginasMenu: Array<MenuItemModel> = [];

  constructor(private platform: Platform, 
              private alertCtrl: AlertController, 
              public events: Events, 
              private menu: MenuController, 
              private connectivityService : ConnectivityService,
              private authService: AuthService) {
    this.inicializarApp();
  }

  inicializarApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // When the app starts up, there might be a valid
      // token in local storage. If there is, we should
      // schedule an initial token refresh for when the
      // token expires
      this.authService.startupTokenRefresh();

      this.cargarOpcionesMenuPrincipal(); 
      this.addConnectivityListeners();
    });
  }

  public abrirPagina(pagina: MenuItemModel) {

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

  addConnectivityListeners() {

  }

  cargarOpcionesMenuPrincipal(): void {    
    this.paginasMenu.push(new MenuItemModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true));
    this.paginasMenu.push(new MenuItemModel('checkbox', 'Requisitos para donar', ErrorPage, false));
    this.paginasMenu.push(new MenuItemModel('person', 'Configurar perfil', DatosPersonalesPage, false));
    this.paginasMenu.push(new MenuItemModel('information-circle', 'Sobre nosotros', ErrorPage, false));
  }
}

enableProdMode();

ionicBootstrap(DonemosApp, 
  [
    disableDeprecatedForms(), // disable deprecated forms
    provideForms() // enable new forms module
  ], 
  { 
    platforms: {
      ios: {
        statusbarPadding: true 
      }
  }});


