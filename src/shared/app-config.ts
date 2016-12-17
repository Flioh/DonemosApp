// Referencias de Angular
import { Injectable } from '@angular/core';

// Keys
import { DevKeys } from './dev-keys';
import { ProdKeys } from './prod-keys';

// Interface utilizada para evitar warnings de Typescript
export interface ApplicationConfig {
    apiEndPointProvincias: string;
    apiEndPointLocalidades: string;
    apiEndPointSolicitudes: string;
    staticMapUrl: string;
    staticMapKey: string;
}

@Injectable()
export class AppConfig {

    public modoDebug: boolean = true;    
    private apiVersion: number = 1;

    // Google maps
    public staticMapUrl: string = 'https://maps.googleapis.com/maps/api/staticmap';
    public staticMapTamanio: number = 400;
    public staticMapZoom: number = 16;

    // Endpoints
    // -----------------------------------
    get apiEndPointProvincias(): string {
        return this.modoDebug ? `${DevKeys.apiUrl}/provincia` : `${ProdKeys.apiUrl}/${this.apiVersion}/provincia`;
    }

    get apiEndPointLocalidades(): string {
        return this.modoDebug ? `${DevKeys.apiUrl}/localidad` : `${ProdKeys.apiUrl}/${this.apiVersion}/localidad`;
    }

    get apiEndPointSolicitudes(): string {
        return this.modoDebug ? `${DevKeys.apiUrl}/solicitud` : `${ProdKeys.apiUrl}/${this.apiVersion}/solicitud`;
    }

    get apiEndPointBancosSangre(): string {
        return this.modoDebug ? `${DevKeys.apiUrl}/banco` : `${ProdKeys.apiUrl}/${this.apiVersion}/banco`;
    }

    // Google maps
    // -----------------------------------
    get autocompleteKey(): string {
        return this.modoDebug ? DevKeys.autocompleteKey : ProdKeys.autocompleteKey;
    }

    get staticMapKey(): string {
        return this.modoDebug ? DevKeys.staticMapKey : ProdKeys.staticMapKey;
    }

    // Bugsnag
    // -----------------------------------
    get bugSnagApiKey(): string {
        return this.modoDebug ? DevKeys.bugSnagApiKey : ProdKeys.bugSnagApiKey;
    }
}