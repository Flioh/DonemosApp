// Referencias de Angular
import { NgModule } from '@angular/core';

// Referencias de Ionic
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// App
import { DonemosApp } from './app.component';

// Servicios
import { DatosService } from '../shared/services/datos.service';
import { DonacionesService } from '../shared/services/donaciones.service';
import { LocalizacionService } from '../shared/services/localizacion.service';
import { ConectividadService } from '../shared/services/conectividad.service';

import { AppConfig } from '../shared/app-config';

// Paginas y componentes
import { ListaSolicitudesPage } from '../components/solicitudes/lista-solicitudes/lista-solicitudes.component';
import { DetallesSolicitudPage } from '../components/solicitudes/detalles-solicitud/detalles-solicitud.component';
import { NuevaSolicitudPage } from '../components/solicitudes/nueva-solicitud/nueva-solicitud.component';
import { ResumenSolicitudComponent } from '../components/solicitudes/resumen-solicitud/resumen-solicitud.component';
import { EditarPreferenciasPage } from '../components/preferencias-usuario/editar-preferencias/editar-preferencias.component';
import { ErrorPage } from '../shared/components/error/error.component';

// Directivas
import { MapaEstaticoDirective } from '../shared/directives/mapa-estatico.directive';
import { InstitucionesAutocompleteDirective } from '../shared/directives/instituciones-autocomplete.directive';

// Pipes
import { FormatearFechaPipe } from '../shared/pipes/formatear-fecha.pipe';

@NgModule({
  declarations: [
    DonemosApp,

    // Paginas
    ListaSolicitudesPage,
    DetallesSolicitudPage,
    ResumenSolicitudComponent,
    NuevaSolicitudPage,
    EditarPreferenciasPage,
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
    DetallesSolicitudPage,
    ResumenSolicitudComponent,
    NuevaSolicitudPage,
    EditarPreferenciasPage,
    ErrorPage
  ],
  providers: [  DatosService, 
                DonacionesService, 
                LocalizacionService, 
                ConectividadService, 
                Storage, 
                AppConfig ]
})
export class AppModule {}
