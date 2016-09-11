import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, SqlStorage, Storage } from 'ionic-angular';

/* Paginas utilizadas */
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { DatosPersonalesPage } from '../datos-personales/datos-personales';

/* Servicios utilizados */
import { AutocompleteService } from '../../providers/autocomplete-service/autocomplete-service';
import { ConnectivityService } from '../../providers/connectivity-service/connectivity-service';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/donemos-helper-service/donemos-helper-service';

/* Modelos utilizados */
import { SolicitudItem } from '../../directives/solicitud-item/solicitud-item';
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

  private solicitudes: Array<SolicitudModel>;

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

  private seccion: string =  'solicitudes';

  private storage: Storage;
  private usarDatosPersonales: boolean;
  private datosUsuarioObj: any;

  constructor(private nav: NavController, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, 
              private dataService: RemoteDataService) {
    
    // Indica que las listas usadas en los filtros no estan cargadas aun
    this.listadosCargados = false;

    // Inicializa la lista de solicitudes
    this.solicitudes = [];

    // Por defecto no usa los datos personales
    this.usarDatosPersonales = false;
    this.datosUsuarioObj = null;

    // Inicializa los filtros de busqueda
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.ciudadSeleccionada = null;
    this.provinciaSeleccionada = null;

    let loadingPopup = this.loadingCtrl.create({
      content: 'Cargando solicitudes'
    });

    // Muestra el mensaje de cargando ciudades
    loadingPopup.present();

    // Obtenemos las solicitudes del servidor
    this.dataService.getSolicitudes().subscribe((solicitudesObj) => { 
      for(let i = 0; i < solicitudesObj.length; i++) {
        this.solicitudes.push(new SolicitudModel(solicitudesObj[i]));
      }

      // Oculta el mensaje de espera
      loadingPopup.dismiss();

    });  
  }

  ionViewDidEnter() {
    this.datosUsuarioObj = null;

    this.obtenerDatosUsuario();
  }

  // Inicializa los listados de la pagina
  public inicializarFiltros() {
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
        } 
      });
    }
  }

  public borrarFiltros() {
    this.provinciaSeleccionada = null;
    this.ciudadSeleccionada = null;
    this.grupoSanguineoSeleccionado = null;
    this.factorSanguineoSeleccionado = null;
    this.listaCiudades = null;
    this.usarDatosPersonales = false;
  }

  public usarDatosUsuario() {

    if(this.usarDatosPersonales) {

      let loadingPopup = this.loadingCtrl.create({
        content: 'Obteniendo datos'
      });

      loadingPopup.present();

      // Seteamos los datos del usuario en el formulario
      this.inicializarDatosUsuario().then(() => {

        // Ocultamos el mensaje de espera
        loadingPopup.dismiss();

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
      if(!this.storage) {
        this.storage = new Storage(SqlStorage);  
      }
      
      this.storage.get('datosUsuarioObj').then((datosUsuario) => {
        if(!datosUsuario) {
          // No hay datos guardados, por lo que mostramos un mensaje al usuario
          resolve(false);
        } else {
          // Inicializamos los listados con la informacion del usuario
          this.datosUsuarioObj = JSON.parse(datosUsuario);
          resolve(true);          
        }
      });
    });
  }

  // Método que inicializa el formulario con los datos del usuario
  public inicializarDatosUsuario(): Promise<boolean> {
    return new Promise((resolve) => {

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
    for(let i=0; i<listado.length; i++) {
      if(id === listado[i].getId())
        return i;
    }
    return -1;
  }

  // Método que inicializa el listado de ciudades de una provincia
  public inicializarCiudadesDeLaProvincia(nombreCiudad: string): void {
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
        }
        // TODO: manejar errores en las llamadas al servidor
        // -------------------------------------------------      
      });
  }

  public buscarSolicitudes() {
  }

  public abrirDetalles(event) {
    this.nav.push(DetallesSolicitudPage, {
      // Obtenemos la solicitud del evento
      unaSolicitud: event.value
    }, { animate: true, direction: 'forward' });
  }

  public nuevaSolicitud(): void {
    this.nav.push(NuevaSolicitudPage, {}, { animate: true, direction: 'forward' });
  }

}
