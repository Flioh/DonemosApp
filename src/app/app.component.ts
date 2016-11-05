import { RequisitosPage } from '../components/donaciones/requisitos/requisitos.component';
// Referencias de Angular
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

// Referencias de Ionic
import { Events, MenuController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Paginas
import { ListaSolicitudesPage } from '../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { MisSolicitudesPage } from '../components/solicitudes/mis-solicitudes/mis-solicitudes.component';
import { EditarPreferenciasPage } from '../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';
import { ErrorPage } from '../shared/components/error/error.component';
import { IntroPage } from '../shared/components/intro/intro.component';

// Modelos
import { ItemMenuModel } from '../shared/models/item-menu.model';

// Servicios
import { LoginService } from '../shared/services/login.service';
import { DatosService } from '../shared/services/datos.service';
import { ConectividadService } from '../shared/services/conectividad.service';

@Component({
  templateUrl: 'app.html'
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  // Iniciamos la app mostrando el listado de solicitudes
  public rootPage: any;

  public paginasMenu: Array<ItemMenuModel> = [];

  public estaLogueado: boolean;

  public hayConexion: boolean;

  constructor(public platform: Platform, 
              public menuCtrl: MenuController,
              public loginService: LoginService,
              public datosService: DatosService,
              public conectividadService: ConectividadService,
              public eventCtrl: Events,
              private toastCtrl: ToastController,
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
      this.inicializarEventosConexion();
      this.cargarPantallaPrincipal();
    });
  }

  // Método que carga la pantalla principal segun se deba mostrar la introduccion o no
  public cargarPantallaPrincipal() {
    this.datosService.getMostrarIntro().then(mostrarIntro => {
      if(mostrarIntro) {
        this.rootPage = IntroPage;
      } else {
        this.rootPage = ListaSolicitudesPage;
      }
    })
  }

  // Método que inicializa los eventos de conexion y desconexion a internet
  public inicializarEventosConexion() {

    // Chequeamos si hay conexion o no
    this.hayConexion = this.conectividadService.hayConexion();

    // Método que se ejecuta al conectarse a internet
    let onOnline = () => {
 
      setTimeout(() => {
        this.conectividadService.actualizarEstadoConexion(true);
      }, 2000);
 
    };

    // Método que se ejecuta al desconectarse a internet
    let onOffline = () => {
      this.conectividadService.actualizarEstadoConexion(false);
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
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
    this.paginasMenu.push(new ItemMenuModel('bookmarks', 'Mis solicitudes', MisSolicitudesPage, false, true));
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', RequisitosPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('settings', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('bulb', 'Mostrar tutorial', IntroPage, false, false));
    
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', ErrorPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('exit', 'Salir', null, false, true));
  }

  // Método que abre la pagina pasada como parametro
  public abrirPagina(pagina: ItemMenuModel) {

    this.menuCtrl.close();

    if(!pagina.componente) {
      // Si no tiene un componente, entonces es la opcion de logout
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
