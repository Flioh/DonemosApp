import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, SqlStorage, Storage } from 'ionic-angular';

/* Directivas utilizadas */
import { SolicitudItem } from '../../directives/solicitud-item/solicitud-item';

/* Paginas utilizadas */
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { DatosPersonalesPage } from '../datos-personales/datos-personales';

/* Servicios utilizados */
import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';

/* Modelos utilizados */
import { SolicitudItemModel } from '../../providers/solicitud-item-model/solicitud-item-model';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { ProvinciaModel } from '../../providers/provincia-model/provincia-model';
import { CiudadModel } from '../../providers/ciudad-model/ciudad-model';
import { GrupoSanguineoModel } from "../../providers/grupo-sanguineo-model/grupo-sanguineo-model";
import { FactorSanguineoModel } from "../../providers/factor-sanguineo-model/factor-sanguineo-model";

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
  directives: [SolicitudItem]
})
export class ListaSolicitudesPage {

  private solicitudes: Array<SolicitudItemModel>;

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

  private tipoSanguineoUsuario: string;

  private hayMasSolicitudes: boolean;

  constructor(private nav: NavController, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, 
              private dataService: RemoteDataService) {    

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / constructor');
    }

    // Indica que las listas usadas en los filtros no estan cargadas aun
    this.listadosCargados = false;

    // Inicializa la lista de solicitudes
    this.solicitudes = [];

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

    // Cargamos las ultimas solicitudes
    this.buscarSolicitudes();

    if(this.dataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / constructor');
    }
  }

  // Método que obtiene las solicitudes del servidor
  public buscarSolicitudes(): void {

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / buscarSolicitudes');
    }

    // Mostramos las solicitudes
    this.seccion = 'solicitudes';

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    // Obtenemos las solicitudes del servidor
    this.dataService.getSolicitudes().subscribe((solicitudesObj) => { 
      for(let i = 0; i < solicitudesObj.length; i++) {
        let solicitud = new SolicitudModel(solicitudesObj[i]);
        let descripcionTiposSanguineos = this.obtenerInformacionTiposSanguineos(solicitud);

        // Creamos una instancia del modelo que posee tanto la solicitud como su encabezado
        this.solicitudes.push(new SolicitudItemModel(solicitud, descripcionTiposSanguineos));
      }

      // Oculta el mensaje de espera
      loadingPopup.dismiss();

      if(this.dataService.modoDebugActivado()) {
        console.timeEnd('ListaSolicitudesPage / buscarSolicitudes');
      }

    });  
  }

  ionViewDidEnter() {
    this.datosUsuarioObj = null;

    this.obtenerDatosUsuario();
  }

  // Inicializa los listados de la pagina
  public inicializarFiltros() {

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / inicializarFiltros');
    }

    if(!this.listadosCargados) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Cargando listados'
      });

      loadingPopup.present();

      // Inicializamos todos los listados
      this.listaFactoresSanguineos = this.dataService.getFactoresSanguineos();
      this.listaGruposSanguineos = this.dataService.getGruposSanguineos();
      this.dataService.getListaProvincias().subscribe(result => {
        if(result && result.length) {
          this.listaProvincias = result;
          
          // Evitamos cargar los datos cada vez que se muestran los filtros
          this.listadosCargados = true;

          // Ocultamos el mensaje de espera
          loadingPopup.dismiss();

          if(this.dataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / inicializarFiltros');
          }
        } 
      });
    }
  }

  // Resetea los filtros de busqueda
  public borrarFiltros() {

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / borrarFiltros');
    }

    this.provinciaSeleccionada = null;
    this.ciudadSeleccionada = null;
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.listaCiudades = null;
    this.usarDatosPersonales = false;

    if(this.dataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / borrarFiltros');
    }
  }

  // Inicializa los filtros de busqueda con los datos del usuario
  public usarDatosUsuario() {

    if(this.usarDatosPersonales) {

      if(this.dataService.modoDebugActivado()) {
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

        if(this.dataService.modoDebugActivado()) {
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

  // Método que obtiene los datos del usuario
  private obtenerDatosUsuario(): Promise<boolean> {

    return new Promise((resolve)=> {

      if(this.dataService.modoDebugActivado()) {
        console.time('ListaSolicitudesPage / obtenerDatosUsuario');
      }

      if(!this.storage) {
        this.storage = new Storage(SqlStorage);  
      }
      
      this.storage.get('datosUsuarioObj').then((datosUsuario) => {
        if(!datosUsuario) {

          if(this.dataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / obtenerDatosUsuario');
          }

          // No hay datos guardados, por lo que mostramos un mensaje al usuario
          resolve(false);
        } else {
          // Inicializamos los listados con la informacion del usuario
          this.datosUsuarioObj = JSON.parse(datosUsuario);
          this.tipoSanguineoUsuario = DonacionesHelper.getDescripcion(this.datosUsuarioObj.grupoSanguineoID, this.datosUsuarioObj.factorSanguineoID);

          if(this.dataService.modoDebugActivado()) {
            console.timeEnd('ListaSolicitudesPage / obtenerDatosUsuario');
          }

          resolve(true);          
        }
      });
    });
  }

  // Método que obtiene la informacion de los tipos sanguineos buscados, resaltando el del usuario
  public obtenerInformacionTiposSanguineos(unaSolicitud: SolicitudModel): string {

      if(this.dataService.modoDebugActivado()) {
        console.time('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');
      }

      let result = '';
      let posiblesDadores = DonacionesHelper.puedeRecibirDe(unaSolicitud.getGrupoSanguineo().getId(), 
                                                             unaSolicitud.getFactorSanguineo().getId());

      // Obtenems un string con todos los tipos sanguineos buscados
      result = posiblesDadores.join(' ');

      // Resaltamos el tipo sanguineo del usuario
      result = result.replace(this.tipoSanguineoUsuario, '<span class="marked">' + this.tipoSanguineoUsuario + '</span> ');

      if(this.dataService.modoDebugActivado()) {
        console.timeEnd('ListaSolicitudesPage / obtenerInformacionTiposSanguineos');
      }

      return result;
    }

  // Método que inicializa el formulario con los datos del usuario
  public inicializarDatosUsuario(): Promise<boolean> {
    return new Promise((resolve) => {

        if(this.dataService.modoDebugActivado()) {
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

          this.dataService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
            .subscribe(result => {
              if(result && result.length){

                  // Obtenemos el listado de ciudades
                  this.listaCiudades = result;

                  // Seleccionamos la ciudad del usuario
                  let indiceCiudad = this.getIndicePorID(this.listaCiudades, this.datosUsuarioObj.ciudadID);
                  this.ciudadSeleccionada = this.listaCiudades[indiceCiudad];

                  if(this.dataService.modoDebugActivado()) {
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

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / getIndicePorID');
    }

    for(let i=0; i<listado.length; i++) {
      if(id === listado[i].getId())
        return i;
    }

    if(this.dataService.modoDebugActivado()) {
      console.timeEnd('ListaSolicitudesPage / getIndicePorID');
    }

    return -1;
  }

  // Método que inicializa el listado de ciudades de una provincia
  public inicializarCiudadesDeLaProvincia(nombreCiudad: string): void {

    if(this.dataService.modoDebugActivado()) {
      console.time('ListaSolicitudesPage / inicializarCiudadesDeLaProvincia');
    }

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando ciudades'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    this.dataService.getListaCiudadesPorProvincia(this.provinciaSeleccionada.getId())
      .subscribe(result => {
        if(result && result.length){
          this.listaCiudades = result;

          // Oculta el mensaje de espera
          loadingPopup.dismiss();

          if(this.dataService.modoDebugActivado()) {
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
