// Referencias de Angular
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

// Referencias de Ionic
import { Events, MenuController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Paginas
import { ListaSolicitudesPage } from '../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { MisSolicitudesPage } from '../components/solicitudes/mis-solicitudes/mis-solicitudes.component';
import { ListaBancosSangrePage } from '../components/bancos-sangre/lista-bancos-sangre/lista-bancos-sangre.component';
import { EditarPreferenciasPage } from '../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';
import { RequisitosPage } from '../components/donaciones/requisitos/requisitos.component';
import { SobreNosotrosPage } from '../components/flioh/sobre-nosotros/sobre-nosotros.component';
import { TutorialPage } from '../shared/components/tutorial/tutorial.component';

// Modelos
import { ItemMenuModel } from '../shared/models/item-menu.model';

// Servicios
import { LoginService } from '../shared/services/login.service';
import { DatosService } from '../shared/services/datos.service';
import { ConectividadService } from '../shared/services/conectividad.service';

// Objeto de configuracion
import { AppConfig } from '../shared/app-config';

@Component({
  templateUrl: 'app.html'
})
export class DonemosApp {
  @ViewChild(Nav) nav: Nav;

  // Iniciamos la app mostrando el listado de solicitudes
  public rootPage: any;

  public paginasMenu: Array<ItemMenuModel> = [];

  // Variables usadas para determinar que mostrar en el menu principal de
  // acuerdo a la conexion del usuario y si esta logueado o no
  public ocultarLogin: boolean;
  public ocultarPerfil: boolean;
  public ocultarLogo: boolean;

  public hayConexion: boolean;
  private mostrarNotificacionConexion: boolean;
  private mostrarNotificacionSinConexion: boolean;

  public estaLogueado: boolean;

  constructor(public platform: Platform,
              public config: AppConfig,
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
      StatusBar.backgroundColorByName('black');
      Splashscreen.hide();

      // Anulamos el boton fisico para volver atras debido a varios issues de Ionic2
      this.platform.registerBackButtonAction(() => {
        return;
      });

      if(Bugsnag) {
        Bugsnag.apiKey = this.config.bugSnagApiKey;
      }

      // Evitamos que el menu se abra solo al presionar el botón y no deslizándolo
      this.menuCtrl.swipeEnable(false, 'principal');

      // Variables que usamos para no mostrar varios mensajes al cambiar el estado de la conexion
      this.mostrarNotificacionConexion = false;
      this.mostrarNotificacionSinConexion = true;
      
      // Cargamos la informacion del usuario primero
      this.loginService.cargarInformacionUsuario().then(() => {
        this.inicializarEventosGlobalesConexion();
        this.inicializarEventosParticularesConexion();
        this.inicializarEventosLogin();
        this.actualizarMenuPrincipal(); 
        this.cargarPantallaPrincipal();
      });
    });
  }

  // Método que carga la pantalla principal segun se deba mostrar la introduccion o no
  public cargarPantallaPrincipal() {
    this.datosService.getMostrarIntro().then(mostrarTutorial => {
      if(mostrarTutorial) {
        this.rootPage = TutorialPage;
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
      this.actualizarMenuPrincipal();
    });

    // El usuario no tiene conexion a internet
    this.eventCtrl.subscribe('conexion:desconectado', () => {
      this.hayConexion = this.conectividadService.hayConexion();
      this.actualizarMenuPrincipal();
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

  // Método que inicializa los eventos relacionados al login
  public inicializarEventosLogin() {

    this.estaLogueado = this.loginService.estaLogueado();    
    this.actualizarMenuPrincipal();

    this.eventCtrl.subscribe('login:usuario', () => {
      this.estaLogueado = this.loginService.estaLogueado();    
      this.actualizarMenuPrincipal();
    });

    this.eventCtrl.subscribe('logout:usuario', () => {
      this.estaLogueado = this.loginService.estaLogueado();
      this.actualizarMenuPrincipal();
    });
  }

  // Método que actualiza el menu principal segun si esta logueado o no el usuario
  private actualizarMenuPrincipal(): void {
    
    // Cerramos el menu
    this.menuCtrl.close();

    if(!this.hayConexion) {
      this.ocultarLogin = true;
      this.ocultarPerfil = true;
      this.ocultarLogo = false;
    } else if(this.estaLogueado) {
      this.ocultarLogin = true;
      this.ocultarPerfil = false;
      this.ocultarLogo = true;
    } else {
      this.ocultarLogin = false;
      this.ocultarPerfil = true;
      this.ocultarLogo = true;

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

    this.paginasMenu.push(new ItemMenuModel('heart', 'Bancos de Sangre', ListaBancosSangrePage, false, false));

    if(this.hayConexion && this.estaLogueado)
      this.paginasMenu.push(new ItemMenuModel('bookmarks', 'Mis solicitudes', MisSolicitudesPage, false, true));
    
    this.paginasMenu.push(new ItemMenuModel('checkbox', 'Requisitos para donar', RequisitosPage, false, false));
    
    if(this.hayConexion)
      this.paginasMenu.push(new ItemMenuModel('settings', 'Configurar preferencias', EditarPreferenciasPage, false, false));
    
    this.paginasMenu.push(new ItemMenuModel('bulb', 'Mostrar tutorial', TutorialPage, false, false));
    
    this.paginasMenu.push(new ItemMenuModel('information-circle', 'Sobre nosotros', SobreNosotrosPage, false, false));
    
    if(this.hayConexion && this.estaLogueado)
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
