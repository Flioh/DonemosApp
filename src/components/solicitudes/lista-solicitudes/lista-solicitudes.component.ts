// Referencias de Angular
import { Component, NgZone } from '@angular/core';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Platform, MenuController, Events, ModalController } from 'ionic-angular';

// Servicios
import { DonacionesService } from '../../../shared/services/donaciones.service';
import { DatosService } from '../../../shared/services/datos.service';
import { ConectividadService } from '../../../shared/services/conectividad.service';
import { LoginService } from '../../../shared/services/login.service'

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { ResumenSolicitudModel } from '../resumen-solicitud.model';
import { LocalidadModel } from '../../../shared/models/localidad.model';
import { ProvinciaModel } from '../../../shared/models/provincia.model';

// Paginas y componente base
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud.component';
import { ListaBancosSangrePage } from '../../bancos-sangre/lista-bancos-sangre/lista-bancos-sangre.component';
import { DropdownPage } from '../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'lista-solicitudes-page',
  templateUrl: 'lista-solicitudes.component.html'
})
export class ListaSolicitudesPage {

  private solicitudes: Array<ResumenSolicitudModel>;

  // Filtros de busqueda
  private grupoSanguineoSeleccionado: number;
  private factorSanguineoSeleccionado: number;
  private provinciaSeleccionada: ProvinciaModel;
  private localidadSeleccionada: LocalidadModel;

  private listaGruposSanguineos: Array<{ id: number, nombre: string }>;
  private listaFactoresSanguineos: Array<{ id: number, nombre: string }>;
  private listaProvincias: Array<ProvinciaModel>;
  private listaLocalidades: Array<LocalidadModel>;

  // Id de la provincia cuyas localidades fueron cargadas. Esta propiedad se utiliza para evitar
  // volver a cargas localidades si ya fueron cargadas previamente
  private localidadesCargadasProvinciaId: string;

  public seccion: string = 'solicitudes';

  private usarDatosPersonales: boolean;
  private datosUsuarioObj: any;

  public mostrarOpcionCrearSolicitud: boolean;

  public isIos: boolean;

  private tipoSanguineoUsuario: string;

  private proximaPagina: number;
  public hayMasSolicitudes: boolean;
  public noHaySolicitudesMensaje: string = "";

  constructor(private platform: Platform,
    private nav: NavController, 
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private datosService: DatosService,
    private ngZoneCtrl: NgZone,
    private eventsCtrl: Events,
    private conectividadService: ConectividadService,
    private loginService: LoginService,
    private donacionesService: DonacionesService) 
  {    
    // Determinamos si es ios o no para ocultar/mostrar el boton flotante
    this.isIos = this.platform.is('ios');

    // Inicializamos eventos
    this.inicializarEventosConexion();
    this.inicializarEventosLogin();

    // Por defecto no usa los datos personales
    this.usarDatosPersonales = true;
    this.datosUsuarioObj = null;
    this.tipoSanguineoUsuario = '';

    this.hayMasSolicitudes = false;
    this.proximaPagina = 1;

    // Inicializa los filtros de busqueda
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.localidadSeleccionada = null;
    this.provinciaSeleccionada = null;
    this.localidadesCargadasProvinciaId = null;

    this.localidadesCargadasProvinciaId = null;

    // Cuando cambien los datos del usuario, refrescamos el listado de solicitudes para
    // resaltar el nuevo tipo sanguineo y no el anterior
    this.datosService.preferenciasUsuario.subscribe((preferenciasUsuario) => {

      // Actualizamos la informacion del usuario
      this.datosUsuarioObj = preferenciasUsuario;

      // Actualizamos la descripcion que se muestra en cada solicitud del listado
      this.actualizarDescripcionTiposSanguineos();
    });

    // Buscamos las preferencias del usuario y luego obtenemos el listado de solicitudes en base a dichas preferencias
    this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => {
      this.datosUsuarioObj = preferenciasUsuario;

      if(this.conectividadService.hayConexion()) {
        this.buscarSolicitudesUsandoPreferenciasUsuario();
      } else {
        this.mostrarErrorSinConexion();
      }
    });
  }

  // Método que inicializa los eventos relacionados al login
  public inicializarEventosLogin() {

    this.mostrarOpcionCrearSolicitud = this.loginService.estaLogueado() && this.conectividadService.hayConexion();    

    this.eventsCtrl.subscribe('login:usuario', () => {
      this.mostrarOpcionCrearSolicitud = this.loginService.estaLogueado() && this.conectividadService.hayConexion();    
    });

    this.eventsCtrl.subscribe('logout:usuario', () => {
      this.mostrarOpcionCrearSolicitud = this.loginService.estaLogueado() && this.conectividadService.hayConexion();    
    });
  }

  // Método que se ejecutan al haber cambios en el estado de la conexion
  public inicializarEventosConexion() {
    this.eventsCtrl.subscribe('conexion:conectado', () => {
      this.buscarSolicitudesUsandoPreferenciasUsuario();
      this.mostrarOpcionCrearSolicitud = this.loginService.estaLogueado() && this.conectividadService.hayConexion();    
    });

    this.eventsCtrl.subscribe('conexion:desconectado', () => {
      this.mostrarOpcionCrearSolicitud = this.loginService.estaLogueado() && this.conectividadService.hayConexion();    
    });
  }

  public realizarNuevaBusquedaSolicitudes() {

    // Inicializamos el listado de solicitudes
    this.solicitudes = [];

    // Reseteamos la proxima pagina para que sea nuevamente la primera
    this.hayMasSolicitudes = false;
    this.proximaPagina = 1;

    // Buscamos las solicitudes
    return this.buscarSolicitudes();
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {

    // Mostramos las solicitudes
    this.seccion = 'solicitudes';

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando solicitudes
    loadingPopup.present();

    // Obtenemos las solicitudes del servidor
    this.datosService.getSolicitudes(this.proximaPagina,
      this.provinciaSeleccionada  ? this.provinciaSeleccionada.id : null,
      this.localidadSeleccionada ? this.localidadSeleccionada.id : null,
      this.grupoSanguineoSeleccionado,
      this.factorSanguineoSeleccionado).subscribe((solicitudesObj) => {

        if(solicitudesObj.length) {
          for(let i = 0; i < solicitudesObj.length; i++) {
            let solicitud = new SolicitudModel(solicitudesObj[i]);
            let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);
            let esCompatible = this.esCompatibleConUsuario(solicitud);

            // Creamos una instancia del modelo que posee tanto la solicitud como su encabezado
            this.solicitudes.push(new ResumenSolicitudModel(solicitud, descripcionTiposSanguineos, esCompatible));
          }

          // Mostramos el boton para buscar mas solicitudes
          this.hayMasSolicitudes = true;
          this.proximaPagina++;
        } else {
          this.hayMasSolicitudes = false;

          if(this.proximaPagina === 1) {
            // Esta es la primera busqueda
            this.noHaySolicitudesMensaje = "Aún no hay solicitudes";
          } else {
            // Hubo busquedas anteriores
            this.noHaySolicitudesMensaje = "No hay más solicitudes";
          }
        }

        // Oculta el mensaje de espera
        loadingPopup.dismiss();
      });
    }

    // Metodo que actualiza la descripcion de los tipos sanguineos del listado de solicitudes
    public actualizarDescripcionTiposSanguineos():void {
      for(let i = 0; i < this.solicitudes.length; i++) {
        let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(this.solicitudes[i].solicitud);

        // Actualizamos la solicitud
        this.solicitudes[i].descripcionTiposSanguineos = descripcionTiposSanguineos;
        this.solicitudes[i].esCompatibleConUsuario = this.esCompatibleConUsuario(this.solicitudes[i].solicitud);
      }
    }

    // 
    public buscarSolicitudesUsandoPreferenciasUsuario(): void {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Buscando solicitudes'
      });

      // Mostramos el mensaje de espera
      loadingPopup.present();

      var datosNecesarios = [];

      // Variables que usamos para identificar los indices del resultado
      var seCarganProvincias = false;
      var seCarganLocalidades = false;

      if(!this.listaProvincias) {
        // Obtenemos el listado de provincias
        datosNecesarios.push(this.datosService.getListaProvincias().toPromise());
        seCarganProvincias = true;
      }

      if(this.datosUsuarioObj.provinciaID && (this.datosUsuarioObj.provinciaID !== this.localidadesCargadasProvinciaId || !this.listaLocalidades)) {
        // Si el usuario selecciono una provincia, cargamos sus localidades
        datosNecesarios.push(this.datosService.getListaLocalidadesPorProvincia(this.datosUsuarioObj.provinciaID).toPromise());

        // Actualizamos el Id de la provincia cuyas localidades fueron cargadas para evitar cargarlas nuevamente en el futuro
        this.localidadesCargadasProvinciaId = this.datosUsuarioObj.provinciaID;
        
        seCarganLocalidades = true;
      } 

      // Buscamos las solicitudes en base a las preferencias cargadas por el usuario
      datosNecesarios.push(this.datosService.getSolicitudes(this.proximaPagina, 
        this.datosUsuarioObj.provinciaID || null,
        this.datosUsuarioObj.localidadID || null,
        <number>this.datosUsuarioObj.grupoSanguineoID >= 0 ? this.datosUsuarioObj.grupoSanguineoID : null,
        <number>this.datosUsuarioObj.factorSanguineoID >= 0 ? this.datosUsuarioObj.factorSanguineoID : null).toPromise());

      Promise.all(datosNecesarios).then(
        (resultados) => {

          let listaProvincias = null;
          let listaLocalidades = null;
          let listaSolicitudes = null;

          // Identificamos a que corresponden los resultados
          if(!seCarganProvincias && !seCarganLocalidades) {
            listaSolicitudes = <Array<SolicitudModel>>resultados[0] || [];
          } else if(seCarganProvincias && !seCarganLocalidades) {
            listaProvincias = <Array<ProvinciaModel>>resultados[0];
            listaSolicitudes = <Array<SolicitudModel>>resultados[1] || [];
          } else if(!seCarganProvincias && seCarganLocalidades) {
            listaLocalidades = <Array<LocalidadModel>>resultados[0];
            listaSolicitudes = <Array<SolicitudModel>>resultados[1] || [];
          } else {
            listaProvincias = <Array<ProvinciaModel>>resultados[0];
            listaLocalidades = <Array<LocalidadModel>>resultados[1];
            listaSolicitudes = <Array<SolicitudModel>>resultados[2] || [];
          }

          // Inicializamos todos los listados
          this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();
          this.listaGruposSanguineos = this.datosService.getGruposSanguineos();

          this.listaProvincias = listaProvincias ? listaProvincias : this.listaProvincias;
          this.listaLocalidades = listaLocalidades ? listaLocalidades : this.listaLocalidades;          

          this.solicitudes = [];

          this.seccion='solicitudes';

          if(listaSolicitudes.length) {

            for(let i = 0; i < listaSolicitudes.length; i++) {
              let solicitud = new SolicitudModel(listaSolicitudes[i]);
              let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);
              let esCompatible = this.esCompatibleConUsuario(solicitud);

              // Creamos una instancia del modelo que posee tanto la solicitud como su encabezado
              this.solicitudes.push(new ResumenSolicitudModel(solicitud, descripcionTiposSanguineos, esCompatible));
            }

            // Mostramos el boton para buscar mas solicitudes
            this.hayMasSolicitudes = true;
            this.proximaPagina++;

          } else {
            this.hayMasSolicitudes = false;

            // Hubo busquedas anteriores
            this.noHaySolicitudesMensaje = "Aún no hay solicitudes";
          }

          // Tenemos todos los listados cargados, ahora seleecionamos las preferencias del usuario
          // en cada listado
          this.inicializarDatosUsuario();

          // Ocultamos el mensaje de espera
          loadingPopup.dismiss();

        }, 
        (error) => {
          // TODO: manejar error al obtener listados del servidor
        });
    }

    // Método que obtiene los listados necesarios y luego inicializa los filtros de busqueda con las preferencias del usuario
    public inicializarFiltrosUsandoPreferenciasUsuario(): void {
      var datosNecesarios = [];

      if(!this.listaProvincias) {
        // Obtenemos el listado de provincias si aun no estan cargadas
        datosNecesarios.push(this.datosService.getListaProvincias().toPromise());
      }

      if(this.datosUsuarioObj.provinciaID && (this.datosUsuarioObj.provinciaID !== this.localidadesCargadasProvinciaId || !this.listaLocalidades)) {
        // Si el usuario selecciono una provincia, cargamos sus localidades
        datosNecesarios.push(this.datosService.getListaLocalidadesPorProvincia(this.datosUsuarioObj.provinciaID).toPromise());

        // Actualizamos el Id de la provincia cuyas localidades fueron cargadas para evitar cargarlas nuevamente en el futuro
        this.localidadesCargadasProvinciaId = this.datosUsuarioObj.provinciaID;
      }

      // Inicializamos todos los listados
      this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();
      this.listaGruposSanguineos = this.datosService.getGruposSanguineos();

      // Si hay datos que debemos obtener del servidor
      if(datosNecesarios.length) {

        let loadingPopup = this.loadingCtrl.create({
          content: 'Inicializando filtros'
        });

        // Mostramos el mensaje de espera
        loadingPopup.present();

        Promise.all(datosNecesarios).then(
          (resultados) => {

            // Segun la cantidad de consultas incluidas en el arregle datosNecesarios, la lista de localidades puede
            // ser el primer o segundo elemento
            if(!this.listaProvincias) {
              this.listaProvincias = <Array<ProvinciaModel>>resultados[0];
              this.listaLocalidades = <Array<LocalidadModel>>resultados[1];
            } else {
              this.listaLocalidades = <Array<LocalidadModel>>resultados[0];
            }

            this.inicializarDatosUsuario();

            // Ocultamos el mensaje de espera
            loadingPopup.dismiss();

          }, 
          (error) => {
            // TODO: manejar error al obtener listados del servidor
          });
      } else {
        // Los listados estan cargados, por lo que simplemente los inicializamos con las preferencias del usuario
        this.inicializarDatosUsuario();
      }
    }

    // Método que se ejecuta al cambiar el estado del radio sobre usar preferencias personales como filtro o no
    public cambiarUsarPreferenciasUsuarioComoFiltro() {
      if(this.usarDatosPersonales) {        
        this.inicializarFiltrosUsandoPreferenciasUsuario();
      }
    }

    // Resetea los filtros de busqueda
    public borrarFiltros() {
      this.provinciaSeleccionada = null;
      this.localidadesCargadasProvinciaId = null;

      this.localidadSeleccionada = null;
      this.grupoSanguineoSeleccionado = null;
      this.factorSanguineoSeleccionado = null;
      this.listaLocalidades = null;
      this.usarDatosPersonales = false;
    }

    // Método que obtiene la informacion de los tipos sanguineos buscados, resaltando el del usuario
    public obtenerInformacionTiposSanguineos(unaSolicitud: SolicitudModel): string {
      let result = '', tiposSanguineosBuscados = [];

      for(let i=0; i<unaSolicitud.tiposSanguineos.length; i++) {
        let grupoSanguineo = unaSolicitud.tiposSanguineos[i].grupoSanguineo;
        let factorSanguineo = unaSolicitud.tiposSanguineos[i].factorSanguineo;
        tiposSanguineosBuscados.push(this.donacionesService.getDescripcionCompleta(grupoSanguineo, factorSanguineo));
      }

      // Obtenems un string con todos los tipos sanguineos buscados
      result = tiposSanguineosBuscados.join(' ');

      if(this.datosUsuarioObj) {
        // Obtenemos el tipo sanguineo del usuario
        this.tipoSanguineoUsuario = this.donacionesService.getDescripcionCompleta(this.datosUsuarioObj.grupoSanguineoID, this.datosUsuarioObj.factorSanguineoID);

        // Resaltamos el tipo sanguineo del usuario
        result = result.replace(' ' + this.tipoSanguineoUsuario + ' ', ' <span class="marked">' + this.tipoSanguineoUsuario + '</span> ');
      }
      return result;
    }

    // Método que determina si el usuario es compatible con una solicitud dada
    public esCompatibleConUsuario(unaSolicitud: SolicitudModel): boolean{
      if(this.datosUsuarioObj) {

        let tiposSanguineosBuscados = [];

        for(let i=0; i<unaSolicitud.tiposSanguineos.length; i++) {
          let grupoSanguineo = unaSolicitud.tiposSanguineos[i].grupoSanguineo;
          let factorSanguineo = unaSolicitud.tiposSanguineos[i].factorSanguineo;
          tiposSanguineosBuscados.push(this.donacionesService.getDescripcionCompleta(grupoSanguineo, factorSanguineo));
        }

        // Obtenemos el tipo sanguineo del usuario
        this.tipoSanguineoUsuario = this.donacionesService.getDescripcionCompleta(this.datosUsuarioObj.grupoSanguineoID, this.datosUsuarioObj.factorSanguineoID);

        return tiposSanguineosBuscados.join(' ').indexOf(this.tipoSanguineoUsuario) > -1;
      }
      return false;
    }

    // Método que setea los filtros con las preferencias del usuario
    public inicializarDatosUsuario(): void {
      if(<number>this.datosUsuarioObj.grupoSanguineoID >= 0) {
        // Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
        this.grupoSanguineoSeleccionado = this.datosUsuarioObj.grupoSanguineoID;
      }

      if(<number>this.datosUsuarioObj.factorSanguineoID >= 0) {
        // Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
        this.factorSanguineoSeleccionado = this.datosUsuarioObj.factorSanguineoID;
      }

      if(this.datosUsuarioObj.provinciaID) {
        // Obtenemos el indice de la provincia del usuario y la seleccionamos
        let indiceProvincia = this.getIndicePorID(this.listaProvincias, this.datosUsuarioObj.provinciaID);        
        this.provinciaSeleccionada = this.listaProvincias[indiceProvincia];
      } 
      if(this.datosUsuarioObj.localidadID) {
        // Obtenemos el indice de la localidad del usuario y la seleccionamos
        let indiceLocalidad = this.getIndicePorID(this.listaLocalidades, this.datosUsuarioObj.localidadID);
        this.localidadSeleccionada = this.listaLocalidades[indiceLocalidad];
      }
    }

    // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
    public getIndicePorID(listado: Array<any>, id: string): number {

      for(let i=0; i<listado.length; i++) {
        if(id === listado[i].id)
          return i;
      }

      return -1;
    }

    // Método que inicializa el listado de localidades de una provincia
    public inicializarLocalidadesDeLaProvincia(): void {

      this.localidadSeleccionada = null;

      let loadingPopup = this.loadingCtrl.create({
        content: 'Cargando localidades'
      });

      // Muestra el mensaje de cargando localidades
      loadingPopup.present();

      this.datosService.getListaLocalidadesPorProvincia(this.provinciaSeleccionada.id)
      .subscribe(result => {
        if(result && result.length){
          this.listaLocalidades = result;

          // Oculta el mensaje de espera
          loadingPopup.dismiss();
        }
        // TODO: manejar errores en las llamadas al servidor
        // -------------------------------------------------      
      });
    }

    // Método que muestra los detalles de la solicitud seleccionada
    public abrirDetalles(event) {
      this.nav.push(DetallesSolicitudPage, {
        // Obtenemos la solicitud del evento
        unaSolicitud: event.value
      }, { animate: true, direction: 'forward' });
    }

    // Método que lleva a la pantalla de creación de solicitudes
    public nuevaSolicitud(): void {
      this.nav.push(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
    }

    // Método que muestra el listado de bancos de sangre
    public mostrarListaBancosSangre() {
      this.nav.push(ListaBancosSangrePage);
    }

    // Método que muestra un listado de provincias
    public abrirModalProvincias() {
      // Creamos el componente
      let provinciaModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Provincia', listaOpciones: this.listaProvincias });

      provinciaModal.onDidDismiss(opcionSeleccionada => {

        if(opcionSeleccionada) {
          // Cambiamos el estado del toggle ya que los datos inicializados cambiaron
          this.usarDatosPersonales = false;

          // Si el usuario selecciono alguna de las opciones
          this.provinciaSeleccionada = opcionSeleccionada;
          this.localidadesCargadasProvinciaId = this.provinciaSeleccionada.id;
          this.inicializarLocalidadesDeLaProvincia();
        }
      });

      // Mostramos el modal
      provinciaModal.present();
    }

    // Método que muestra un listado de localidades
    public abrirModalLocalidades() {

      if(!this.provinciaSeleccionada) {
        // Si no hay ninguna provincia seleccionada, mostramos un error
        let popupAdvertencia = this.alertCtrl.create({
          title: 'Error',
          message: 'Debe seleccionar una provincia antes de seleccionar una localidad.',
          buttons: [
          {
            text: 'Ok',
            handler: () => {

            }
          }]
        });

        // Mostramos el popup
        popupAdvertencia.present();
        return;
      }

      // Creamos el componente
      let localidadesModal = this.modalCtrl.create(DropdownPage, { titulo: 'Seleccionar Localidad', listaOpciones: this.listaLocalidades });

      localidadesModal.onDidDismiss(opcionSeleccionada => {
        if(opcionSeleccionada) {
          // Cambiamos el estado del toggle ya que los datos inicializados cambiaron
          this.usarDatosPersonales = false;

          // Si el usuario selecciono alguna de las opciones
          this.localidadSeleccionada = opcionSeleccionada;
        }
      });

      // Mostramos el modal
      localidadesModal.present();
    }

    // Método que muestra un error al intentar inicializar la pagina sin tener conexion
    public mostrarErrorSinConexion() {
      let popupSinConexion = this.alertCtrl.create({
        title: 'Error',
        message: 'Se requiere acceso a internet para poder obtener las solicitudes. Comprueba tu conexión a internet y vuelve a intentarlo nuevamente.',
        buttons: [
        {
          text: 'Ok',
          handler: () => {}
        }]
      });

      // Mostramos el popup
      popupSinConexion.present();
    }

    // Método que actualiza el toggle mostrado en los filtros
    public filtrosModificados() {
      // Cambiamos el estado del toggle ya que los datos inicializados cambiaron
      this.usarDatosPersonales = false;
    }

  }
