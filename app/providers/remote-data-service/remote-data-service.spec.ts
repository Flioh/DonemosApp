import { Injectable, provide } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { beforeEachProviders, beforeEach, it, describe, expect, inject, async } from '@angular/core/testing';
import { RemoteDataService } from './remote-data-service';

import { NuevaSolicitudModel } from '../../providers/nueva-solicitud-model/nueva-solicitud-model';

import { MY_CONFIG_TOKEN, MY_CONFIG, ApplicationConfig } from '../../app-config.ts';

describe('RemoteData Service Model', () => {

	beforeEachProviders(() => [
	  	RemoteDataService,
	  	BaseRequestOptions,
	  	MockBackend,

	  	// Hacemos un mock del servicio HTTP
	  	provide(Http, {
	    	useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
	      		return new Http(backend, defaultOptions);
	    	},
	    	deps: [MockBackend, BaseRequestOptions]
	  	})
	]);

	// Mock para usar como respuesta en las llamadas a los servicios
	let provinciasMock = [
		{ "id" : 1, "nombre": "Mock 1"},
		{ "id" : 1, "nombre": "Mock 2"},
		{ "id" : 1, "nombre": "Mock 3"}];

	let localidadesMock = [
		{ "id": 1, "provincia": 1, "nombre": "Localidad 1"},
      	{ "id": 2, "provincia": 1, "nombre": "Localidad 2"},
      	{ "id": 3, "provincia": 1, "nombre": "Localidad 3"}];

    let solicitudesMock = [
		{ 
			"solicitudID" : 1,
			"usuarioID": 1,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provinciaID" : 1,
			"localidadID" : 2,
			"grupoSanguineoID" : 2,
			"factorSanguineoID" : 1,
			"cantidadDadores" : 5,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{ 
			"solicitudID" : 1,
			"usuarioID": 1,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provinciaID" : 1,
			"localidadID" : 2,
			"grupoSanguineoID" : 1,
			"factorSanguineoID" : 1,
			"cantidadDadores" : 3,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{ 
			"solicitudID" : 1,
			"usuarioID": 1,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provinciaID" : 1,
			"localidadID" : 2,
			"grupoSanguineoID" : 0,
			"factorSanguineoID" : 1,
			"cantidadDadores" : 2,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		}];

	// Hacemos el mock de las respuestas de las solicitudes
	beforeEach(inject([MockBackend], (backend: MockBackend) => {
	  	backend.connections.subscribe((c: MockConnection) => { 
	  		// Usamos la URL del request para ver que array devolver en la respuesta
	  		if(c.request.url.indexOf("solicitud") > -1) {
	  			// Enviamos el array de solicitudes en la respuesta	  			
	  			let solicitudesResponse = new Response(new ResponseOptions({body: JSON.stringify(solicitudesMock)}));
	  			c.mockRespond(solicitudesResponse);
	  		} else if(c.request.url.indexOf("provincia") > -1) {
	  			// Enviamos el array de provincias en la respuesta	  			
	  			let provinciasResponse = new Response(new ResponseOptions({body: JSON.stringify(provinciasMock)}));
	  			c.mockRespond(provinciasResponse);
	  		} else if(c.request.url.indexOf("localidad") > -1) {
	  			// Enviamos el array de localidades en la respuesta
	  			let localidadesResponse = new Response(new ResponseOptions({body: JSON.stringify(localidadesMock)}));
	  			c.mockRespond(localidadesResponse);
	  		} 
		});
	}));



	// Tests para asegurar que los metodos existen
	// ------------------------------------------
	it('Debe tener un metodo para obtener el listado de provincias',
	  inject([RemoteDataService], (testService: RemoteDataService) => {
	  	expect(testService.getListaProvincias).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de localidades',
	  inject([RemoteDataService], (testService: RemoteDataService) => {
	  	expect(testService.getListaCiudadesPorProvincia).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de solicitudes',
	  inject([RemoteDataService], (testService: RemoteDataService) => {
	  	expect(testService.getSolicitudes).toBeDefined();
	  })
	);



	// Tests para asegurar que no devuelven un listado vacio
	// -----------------------------------------------------
	it('El metodo getSolicitudes() debe devolver un arreglo no vacio',
	  async(inject([RemoteDataService], (testService: RemoteDataService) => {
	    testService.getSolicitudes().subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	));

	it('El metodo getListaProvincias() debe devolver un arreglo no vacio',
	  async(inject([RemoteDataService], (testService: RemoteDataService) => {
	    testService.getListaProvincias().subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	));

	it('El metodo getListaCiudadesPorProvincia() debe devolver un arreglo no vacio',
	  async(inject([RemoteDataService], (testService: RemoteDataService) => {
	    testService.getListaCiudadesPorProvincia(1).subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	));



	// Tests para asegurar que el tipo de dato devuelvo coincide con el tipo de dato esperado
	// --------------------------------------------------------------------------------------
	it('El metodo getSolicitudes() debe devolver objetos del typo NuevaSolicitudModel',
	  async(inject([RemoteDataService], (testService: RemoteDataService) => {
	    testService.getSolicitudes().subscribe((response) => {
	      let propiedadesSolicitudObtenida = JSON.stringify(Object.keys(response[0]).sort());
	      let propiedadesSolicitudCreada = JSON.stringify(Object.keys(new NuevaSolicitudModel()).sort());
	      expect(propiedadesSolicitudObtenida).toBe(propiedadesSolicitudCreada);
	    })
	  })
	));

});


