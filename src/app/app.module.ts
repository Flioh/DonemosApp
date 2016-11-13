// Referencias de Angular
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// Referencias de Ionic
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Referencias de Auth0
import { AuthConfig, AuthHttp } from 'angular2-jwt';

// App
import { DonemosApp } from './app.component';

// Servicios
import { DatosService } from '../shared/services/datos.service';
import { DonacionesService } from '../shared/services/donaciones.service';
import { LocalizacionService } from '../shared/services/localizacion.service';
import { ConectividadService } from '../shared/services/conectividad.service';

import { LoginService } from '../shared/services/login.service';

import { AppConfig } from '../shared/app-config';

// Paginas y componentes
import { ListaSolicitudesPage } from '../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { MisSolicitudesPage } from '../components/solicitudes/mis-solicitudes/mis-solicitudes.component';
import { DetallesSolicitudPage } from '../components/solicitudes/detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../components/solicitudes/nueva-solicitud/nueva-solicitud.component';
import { ResumenSolicitudComponent } from '../components/solicitudes/resumen-solicitud/resumen-solicitud.component';
import { EditarPreferenciasPage } from '../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';
import { RequisitosPage } from '../components/donaciones/requisitos/requisitos.component';
import { ErrorPage } from '../shared/components/error/error.component';
import { IntroPage } from '../shared/components/intro/intro.component';
import { DropdownPage } from '../shared/components/dropdown/dropdown.component';


// Directivas
import { MapaEstaticoDirective } from '../shared/directives/mapa-estatico.directive';
import { InstitucionesAutocompleteDirective } from '../shared/directives/instituciones-autocomplete.directive';

// Pipes
import { FormatearFechaPipe } from '../shared/pipes/formatear-fecha.pipe';

// Creamos una instancia del Storage para usar en el provider de Auth0
let storage: Storage = new Storage();

// Redefinimos el tokenGetter de Auth0
export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    DonemosApp,

    // Paginas
    ListaSolicitudesPage,
    MisSolicitudesPage,
    DetallesSolicitudPage,
    ResumenSolicitudComponent,
    NuevaSolicitudPage,
    EditarPreferenciasPage,
    RequisitosPage,
    IntroPage,
    DropdownPage,
    ErrorPage,

    // Pipes
    FormatearFechaPipe,

    // Directivas
    MapaEstaticoDirective,
    InstitucionesAutocompleteDirective
  ],
  imports: [
    IonicModule.forRoot(DonemosApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DonemosApp,

    // Paginas
    ListaSolicitudesPage,
    MisSolicitudesPage,
    DetallesSolicitudPage,
    ResumenSolicitudComponent,
    NuevaSolicitudPage,
    EditarPreferenciasPage,
    RequisitosPage,
    IntroPage,
    DropdownPage,
    ErrorPage
  ],
  providers: [  DatosService, 
                DonacionesService, 
                LocalizacionService, 
                ConectividadService, 
                Storage, 
                AppConfig,
                LoginService,
                {
                    provide: AuthHttp,
                    useFactory: getAuthHttp,
                    deps: [Http]
                } ]
})
export class AppModule {}
