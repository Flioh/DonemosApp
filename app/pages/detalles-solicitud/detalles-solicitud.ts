import { ConfigMock } from '../../../test/mocks';
import { TimeAgoPipe } from '../../pipes/time-ago/time-ago-pipe';
import { DonacionesHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { RemoteDataService } from '../../providers/remote-data-service/remote-data-service';
import { SolicitudModel } from '../../providers/solicitud-model/solicitud-model';
import { UserDataService } from '../../providers/user-data-service/user-data-service';
import { Component, Inject } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { MY_CONFIG, MY_CONFIG_TOKEN, ApplicationConfig } from '../../app-config.ts';

@Component({
	templateUrl: 'build/pages/detalles-solicitud/detalles-solicitud.html',
  pipes: [ TimeAgoPipe ]
})
export class DetallesSolicitudPage {

	// Variables de la clase
	private solicitudSeleccionada: SolicitudModel;

  // Informacion del mapa
  private mapSrc: string;

  private tiposSanguineosSolicitud: string;
  private compatibleConUsuario: boolean;

  private storage: Storage;

	constructor(private nav: NavController, 
              private navParams: NavParams, 
              private loadingCtrl: LoadingController, 
              private remoteDataService: RemoteDataService,
              private userDataService: UserDataService,
              @Inject(MY_CONFIG_TOKEN) config: ApplicationConfig) {
      
      if(this.remoteDataService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / constructor');
      }

  		// Obtenemos la solicitud seleccionada a traves de navParams
  		this.solicitudSeleccionada = navParams.get('unaSolicitud');

      this.obtenerDatosUsuario();

      // Crea el mapa
      this.obteneMapaUrl(config.staticMapUrl, config.staticMapKey, 400, 400, 16);

      if(this.remoteDataService.modoDebugActivado()) {
        console.timeEnd('DetallesSolicitudPage / constructor');
      }
  	}

    // Método que crea la imagen del mapa
    public obteneMapaUrl(mapUrl: string, mapKey: string, width: number, height: number, zoom: number): void {
    
      // Obtenemos la direccion de la institución
      let direccion = `${ this.solicitudSeleccionada.getDireccion() },${ this.solicitudSeleccionada.getCiudad().getNombre() },${ this.solicitudSeleccionada.getProvincia().getNombre() },Argentina`;

      // Generamos la url del mapa estatico
      this.mapSrc = `${ mapUrl }?zoom=${ zoom }&size=${ width }x${ height }&markers=color:blue%7C${ direccion.replace(/ /g, '+') }&key=${ mapKey }`;
    }

    // Inicializa el mapa cuando el DOM ya esta listo
  	ionViewDidEnter(){

      /*if(this.remoteDataService.modoDebugActivado()) {
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

          if(this.remoteDataService.modoDebugActivado()) {
            console.timeEnd('DetallesSolicitudPage / ionViewDidEnter');
          }

        } else {
          // TODO: manejar el caso de error
          // ------------------------------
          //valert('Geocode was not successful for the following reason: ' + status);
        }
      });*/
    }


    // Método que obtiene los datos del usuario
    public obtenerDatosUsuario(){

      if(this.remoteDataService.modoDebugActivado()) {
        console.time('DetallesSolicitudPage / obtenerDatosUsuario');
      }

      this.tiposSanguineosSolicitud = DonacionesHelper.puedeRecibirDe(this.solicitudSeleccionada.getGrupoSanguineo().getId(), 
                                                                      this.solicitudSeleccionada.getFactorSanguineo().getId()).join(' ');
      this.compatibleConUsuario = false;

      // Obtenemos los datos del servicio de datos del usuario
      this.userDataService.getDatosUsuario().then((datosUsuario) => {
        if(datosUsuario) {
          let tipoSanguineoUsuario = DonacionesHelper.getDescripcion(datosUsuario.grupoSanguineoID, datosUsuario.factorSanguineoID);

          // Si es compatible mostramos un mensjae informandolo
          this.compatibleConUsuario = this.tiposSanguineosSolicitud.indexOf(tipoSanguineoUsuario) > -1;

          // Resaltamos el tipo sanguineo del usuario
          this.tiposSanguineosSolicitud = this.tiposSanguineosSolicitud.replace(tipoSanguineoUsuario, '<span class="marked">' + tipoSanguineoUsuario + '</span> ');

          if(this.remoteDataService.modoDebugActivado()) {
            console.timeEnd('DetallesSolicitudPage / obtenerDatosUsuario');
          }
        }
      });
    }
  }


