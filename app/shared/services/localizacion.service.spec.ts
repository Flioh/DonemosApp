// Referencias de Angular
import { Component, Injectable, provide } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { Platform } from 'ionic-angular';

// Otras referencias
import { Json } from '@angular/core/src/facade/lang';

// Servicio principal
import { LocalizacionService } from './localizacion.service';

// Mock de la clase Platform de Ionic
class PlatformMock {

  private platform: string;

  public setPlatform(platformName:string) {
    this.platform = platformName;
  }

  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public is(platformName:string): boolean {
      return this.platform.toLowerCase() === platformName.toLowerCase();
  }
}

// Mock del servicio a testear
let localizacionServiceMock: LocalizacionService;

let geocoderMock;

// Mock de la clase LatLng de Google
class LatLngMock {

  private _lat = -31.6404232;
  private _lng = -60.70327520000001;

  public lat() : string {
    return this._lat.toString();
  }

  public lng(): any {
    return this._lng.toString();
  }

}

// Metodo que agrega un resultado de geolocalizacion
var agregarResultado = function() {
    let resultados = [];
    
    resultados.push({
        geometry: {
            location: new LatLngMock()
        }
    });

    return resultados;
};

let resultadosGeolocalizacionMock = agregarResultado();

describe('LocalizacionService', () => {

  // Usamos el mock en lugar del modelo real
  beforeEach(function() {
      
      // Mock de la variable google para evitar errores al ejecutar los tests
      window['google'] = {};
      window['google']['maps'] = {};
      window['google']['maps']['Geocoder'] = function(){ return true; };

      // Hacemos un mock de la llamada al servicio de geolocalizacion
      var constructorSpy = spyOn(google.maps, 'Geocoder');
      geocoderMock = jasmine.createSpyObj('Geocoder', ['geocode']);
      constructorSpy.and.returnValue(geocoderMock);

      // Hacemos un mock de la llamada al metodo window.open
      var constructorSpy = spyOn(window, 'open');

      let platform = (<any>new PlatformMock());
      localizacionServiceMock = new LocalizacionService(platform);
  });



	// Tests para asegurar que los metodos estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo mostrarRuta()', () => {
		expect(localizacionServiceMock.mostrarRuta).toBeDefined();
	});

  it('Debe tener un metodo setServicioGeolocalizacion()', () => {
		expect(localizacionServiceMock.setServicioGeolocalizacion).toBeDefined();
	});

  it('Debe tener un metodo obtenerCoordenadas()', () => {
		expect(localizacionServiceMock.obtenerCoordenadas).toBeDefined();
	});

  it('Debe tener un metodo abrirAplicacionDeMapas()', () => {
		expect(localizacionServiceMock.abrirAplicacionDeMapas).toBeDefined();
	});



  // Tests para asegurar que el metodo de geolocalizacion devuelve los valores correctos
	// -----------------------------------------------------------------------------------
  it('Debe tener un metodo obtenerCoordenadas() que devuelve un string vacío si no hay ubicaciones disponibles', () => {
    let direccion = 'Riobamba 6951';
    let nombreLugar = 'Casa';

    geocoderMock.geocode.and.callFake(function(request, callback) {
        callback([], "ERROR");
    });
 
    var resultado = localizacionServiceMock.obtenerCoordenadas(direccion, nombreLugar);

    resultado.then((coordenadas) => {
      expect(geocoderMock.geocode).toHaveBeenCalled();
      expect(coordenadas).toEqual('');
    }); 
  });

  it('Debe tener un metodo obtenerCoordenadas() que devuelve un string vacío si no hay servicio de geolocalizacion disponible', () => {
    let direccion = 'Riobamba 6951';
    let nombreLugar = 'Casa';

    localizacionServiceMock.setServicioGeolocalizacion(null);
 
    var resultado = localizacionServiceMock.obtenerCoordenadas(direccion, nombreLugar);

    resultado.then((coordenadas) => {
      expect(geocoderMock.geocode).not.toHaveBeenCalled();
      expect(coordenadas).toEqual('');
    }); 
  });

  it('Debe tener un metodo obtenerCoordenadas() que devuelve las coordenadas del lugar', () => {
    let direccion = 'Riobamba 6951';
    let nombreLugar = 'Casa';

    geocoderMock.geocode.and.callFake(function(request, callback) {
        callback(resultadosGeolocalizacionMock, "OK");
    });
 
    var resultado = localizacionServiceMock.obtenerCoordenadas(direccion, nombreLugar);

    resultado.then((coordenadas) => {
      expect(geocoderMock.geocode).toHaveBeenCalled();
      expect(coordenadas).not.toEqual('');
    }); 
  });



  // Tests para asegurar que la aplicacion de mapas se abre usando los parametros correctos
	// --------------------------------------------------------------------------------------
  it('Debe abrir la aplicacion de mapas de IOS con los parametros correctos', () => {

    let coordenadas = '-31.6404232,-60.70327520000001';
    let nombreLugar = 'Sanatorio Mayo';

    let iosPlatform = (<any>new PlatformMock());
    iosPlatform.setPlatform('ios');
    localizacionServiceMock = new LocalizacionService(iosPlatform);

    localizacionServiceMock.abrirAplicacionDeMapas(coordenadas, nombreLugar);
    // window.open('maps://?q=' + coordenadasLugar, '_system');

    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('maps://?q=' + coordenadas, '_system');
  });

  it('Debe abrir la aplicacion de mapas de Android con los parametros correctos', () => {

    let coordenadas = '-31.6404232,-60.70327520000001';
    let nombreLugar = 'Sanatorio Mayo';

    let androidPlatform = (<any>new PlatformMock());
    androidPlatform.setPlatform('android');
    localizacionServiceMock = new LocalizacionService(androidPlatform);

    localizacionServiceMock.abrirAplicacionDeMapas(coordenadas, nombreLugar);

    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('geo:0,0?q=' + coordenadas + '(' + encodeURI(nombreLugar) + ')', '_system');
  });

  it('Debe tener un metodo mostrarRuta() que obtiene las coordenadas y abre la aplicacion de mapas', () => {
    let coordenadas = '-31.6404232,-60.70327520000001';
    let direccion = 'Riobamba 6951';
    let nombreLugar = 'Casa';

    // Hacemos que el mock use la plataforma android
    let androidPlatform = (<any>new PlatformMock());
    androidPlatform.setPlatform('android');
    localizacionServiceMock = new LocalizacionService(androidPlatform);

    // Hacemos un mock de la llamada al metodo obtenerCoordenadas()
    var obtenerCoordenadasSpy = spyOn(localizacionServiceMock, 'obtenerCoordenadas');
    obtenerCoordenadasSpy.and.callFake(function(){
      return new Promise((resolve) => {
        resolve(coordenadas);
      });
    });

    // Hacemos un mock de la llamada al metodo abrirAplicacionDeMapas()
    var abrirAplicacionMapasSpy = spyOn(localizacionServiceMock, 'abrirAplicacionDeMapas');

    // Llamamos al método a testear
    localizacionServiceMock.mostrarRuta(direccion, nombreLugar).then(() => {
      expect(localizacionServiceMock.obtenerCoordenadas).toHaveBeenCalled();
      expect(localizacionServiceMock.abrirAplicacionDeMapas).toHaveBeenCalled();
    });
  });

  
});