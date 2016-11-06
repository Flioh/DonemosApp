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
  private mostrarNotificacionConexion: boolean;
  private mostrarNotificacionSinConexion: boolean;

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

      // Variables que usamos para no mostrar varios mensajes al cambiar el estado de la conexion
      this.mostrarNotificacionConexion = false;
      this.mostrarNotificacionSinConexion = true;
      
      this.inicializarEventosGlobalesConexion();
      this.inicializarEventosParticularesConexion();
      
      // Iniciamos los principales componentes de la app
      this.inicializarLogin();
      this.cargarOpcionesMenuPrincipal(); 

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

  // Método que inicializa los eventos de conexion y desconexion a internet particulares del menu principal
  public inicializarEventosParticularesConexion() {
    // El usuario ahora tiene conexion a internet
    this.eventCtrl.subscribe('conexion:conectado', () => {
      this.hayConexion = this.conectividadService.hayConexion();
      this.inicializarLogin();
      this.cargarOpcionesMenuPrincipal();
    });

    // El usuario no tiene conexion a internet
    this.eventCtrl.subscribe('conexion:desconectado', () => {
      this.hayConexion = this.conectividadService.hayConexion();
      this.cargarOpcionesMenuPrincipal();
    });
  }


  // Método que inicializa los eventos de conexion y desconexion a internet de toda la app
  public inicializarEventosGlobalesConexion() {

    // Chequeamos si hay conexion o no
    this.hayConexion = this.conectividadService.hayConexion();

    // Método que se ejecuta al conectarse a internet
    let onOnline = () => {
      setTimeout(() => {
        // Solo mostramos la notificacion de que volvio la conexion si se quedo sin conexion antes
        if(this.mostrarNotificacionConexion) {
          
          // Evitamos mostrar notificaciones duplicadas
          this.mostrarNotificacionConexion = false;

          // Si se corta la conexion, mostraremos la notificacion
          this.mostrarNotificacionSinConexion = true;

          // Mostramos el mensaje al usuario
          this.mostrarMensajeConConexion();
        }
      }, 2000);
    };

    // Método que se ejecuta al desconectarse a internet
    let onOffline = () => {
      if(this.mostrarNotificacionSinConexion) {
        // Si la conexion vuelve, mostramos un mensaje al usuario
        this.mostrarNotificacionConexion = true;

        // Evitamos mostrar notificaciones duplicadas
        this.mostrarNotificacionSinConexion = false;

        // Monstramos el mensaje al usuario
        this.mostrarMensajeSinConexion();
      }
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }

  // Método que muestra un mensaje cuando el usuario se queda sin conexion
  public mostrarMensajeSinConexion(){
    let toast = this.toastCtrl.create({
      message: 'No hay conexion a internet. Solo podrás acceder a contenido estático como los requisitos para donar o los bancos de sangre.',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      this.eventCtrl.publish('conexion:desconectado');
    });

    toast.present();
  }

  // Método que muestra un mensaje cuando el usuario se queda sin conexion
  public mostrarMensajeConConexion(){
    let toast = this.toastCtrl.create({
      message: 'Tienes conexión nuevamente. Ahora si podrás acceder a todo el contenido de la aplicación.',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      this.eventCtrl.publish('conexion:conectado');
    });

    toast.present();
  }

  // Método que inicializa las opciones de login y sus eventos
  public inicializarLogin(): void {

    if(this.hayConexion) {
      // Muestra las opciones de login
      this.loginService.inicializarLogin();
    }
    
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

    // Mostramos las opciones que correspondan
    this.cargarOpcionesMenuPrincipal()

    // Forzamos a Angular a que detecte los cambios en el menu
    this.changeDetectorCtrl.detectChanges();
  }

  // Método que inicializa el menú principal
  public cargarOpcionesMenuPrincipal(): void {    

    this.paginasMenu = [];

    this.paginasMenu.push(new ItemMenuModel('list-box', 'Lista de solicitudes', ListaSolicitudesPage, true, false));

    if(this.hayConexion && this.loginService.estaLogueado())
      this.paginasMenu.push(new ItemMenuModel('bookmarks', 'Mis solicitudes', MisSolicitudesPage, false, true));
    
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', RequisitosPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('settings', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    this.paginasMenu.push(new ItemMenuModel('bulb', 'Mostrar tutorial', IntroPage, false, false));
    
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', ErrorPage, false, false));
    
    if(this.hayConexion && this.loginService.estaLogueado())
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
