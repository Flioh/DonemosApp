// Referecias de Angular
import { Injectable, provide } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { beforeEachProviders, beforeEach, it, describe, expect, inject, async } from '@angular/core/testing';

// Servicio principal
import { DatosService } from './datos.service';

// Modelos a usar en los tests
import { SolicitudModel } from '../../solicitudes/solicitud.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';
import { CiudadModel } from '../..//shared/models/ciudad.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoEnum, FactorSanguineoEnum, DonacionesService } from '../../shared/services/donaciones.service';

// Objeto de configuracion
import { AppConfig, ApplicationConfig } from '../../shared/app-config';

let donacionesServiceHelper = new DonacionesService();

describe('DatosService', () => {

	// Antes de cada test inicializamos el Injector con las dependencias necesarias
	beforeEachProviders(() => [
	  	DatosService,
			AppConfig,
			DonacionesService,
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
	let provinciasMock = [{ "id" : 1, "nombre": "Provincia 1"},{ "id" : 2, "nombre": "Provincia 2"},{ "id" : 3, "nombre": "Provincia 3"}];
	
	let ciudadesMock = [{ "id": 1, "provinciaID": 1, "nombre": "Localidad 1"},{ "id": 2, "provinciaID": 1, "nombre": "Localidad 2"},{ "id": 3, "provinciaID": 1, "nombre": "Localidad 3"}];

	let solicitudesMock = [
		{
			"solicitudID" : 1,
			"usuarioID": 1,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provincia" : new ProvinciaModel(1, "Provincia 1"),
			"ciudad" : new CiudadModel(1, "Ciudad 1"),
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesServiceHelper.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)),
			"nombrePaciente": "Nombre Apellido",
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
			"provincia" : new ProvinciaModel(1, "Provincia 1"),
			"ciudad" : new CiudadModel(1, "Ciudad 1"),
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesServiceHelper.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)),
			"cantidadDadores" : 3,
			"nombrePaciente": "Nombre Apellido",
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
			"provincia" : new ProvinciaModel(1, "Provincia 1"),
			"ciudad" : new CiudadModel(1, "Ciudad 1"),
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesServiceHelper.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)),
			"cantidadDadores" : 2,
			"nombrePaciente": "Nombre Apellido",
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		}];

	let gruposSanguineosMock = [
		new GrupoSanguineoModel(GrupoSanguineoEnum.Cero, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.Cero)),
		new GrupoSanguineoModel(GrupoSanguineoEnum.A, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)),
		new GrupoSanguineoModel(GrupoSanguineoEnum.AB, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.AB)),
		new GrupoSanguineoModel(GrupoSanguineoEnum.B, donacionesServiceHelper.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.B))
	];

	let factoresSanguineosMock = [
		new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesServiceHelper.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)),
		new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesServiceHelper.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhNegativo))
	];

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
	  		} else if(c.request.url.indexOf("ciudad") > -1) {
	  			// Enviamos el array de ciudades en la respuesta
	  			let localidadesResponse = new Response(new ResponseOptions({body: JSON.stringify(ciudadesMock)}));
	  			c.mockRespond(localidadesResponse);
	  		} else if(c.request.url.indexOf("grupo") > -1) {
	  			// Enviamos el array de grupos sanguineos en la respuesta
	  			let localidadesResponse = new Response(new ResponseOptions({body: JSON.stringify(gruposSanguineosMock)}));
	  			c.mockRespond(localidadesResponse);
	  		} else if(c.request.url.indexOf("factor") > -1) {
	  			// Enviamos el array de factores sanguineos en la respuesta
	  			let localidadesResponse = new Response(new ResponseOptions({body: JSON.stringify(factoresSanguineosMock)}));
	  			c.mockRespond(localidadesResponse);
	  		}
		});
	}));

	// Tests para asegurar que los metodos existen
	// ------------------------------------------
	it('Debe tener un metodo para obtener el listado de provincias',
	  inject([DatosService], (testService: DatosService) => {
	  	expect(testService.getListaProvincias).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de localidades',
	  inject([DatosService], (testService: DatosService) => {
	  	expect(testService.getListaCiudadesPorProvincia).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de solicitudes',
	  inject([DatosService], (testService: DatosService) => {
	  	expect(testService.getSolicitudes).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de grupos sanguineos',
	  inject([DatosService], (testService: DatosService) => {
	  	expect(testService.getGruposSanguineos).toBeDefined();
	  })
	);

	it('Debe tener un metodo para obtener el listado de factores sanguineos',
	  inject([DatosService], (testService: DatosService) => {
	  	expect(testService.getFactoresSanguineos).toBeDefined();
	  })
	);



	// Tests para asegurar que no devuelven un listado vacio
	// -----------------------------------------------------
	it('El metodo getSolicitudes() debe devolver un arreglo no vacio',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getSolicitudes().subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	);

	it('El metodo getListaProvincias() debe devolver un arreglo no vacio',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getListaProvincias().subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	);

	it('El metodo getListaCiudadesPorProvincia() debe devolver un arreglo no vacio',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getListaCiudadesPorProvincia(1).subscribe((response) => {
	      expect(response.length).toBeGreaterThan(0);
	    })

	  })
	);

	it('El metodo getGruposSanguineos() debe devolver un arreglo con cuatro grupos sanguineos',
	  inject([DatosService], (testService: DatosService) => {
	      expect(testService.getGruposSanguineos().length).toBe(4);
	  })
	);

	it('El metodo getFactoresSanguineos() debe devolver un arreglo con dos factores sanguineos',
	  inject([DatosService], (testService: DatosService) => {
	      expect(testService.getFactoresSanguineos().length).toBe(2);
	  })
	);



	// Tests para asegurar que el tipo de dato devuelvo coincide con el tipo de dato esperado
	// --------------------------------------------------------------------------------------
	it('El metodo getSolicitudes() debe devolver objetos del tipo SolicitudModel',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getSolicitudes().subscribe((response) => {
	      let propiedadesSolicitudObtenida = JSON.stringify(Object.keys(response[0]).sort());
	      let propiedadesSolicitudCreada = JSON.stringify(Object.keys(new SolicitudModel()).sort());
	      expect(propiedadesSolicitudObtenida).toBe(propiedadesSolicitudCreada);
	    })
	  })
	);

	it('El metodo getListaProvincias() debe devolver objetos del tipo ProvinciaModel',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getListaProvincias().subscribe((response) => {
	      let propiedadesprovinciaObtenida = JSON.stringify(Object.keys(response[0]).sort());
	      let propiedadesprovinciaCreada = JSON.stringify(Object.keys(new ProvinciaModel(1, "Provincia 1")).sort());
	      expect(propiedadesprovinciaObtenida).toBe(propiedadesprovinciaCreada);
	    })
	  })
	);

	it('El metodo getListaCiudadesPorProvincia() debe devolver objetos del tipo CiudadModel',
	  inject([DatosService], (testService: DatosService) => {
	    testService.getListaCiudadesPorProvincia(1).subscribe((response) => {
	      let propiedadesCiudadObtenida = JSON.stringify(Object.keys(response[0]).sort());
	      let propiedadesCiudadCreada = JSON.stringify(Object.keys(new CiudadModel(1, "Ciudad 1")).sort());
	      expect(propiedadesCiudadObtenida).toBe(propiedadesCiudadCreada);
	    })
	  })
	);

	it('El metodo getGruposSanguineos() debe devolver objetos del tipo GrupoSanguineoModel',
	  inject([DatosService], (testService: DatosService) => {
	  	let grupoObtenido = testService.getGruposSanguineos()[0];
	  	let propiedadesGrupoObtenido = JSON.stringify(Object.keys(grupoObtenido).sort()) ;
	  	let propiedadesGrupoCreado = JSON.stringify(Object.keys(new GrupoSanguineoModel(grupoObtenido.getId(), grupoObtenido.getNombre())).sort()) ;
	      expect(propiedadesGrupoObtenido).toBe(propiedadesGrupoCreado);
	  })
	);

	it('El metodo getFactoresSanguineos() debe devolver objetos del tipo FactorSanguineoModel',
	  inject([DatosService], (testService: DatosService) => {
	  	let factorObtenido = testService.getFactoresSanguineos()[0];
	  	let propiedadesFactorObtenido = JSON.stringify(Object.keys(factorObtenido).sort()) ;
	  	let propiedadesFactorCreado = JSON.stringify(Object.keys(new FactorSanguineoModel(factorObtenido.getId(), factorObtenido.getNombre())).sort()) ;
	      expect(propiedadesFactorObtenido).toBe(propiedadesFactorCreado);
	  })
	);

});
