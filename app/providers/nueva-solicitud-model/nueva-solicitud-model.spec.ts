import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { NuevaSolicitudModel } from './nueva-solicitud-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase MenuItemModel
@Injectable()
export class NuevaSolicitudModelMock extends NuevaSolicitudModel {

	constructor(){
		let datosSolicitudMock = { 
			"solicitudID" : 1,
			"usuarioID": 2,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provinciaID" : 3,
			"localidadID" : 4,
			"grupoSanguineoID" : 5,
			"factorSanguineoID" : 6,
			"cantidadDadores" : 7,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		};
		// Creamos una instancia en base a los datos de prueba
		super(datosSolicitudMock);
	}
}

describe('NuevaSolicitud Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: NuevaSolicitudModel, useClass: NuevaSolicitudModelMock}]);



	// Los metodos get deben estar definidos
	// -------------------------------------
	it('Debe tener un metodo getSolicitudID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getSolicitudID).toBeDefined();
	}));

	it('Debe tener un metodo getUsuarioID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getUsuarioID).toBeDefined();
	}));

	it('Debe tener un metodo getFechaCreacion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getFechaCreacion).toBeDefined();		
	}));

	it('Debe tener un metodo getEstaVigente()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getEstaVigente).toBeDefined();		
	}));

	it('Debe tener un metodo getProvinciaID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getProvinciaID).toBeDefined();		
	}));

	it('Debe tener un metodo getLocalidadID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getLocalidadID).toBeDefined();		
	}));

	it('Debe tener un metodo getGrupoSanguineoID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getGrupoSanguineoID).toBeDefined();		
	}));

	it('Debe tener un metodo getFactorSanguineoID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getFactorSanguineoID).toBeDefined();
	}));

	it('Debe tener un metodo getCantidadDadores()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getCantidadDadores).toBeDefined();		
	}));

	it('Debe tener un metodo getInstitucion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getInstitucion).toBeDefined();		
	}));

	it('Debe tener un metodo getDireccion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getDireccion).toBeDefined();
	}));

	it('Debe tener un metodo getHoraDesde()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getHoraDesde).toBeDefined();		
	}));

	it('Debe tener un metodo getHoraHasta()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getHoraHasta).toBeDefined();		
	}));

	it('Debe tener un metodo getDatosAdicionales()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getDatosAdicionales).toBeDefined();		
	}));



	// Los metodos get deben devolver los valores correctamente
	// --------------------------------------------------------
	it('Debe tener un metodo getSolicitudID() que devuelva el ID de la solicitud correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {		
		expect(menuItemModel.getSolicitudID()).toBe(1);
	}));

	it('Debe tener un metodo getUsuarioID() que devuelva el ID del usuario correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getUsuarioID()).toBe(2);
	}));

	it('Debe tener un metodo getFechaCreacion() que devuelva la fecha de creacion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getFechaCreacion()).toBe("12/03/2016");
	}));

	it('Debe tener un metodo getEstaVigente() que devuelva si esta vigente correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getEstaVigente()).toBe(true);
	}));

	it('Debe tener un metodo getProvinciaID() que devuelva el ID de la provincia correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getProvinciaID()).toBe(3);
	}));

	it('Debe tener un metodo getLocalidadID() que devuelva el ID de la localidad correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getLocalidadID()).toBe(4);
	}));

	it('Debe tener un metodo getGrupoSanguineoID() que devuelva el ID del grupo sanguineo correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getGrupoSanguineoID()).toBe(5);
	}));

	it('Debe tener un metodo getFactorSanguineoID() que devuelva el ID del factor sanguineo correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getFactorSanguineoID()).toBe(6);
	}));

	it('Debe tener un metodo getCantidadDadores() que devuelva la cantidad de dadores correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getCantidadDadores()).toBe(7);
	}));

	it('Debe tener un metodo getInstitucion() que devuelva el la institucion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getInstitucion()).toBe("Sanatorio Mayo");
	}));

	it('Debe tener un metodo getDireccion() que devuelva la direccion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getDireccion()).toBe("Rivadavia 2345");
	}));

	it('Debe tener un metodo getHoraDesde() que devuelva la hora inicial correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getHoraDesde()).toBe("08:00");
	}));

	it('Debe tener un metodo getHoraHasta() que devuelva la hora final correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getHoraHasta()).toBe("18:00");
	}));

	it('Debe tener un metodo getDatosAdicionales() que devuelva los datos adicionales correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.getDatosAdicionales()).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
	}));



	// Los metodos set deben estar definidos
	// -------------------------------------
	it('Debe tener un metodo setSolicitudID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setSolicitudID).toBeDefined();
	}));

	it('Debe tener un metodo setUsuarioID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setUsuarioID).toBeDefined();
	}));

	it('Debe tener un metodo setFechaCreacion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setFechaCreacion).toBeDefined();		
	}));

	it('Debe tener un metodo setEstaVigente()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setEstaVigente).toBeDefined();		
	}));

	it('Debe tener un metodo setProvinciaID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setProvinciaID).toBeDefined();		
	}));

	it('Debe tener un metodo setLocalidadID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setLocalidadID).toBeDefined();		
	}));

	it('Debe tener un metodo setGrupoSanguineoID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setGrupoSanguineoID).toBeDefined();		
	}));

	it('Debe tener un metodo setFactorSanguineoID()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setFactorSanguineoID).toBeDefined();
	}));

	it('Debe tener un metodo setCantidadDadores()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setCantidadDadores).toBeDefined();		
	}));

	it('Debe tener un metodo setInstitucion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setInstitucion).toBeDefined();		
	}));

	it('Debe tener un metodo setDireccion()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setDireccion).toBeDefined();
	}));

	it('Debe tener un metodo setHoraDesde()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setHoraDesde).toBeDefined();		
	}));

	it('Debe tener un metodo setHoraHasta()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setHoraHasta).toBeDefined();		
	}));

	it('Debe tener un metodo setDatosAdicionales()', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setDatosAdicionales).toBeDefined();		
	}));



	// Los metodos set deben setear los valores correctamente
	// ------------------------------------------------------
	it('Debe tener un metodo setSolicitudID() que devuelva el ID de la solicitud correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {		
		expect(menuItemModel.setSolicitudID(2)).toBe(2);
	}));

	it('Debe tener un metodo setUsuarioID() que devuelva el ID del usuario correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setUsuarioID(3)).toBe(3);
	}));

	it('Debe tener un metodo setFechaCreacion() que devuelva la fecha de creacion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		let nuevaFecha = new Date();
		expect(menuItemModel.setFechaCreacion(nuevaFecha)).toBe(nuevaFecha);
	}));

	it('Debe tener un metodo setEstaVigente() que devuelva si esta vigente correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setEstaVigente(false)).toBe(false);
	}));

	it('Debe tener un metodo setProvinciaID() que devuelva el ID de la provincia correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setProvinciaID(4)).toBe(4);
	}));

	it('Debe tener un metodo setLocalidadID() que devuelva el ID de la localidad correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setLocalidadID(5)).toBe(5);
	}));

	it('Debe tener un metodo setGrupoSanguineoID() que devuelva el ID del grupo sanguineo correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setGrupoSanguineoID(6)).toBe(6);
	}));

	it('Debe tener un metodo setFactorSanguineoID() que devuelva el ID del factor sanguineo correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setFactorSanguineoID(7)).toBe(7);
	}));

	it('Debe tener un metodo setCantidadDadores() que devuelva la cantidad de dadores correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setCantidadDadores(8)).toBe(8);
	}));

	it('Debe tener un metodo setInstitucion() que devuelva el la institucion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setInstitucion("Sanatorio Garay")).toBe("Sanatorio Garay");
	}));

	it('Debe tener un metodo setDireccion() que devuelva la direccion correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setDireccion("Junin 1234")).toBe("Junin 1234");
	}));

	it('Debe tener un metodo setHoraDesde() que devuelva la hora inicial correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setHoraDesde("09:00")).toBe("09:00");
	}));

	it('Debe tener un metodo setHoraHasta() que devuelva la hora final correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setHoraHasta("19:00")).toBe("19:00");
	}));

	it('Debe tener un metodo setDatosAdicionales() que devuelva los datos adicionales correctamente', inject([NuevaSolicitudModel], (menuItemModel: NuevaSolicitudModelMock) => {
		expect(menuItemModel.setDatosAdicionales("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.")).toBe("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.");
	}));

});