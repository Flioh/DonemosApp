import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';

/* Paginas utilizadas */
import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';

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

  constructor(private nav: NavController, 
              private loadingCtrl: LoadingController, 
              private dataService: RemoteDataService,
              public events: Events) {
    
    // Indica que las listas usadas en los filtros no estan cargadas aun
    this.listadosCargados = false;

    // Inicializa la lista de solicitudes
    this.solicitudes = [];

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

    this.dataService.getSolicitudes().subscribe((solicitudesObj) => { 
      for(let i = 0; i < solicitudesObj.length; i++) {
        this.solicitudes.push(new SolicitudModel(solicitudesObj[i]));
      }

      // Oculta el mensaje de espera
      loadingPopup.dismiss();

    });    
  }

  // Inicializa los listados de la pagina
  public cargarListados() {

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
          this.listadosCargados = true;
          loadingPopup.dismiss();
        } 
      });
    }
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
