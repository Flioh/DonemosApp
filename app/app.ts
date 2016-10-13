// Referencias de Angular
import { Component, enableProdMode, provide, ViewChild } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Http } from '@angular/http';

// Referencias de Auth0
import { AuthConfig, AuthHttp } from 'angular2-jwt';

// Referencias de Ionic
import { AlertController, Events, ionicBootstrap, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

// Modelos
import { ItemMenuModel } from './shared/models/item-menu.model';
import { PreferenciasUsuarioModel } from './preferencias-usuario/preferencias-usuario.model';

// Servicios
import { ConectividadService } from './shared/services/conectividad.service';
import { LocalizacionService } from './shared/services/localizacion.service';
import { DatosService } from './shared/services/datos.service';
import { LoginService, PerfilUsuarioModel } from './shared/services/login.service';

// Paginas
import { ErrorPage } from './shared/error/error.component';
import { ListaSolicitudesPage } from './solicitudes/lista-solicitudes/lista-solicitudes.component';
import { EditarPreferenciasPage } from './preferencias-usuario/editar-preferencias/editar-preferencias.component';

// Objeto de configuracion
import { AppConfig } from './shared/app-config';

@Component({
  templateUrl: 'build/app.html',
  providers: [ConectividadService, 
              LocalizacionService, 
              DatosService, 
              AppConfig,
              provide(AuthHttp, { useFactory: (http) => {
                                    return new AuthHttp(new AuthConfig({noJwtError: true}), http);
                                  }, deps: [Http]
              }),
              LoginService]
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  public rootPage: any = ListaSolicitudesPage;
  public paginasMenu: Array<ItemMenuModel> = [];
  public perfilUsuario: any;

  constructor(private platform: Platform, 
              private alertCtrl: AlertController, 
              public events: Events, 
              private menuCtrl: MenuController, 
              private conectividadService : ConectividadService,
              private loginService: LoginService) {
    this.inicializarApp();
  }

  // Método que inicializa los servicios globales de la aplicacion
  public inicializarApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // When the app starts up, there might be a valid
      // token in local storage. If there is, we should
      // schedule an initial token refresh for when the
      // token expires
      this.loginService.startupTokenRefresh();

      this.inicializarEventosMenuPrincipal();

      this.cargarOpcionesMenuPrincipal(); 
      this.inicializarEventosConectividad();
    });
  }

  // Método que inicializa los eventos que modifican el menu principal
  private inicializarEventosMenuPrincipal() {
    
    this.events.subscribe('user:login', () => {
      this.habilitarMenuCorrespondiente(true);
    });

    this.events.subscribe('user:logout', () => {
      this.habilitarMenuCorrespondiente(false);
    });

    this.events.subscribe('page:load', () => {
      this.habilitarMenuCorrespondiente(this.loginService.authenticated());
    });
  }

  // Método que muestra/oculta el menu correspondiente
  private habilitarMenuCorrespondiente(estaLogueado: boolean) {
    // Cierra el menu
    this.menuCtrl.close();

    if(estaLogueado) {
      // Habilita el menu de usuarios logueados 
      this.menuCtrl.enable(true, 'authenticated');

      // Oculta las opciones para loguearse
      this.loginService.ocultarLogin();

    } else {
      // Habilita el menu para usuarios no logueados
      this.menuCtrl.enable(true, 'unauthenticated');

      // Muestra las opciones para loguearse
      this.loginService.mostrarLogin();
    }
    
  }

  // Método que abre la pagina pasada como parametro
  public abrirPagina(pagina: ItemMenuModel) {

    if(pagina.getEsRoot()) {
      this.nav.popToRoot().then(() => {
        this.menuCtrl.close();
      });
    } else {
      this.nav.push(pagina.getComponente()).then(() => {
        this.menuCtrl.close();
      });
    }
  }

  // Método que controla los eventos de conexion y desconexion a internet
  public inicializarEventosConectividad() {

  }

  // Método que inicializa el menú principal
  public cargarOpcionesMenuPrincipal(): void {    
    this.paginasMenu.push(new ItemMenuModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true, false));
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', ErrorPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('person', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', ErrorPage, false, false));
  }

  // Método que desloguea al usuario
  public logout(){
    this.loginService.logout()
  }

  // Método que devuelve la ruta de la imagen del perfil del usuario o una imagen genérica
  public getImagenPerfil() {

    let perfilUsuario = this.loginService.getUser();
    return perfilUsuario && perfilUsuario.picture ? perfilUsuario.picture : '/img/perfil-usuario.png';
  }

  // Método que devuelve el nombre del usuario logueado o un string vacio
  public getNombrePerfil() {

    let perfilUsuario = this.loginService.getUser();
    return perfilUsuario && perfilUsuario.name ? perfilUsuario.name : ''; 
  }
}

// Habilitamos el modo de produccion
enableProdMode();

// Bootstrapping
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


