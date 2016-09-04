import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';

import { DetallesSolicitudPage } from '../detalles-solicitud/detalles-solicitud';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';

import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';

import { SolicitudItem } from '../../directives/solicitud-item/solicitud-item';

import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';

import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/donemos-helper-service/donemos-helper-service';

@Component({
  templateUrl: 'build/pages/lista-solicitudes/lista-solicitudes.html',
  directives: [SolicitudItem]
})
export class ListaSolicitudesPage {

  private solicitudes: Array<SolicitudModel>;

  /* Filtros de busqueda */
  private provinciaID: number;
  private ciudadID: number;
  private grupoSanguineoID: number;
  private factorSanguineoID: number;

  private listaGruposSanguineos: Array<any>;
  private listaFactoresSanguineos: Array<any>;
  private listaProvincias: Array<any>;
  private listaCiudades: Array<any>;

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

    this.dataService.getListaCiudadesPorProvincia(this.provinciaID)
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
