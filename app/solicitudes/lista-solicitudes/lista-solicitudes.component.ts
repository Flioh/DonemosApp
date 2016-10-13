// Referencias de Angular
import { Component } from '@angular/core';

// Referencias de Ionic
import { AlertController, LoadingController, NavController, Events, Storage, Platform, MenuController } from 'ionic-angular';

// Servicios
import { DonacionesHelper } from '../../shared/services/donaciones.service';
import { DatosService } from '../../shared/services/datos.service';
import { LoginService, PerfilUsuarioModel } from '../../shared/services/login.service';

// Directivas
import { ResumenSolicitudDirective } from '../../solicitudes/resumen-solicitud.directive';

// Modelos
import { SolicitudModel } from '../solicitud.model';
import { ResumenSolicitudModel } from '../resumen-solicitud.model';
import { CiudadModel } from '../../shared/models/ciudad.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';

// Paginas y componente base
import { BasePage } from '../../shared/base/base.component';
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud.component';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

@Component({
  templateUrl: 'build/solicitudes/lista-solicitudes/lista-solicitudes.component.html',
  directives: [ ResumenSolicitudDirective ]
})
export class ListaSolicitudesPage extends BasePage {

  private solicitudes: Array<ResumenSolicitudModel>;

  // Filtros de busqueda
  private grupoSanguineoSeleccionado: GrupoSanguineoModel;
  private factorSanguineoSeleccionado: FactorSanguineoModel;
  private provinciaSeleccionada: ProvinciaModel;
  private ciudadSeleccionada: CiudadModel;

  private listaGruposSanguineos: Array<GrupoSanguineoModel>;
  private listaFactoresSanguineos: Array<FactorSanguineoModel>;
  private listaProvincias: Array<ProvinciaModel>;
  private listaCiudades: Array<CiudadModel>;

  private listadosCargados: boolean;

  private seccion: string = 'solicitudes';

  private storage: Storage;
  private usarDatosPersonales: boolean;
  private datosUsuarioObj: any;

  private isIos: boolean;

  private tipoSanguineoUsuario: string;

  private hayMasSolicitudes: boolean;

  constructor(private platform: Platform,
              private nav: NavController, 
              private menuCtrl: MenuController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,               
              private datosService: DatosService,
              private loginService: LoginService,
              eventsCtrl: Events,
              config: AppConfig) 
  {    

    // Inicializa la clase padre manualmente debido a un issue de angular
    // https://github.com/angular/angular/issues/5155
    super(eventsCtrl, config);

    this.iniciarTimer('ListaSolicitudesPage / constructor');

    // Indica que las listas usadas en los filtros no estan cargadas aun
    this.listadosCargados = false;

    // Inicializa la lista de solicitudes
    this.solicitudes = [];

    this.isIos = this.platform.is('ios');

    // Por defecto no usa los datos personales
    this.usarDatosPersonales = false;
    this.datosUsuarioObj = null;
    this.tipoSanguineoUsuario = '';

    this.hayMasSolicitudes = false;

    // Inicializa los filtros de busqueda
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.ciudadSeleccionada = null;
    this.provinciaSeleccionada = null;

    // Cuando cambien los datos del usuario, refrescamos el listado de solicitudes para
    // resaltar el nuevo tipo sanguineo y no el anterior
    this.datosService.preferenciasUsuario.subscribe((preferenciasUsuario) => {

      // Actualizamos la informacion del usuario
      this.datosUsuarioObj = preferenciasUsuario;

      // Actualizamos la descripcion que se muestra en cada solicitud del listado
      this.actualizarDescripcionTiposSanguineos();
    });

    // Cargamos las ultimas solicitudes
    this.buscarSolicitudes();

    this.detenerTimer('ListaSolicitudesPage / constructor');
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {

    this.iniciarTimer('ListaSolicitudesPage / buscarSolicitudes');

    // Mostramos las solicitudes
    this.seccion = 'solicitudes';

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();


    this.datosService.getPreferenciasUsuario().then((preferenciasUsuario) => {
        if(preferenciasUsuario) {          
          // Inicializamos los listados con la informacion del usuario
          this.datosUsuarioObj = preferenciasUsuario;
        }

        // Obtenemos las solicitudes del servidor
        this.datosService.getSolicitudes().subscribe((solicitudesObj) => { 
          for(let i = 0; i < solicitudesObj.length; i++) {
            let solicitud = new SolicitudModel(solicitudesObj[i]);
            let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);

            // Creamos una instancia del modelo que posee tanto la solicitud como su encabezado
            this.solicitudes.push(new ResumenSolicitudModel(solicitud, descripcionTiposSanguineos));
          }

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          this.detenerTimer('ListaSolicitudesPage / buscarSolicitudes');
        });
    });  
  }

  // Metodo que actualiza la descripcion de los tipos sanguineos del listado de solicitudes
  public actualizarDescripcionTiposSanguineos():void {

    this.iniciarTimer('ListaSolicitudesPage / actualizarDescripcionTiposSanguineos');

    for(let i = 0; i < this.solicitudes.length; i++) {
      let solicitud = this.solicitudes[i].getSolicitud();
      let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);

      // Actualizamos la solicitud
      this.solicitudes[i].setDescripcionTiposSanguineos(descripcionTiposSanguineos);
    }

    this.detenerTimer('ListaSolicitudesPage / actualizarDescripcionTiposSanguineos');
  }

  // Inicializa los listados de la pagina
  public inicializarFiltros() {

    this.iniciarTimer('ListaSolicitudesPage / inicializarFiltros');

    if(!this.listadosCargados) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Cargando listados'
      });

      loadingPopup.present();

      // Inicializamos todos los listados
      this.listaFactoresSanguineos = this.datosService.getFactoresSanguineos();
      this.listaGruposSanguineos = this.datosService.getGruposSanguineos();
      this.datosService.getListaProvincias().subscribe(result => {
        if(result && result.length) {
          this.listaProvincias = result;
          
          // Evitamos cargar los datos cada vez que se muestran los filtros
          this.listadosCargados = true;

          // Ocultamos el mensaje de espera
          loadingPopup.dismiss();

          this.detenerTimer('ListaSolicitudesPage / inicializarFiltros');
        } 
      });
    }
  }

  // Resetea los filtros de busqueda
  public borrarFiltros() {

    this.iniciarTimer('ListaSolicitudesPage / borrarFiltros');

    this.provinciaSeleccionada = null;
    this.ciudadSeleccionada = null;
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.listaCiudades = null;
    this.usarDatosPersonales = false;

    this.detenerTimer('ListaSolicitudesPage / borrarFiltros');
  }

  // Inicializa los filtros de busqueda con los datos del usuario
  public usarDatosUsuario() {

    if(this.usarDatosPersonales) {

      this.iniciarTimer('ListaSolicitudesPage / usarDatosUsuario');

      let loadingPopup = this.loadingCtrl.create({
        content: 'Obteniendo datos'
      });

      loadingPopup.present();

      // Seteamos los datos del usuario en el formulario
      this.inicializarDatosUsuario().then(() => {

        // Ocultamos el mensaje de espera
        loadingPopup.dismiss();

        this.detenerTimer('ListaSolicitudesPage / usarDatosUsuario');
      }); 

    } else {
      // Limpiamos el formulario
      this.listaCiudades = null;
      this.provinciaSeleccionada = null;
      this.ciudadSeleccionada = null;
      this.grupoSanguineoSeleccionado = null;
      this.factorSanguineoSeleccionado = null;
    }
  }

  // Método que obtiene la informacion de los tipos sanguineos buscados, resaltando el del usuario
  public obtenerInformacionTiposSanguineos(unaSolicitud: SolicitudModel): string {

      this.iniciarTimer('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');

      let result = '';
      let posiblesDadores = DonacionesHelper.puedeRecibirDe(unaSolicitud.getGrupoSanguineo().getId(), 
                                                             unaSolicitud.getFactorSanguineo().getId());

      // Obtenems un string con todos los tipos sanguineos buscados
      result = posiblesDadores.join(' ');

      if(this.datosUsuarioObj) {
        // Obtenemos el tipo sanguineo del usuario
        this.tipoSanguineoUsuario = DonacionesHelper.getDescripcion(this.datosUsuarioObj.grupoSanguineoID, this.datosUsuarioObj.factorSanguineoID);

        // Resaltamos el tipo sanguineo del usuario
        result = result.replace(this.tipoSanguineoUsuario, '<span class="marked">' + this.tipoSanguineoUsuario + '</span> ');
      }

      this.detenerTimer('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');

      return result;
  }

  // Método que inicializa el formulario con los datos del usuario
  public inicializarDatosUsuario(): Promise<boolean> {
    return new Promise((resolve) => {

        this.iniciarTimer('ListaSolicitudesPage / inicializarDatosUsuario');

        // Obtenemos el indice de la provincia del usuario y la seleccionamos
        let indiceProvincia = this.getIndicePorID(this.listaProvincias, this.datosUsuarioObj.provinciaID);        
        this.provinciaSeleccionada = this.listaProvincias[indiceProvincia];

        // Obtenemos el indice del grupo sanguineo del usuario y lo seleccionamos
        let indiceGrupoSanguineo = this.getIndicePorID(this.listaGruposSanguineos, this.datosUsuarioObj.grupoSanguineoID);
        this.grupoSanguineoSeleccionado = this.listaGruposSanguineos[indiceGrupoSanguineo];

        // Obtenemos el indice del factor sanguineo del usuario y lo seleccionamos
        let indiceFactorSanguineo = this.getIndicePorID(this.listaFactoresSanguineos, this.datosUsuarioObj.factorSanguineoID);
        this.factorSanguineoSeleccionado = this.listaFactoresSanguineos[indiceFactorSanguineo];

        if(this.provinciaSeleccionada) {

          this.datosService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
            .subscribe(result => {
              if(result && result.length){

                  // Obtenemos el listado de ciudades
                  this.listaCiudades = result;

                  // Seleccionamos la ciudad del usuario
                  let indiceCiudad = this.getIndicePorID(this.listaCiudades, this.datosUsuarioObj.ciudadID);
                  this.ciudadSeleccionada = this.listaCiudades[indiceCiudad];

                  this.detenerTimer('ListaSolicitudesPage / inicializarDatosUsuario');

                  // Resolvemos la promesa
                  resolve(true);
                }
                  // TODO: manejar errores en las llamadas al servidor
                  // -------------------------------------------------      
                });
        }
      });
  }

  // Método que obtiene el indice del elemento cuyo id es el pasado como parametro
  public getIndicePorID(listado: Array<any>, id: number): number {

    this.iniciarTimer('ListaSolicitudesPage / getIndicePorID');

    for(let i=0; i<listado.length; i++) {
      if(id === listado[i].getId())
        return i;
    }

    this.detenerTimer('ListaSolicitudesPage / getIndicePorID');

    return -1;
  }

  // Método que inicializa el listado de ciudades de una provincia
  public inicializarCiudadesDeLaProvincia(nombreCiudad: string): void {

    this.iniciarTimer('ListaSolicitudesPage / inicializarCiudadesDeLaProvincia');

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando ciudades'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    this.datosService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
      .subscribe(result => {
        if(result && result.length){
          this.listaCiudades = result;

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          this.detenerTimer('ListaSolicitudesPage / inicializarCiudadesDeLaProvincia');
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

}
