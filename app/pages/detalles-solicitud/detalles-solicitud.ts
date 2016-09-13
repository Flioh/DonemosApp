import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, SqlStorage, Storage } from 'ionic-angular';
import { NuevaSolicitudPage } from '../nueva-solicitud/nueva-solicitud';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';

@Component({
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html',
  pipes: [ TimeAgoPipe ]
})
export class DetallesSolicitudPage {

	// Variables de la clase
	private solicitudSeleccionada: SolicitudModel;

  private tiposSanguineosSolicitud: string;
  private compatibleConUsuario: boolean;

  private storage: Storage;

	constructor(private nav: NavController, 
              private navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private dataService: RemoteDataService) {

      if(this.dataService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / constructor');
      }

  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');

      this.obtenerDatosUsuario();

      if(this.dataService.modoDebugActivado()) {
        console.timeEnd('DetallesSolicitudPage / constructor');
      }
  	}

    public obtenerDatosUsuario(){

      if(this.dataService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / obtenerDatosUsuario');
      }

      this.tiposSanguineosSolicitud = DonacionesHelper.puedeRecibirDe(this.solicitudSeleccionada.getGrupoSanguineo().getId(), 
                                                                      this.solicitudSeleccionada.getFactorSanguineo().getId()).join(' ');
      this.compatibleConUsuario = false;

      if(!this.storage) {
        this.storage = new Storage(SqlStorage);  
      }

      this.storage.get('datosUsuarioObj').then((datosUsuario) => {
        if(datosUsuario) {
          let datosUsuarioObj = JSON.parse(datosUsuario);
          let tipoSanguineoUsuario = DonacionesHelper.getDescripcion(datosUsuarioObj.grupoSanguineoID, datosUsuarioObj.factorSanguineoID);

          // Si es compatible mostramos un mensjae informandolo
          this.compatibleConUsuario = this.tiposSanguineosSolicitud.indexOf(tipoSanguineoUsuario) > -1;

          // Resaltamos el tipo sanguineo del usuario
          this.tiposSanguineosSolicitud = this.tiposSanguineosSolicitud.replace(tipoSanguineoUsuario, '<span class="marked">' + tipoSanguineoUsuario + '</span> ');

          if(this.dataService.modoDebugActivado()) {
            console.timeEnd('DetallesSolicitudPage / obtenerDatosUsuario');
          }
        }
      });
    }

    // Inicializa el mapa cuando el DOM ya esta listo
  	ionViewDidEnter(){

      /*if(this.dataService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / ionViewDidEnter');
      }

      let geocoder = new google.maps.Geocoder();

      let mapOptions = {
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      let map = new google.maps.Map(document.getElementById("map"), mapOptions);

      let direccion = `${ this.solicitudSeleccionada.getDireccion() }, ${ this.solicitudSeleccionada.getCiudad().getNombre() } ${ this.solicitudSeleccionada.getProvincia().getNombre() }`;

      geocoder.geocode({'address': direccion}, (results, status)  => {
        if (status === google.maps.GeocoderStatus.OK) {

          // Centramos el mapa en las coordenadas del lugar
          map.setCenter(results[0].geometry.location);

          // Agregamos un marcador al luget
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });

          if(this.dataService.modoDebugActivado()) {
            console.timeEnd('DetallesSolicitudPage / ionViewDidEnter');
          }

        } else {
          // TODO: manejar el caso de error
          // ------------------------------
          //valert('Geocode was not successful for the following reason: ' + status);
        }
      });*/
    }
  }


