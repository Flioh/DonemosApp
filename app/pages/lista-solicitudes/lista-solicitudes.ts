import { ResumenSolicitud } from '../../directives/resumen-solicitud/resumen-solicitud';
import { CiudadModel } from '../../providers/ciudad-model/ciudad-model';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { FactorSanguineoModel } from '../../providers/factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../../providers/grupo-sanguineo-model/grupo-sanguineo-model';
import { ProvinciaModel } from '../../providers/provincia-model/provincia-model';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { ResumenSolicitudModel } from '../../providers/resumen-solicitud-model/resumen-solicitud-model';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { UserDataService } from '../../providers/user-data-service/user-data-service';
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, Storage, Platform, MenuController } from 'ionic-angular';
import { BasePage } from '../base/base';

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
  directives: [ ResumenSolicitud ]
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
              private userDataService: UserDataService,
              eventsCtrl: Events,
              remoteDataService: RemoteDataService) 
  {    

    // Inicializa la clase padre
    super(eventsCtrl, remoteDataService);

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / constructor');
    }    

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
    this.userDataService.datosUsuario.subscribe((datosUsuario) => {

      // Actualizamos la informacion del usuario
      this.datosUsuarioObj = datosUsuario;

      // Actualizamos la descripcion que se muestra en cada solicitud del listado
      this.actualizarDescripcionTiposSanguineos();
    });

    // Cargamos las ultimas solicitudes
    this.buscarSolicitudes();

    if(this.remoteDataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / constructor');
    }
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / buscarSolicitudes');
    }

    // Mostramos las solicitudes
    this.seccion = 'solicitudes';

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();


    this.userDataService.getDatosUsuario().then((datosUsuario) => {
        if(datosUsuario) {          
          // Inicializamos los listados con la informacion del usuario
          this.datosUsuarioObj = datosUsuario;
        }

        // Obtenemos las solicitudes del servidor
        this.remoteDataService.getSolicitudes().subscribe((solicitudesObj) => { 
          for(let i = 0; i < solicitudesObj.length; i++) {
            let solicitud = new SolicitudModel(solicitudesObj[i]);
            let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);

            // Creamos una instancia del modelo que posee tanto la solicitud como su encabezado
            this.solicitudes.push(new ResumenSolicitudModel(solicitud, descripcionTiposSanguineos));
          }

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          if(this.remoteDataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / buscarSolicitudes');
          }

        });
    });  
  }

  // Metodo que actualiza la descripcion de los tipos sanguineos del listado de solicitudes
  public actualizarDescripcionTiposSanguineos():void {
    for(let i = 0; i < this.solicitudes.length; i++) {
      let solicitud = this.solicitudes[i].getSolicitud();
      let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);

      // Actualizamos la solicitud
      this.solicitudes[i].setDescripcionTiposSanguineos(descripcionTiposSanguineos);
    }
  }

  // Inicializa los listados de la pagina
  public inicializarFiltros() {

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / inicializarFiltros');
    }

    if(!this.listadosCargados) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Cargando listados'
      });

      loadingPopup.present();

      // Inicializamos todos los listados
      this.listaFactoresSanguineos = this.remoteDataService.getFactoresSanguineos();
      this.listaGruposSanguineos = this.remoteDataService.getGruposSanguineos();
      this.remoteDataService.getListaProvincias().subscribe(result => {
        if(result && result.length) {
          this.listaProvincias = result;
          
          // Evitamos cargar los datos cada vez que se muestran los filtros
          this.listadosCargados = true;

          // Ocultamos el mensaje de espera
          loadingPopup.dismiss();

          if(this.remoteDataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / inicializarFiltros');
          }
        } 
      });
    }
  }

  // Resetea los filtros de busqueda
  public borrarFiltros() {

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / borrarFiltros');
    }

    this.provinciaSeleccionada = null;
    this.ciudadSeleccionada = null;
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.listaCiudades = null;
    this.usarDatosPersonales = false;

    if(this.remoteDataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / borrarFiltros');
    }
  }

  // Inicializa los filtros de busqueda con los datos del usuario
  public usarDatosUsuario() {

    if(this.usarDatosPersonales) {

      if(this.remoteDataService.modoDebugActivado()) {
        console.time('ListaSolicitudesPage / usarDatosUsuario');
      }

      let loadingPopup = this.loadingCtrl.create({
        content: 'Obteniendo datos'
      });

      loadingPopup.present();

      // Seteamos los datos del usuario en el formulario
      this.inicializarDatosUsuario().then(() => {

        // Ocultamos el mensaje de espera
        loadingPopup.dismiss();

        if(this.remoteDataService.modoDebugActivado()) {
          console.timeEnd('ListaSolicitudesPage / usarDatosUsuario');
        }

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

      if(this.remoteDataService.modoDebugActivado()) {
        console.time('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');
      }

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

      if(this.remoteDataService.modoDebugActivado()) {
        console.timeEnd('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');
      }

      return result;
  }

  // Método que inicializa el formulario con los datos del usuario
  public inicializarDatosUsuario(): Promise<boolean> {
    return new Promise((resolve) => {

        if(this.remoteDataService.modoDebugActivado()) {
          console.time('ListaSolicitudesPage / inicializarDatosUsuario');
        }

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

          this.remoteDataService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
            .subscribe(result => {
              if(result && result.length){

                  // Obtenemos el listado de ciudades
                  this.listaCiudades = result;

                  // Seleccionamos la ciudad del usuario
                  let indiceCiudad = this.getIndicePorID(this.listaCiudades, this.datosUsuarioObj.ciudadID);
                  this.ciudadSeleccionada = this.listaCiudades[indiceCiudad];

                  if(this.remoteDataService.modoDebugActivado()) {
                    console.timeEnd('ListaSolicitudesPage / inicializarDatosUsuario');
                  } 

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

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / getIndicePorID');
    }

    for(let i=0; i<listado.length; i++) {
      if(id === listado[i].getId())
        return i;
    }

    if(this.remoteDataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / getIndicePorID');
    }

    return -1;
  }

  // Método que inicializa el listado de ciudades de una provincia
  public inicializarCiudadesDeLaProvincia(nombreCiudad: string): void {

    if(this.remoteDataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / inicializarCiudadesDeLaProvincia');
    }

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando ciudades'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    this.remoteDataService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
      .subscribe(result => {
        if(result && result.length){
          this.listaCiudades = result;

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          if(this.remoteDataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / inicializarCiudadesDeLaProvincia');
          }
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
