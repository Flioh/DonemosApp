import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { SolicitudModel } from './solicitud-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase SolicitudModel
@Injectable()
export class SolicitudModelMock extends SolicitudModel {

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
			"nombrePaciente": "Nombre Apellido",
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

describe('Solicitud Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: SolicitudModel, useClass: SolicitudModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getSolicitudID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getSolicitudID).toBeDefined();
	}));

	it('Debe tener un metodo getUsuarioID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getUsuarioID).toBeDefined();
	}));

	it('Debe tener un metodo getFechaCreacion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getFechaCreacion).toBeDefined();		
	}));

	it('Debe tener un metodo getEstaVigente()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getEstaVigente).toBeDefined();		
	}));

	it('Debe tener un metodo getProvinciaID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getProvinciaID).toBeDefined();		
	}));

	it('Debe tener un metodo getLocalidadID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getLocalidadID).toBeDefined();		
	}));

	it('Debe tener un metodo getGrupoSanguineoID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getGrupoSanguineoID).toBeDefined();		
	}));

	it('Debe tener un metodo getFactorSanguineoID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getFactorSanguineoID).toBeDefined();
	}));

	it('Debe tener un metodo getCantidadDadores()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getCantidadDadores).toBeDefined();		
	}));

	it('Debe tener un metodo getInstitucion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getInstitucion).toBeDefined();		
	}));

	it('Debe tener un metodo getNombrePaciente()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getNombrePaciente).toBeDefined();		
	}));

	it('Debe tener un metodo getDireccion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getDireccion).toBeDefined();
	}));

	it('Debe tener un metodo getHoraDesde()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getHoraDesde).toBeDefined();		
	}));

	it('Debe tener un metodo getHoraHasta()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getHoraHasta).toBeDefined();		
	}));

	it('Debe tener un metodo getDatosAdicionales()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getDatosAdicionales).toBeDefined();		
	}));



	// Tests para asegurar que los metodos get deuelven valores correctamente
	// --------------------------------------------------------
	it('Debe tener un metodo getSolicitudID() que devuelva el ID de la solicitud correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {		
		expect(solicitudModel.getSolicitudID()).toBe(1);
	}));

	it('Debe tener un metodo getUsuarioID() que devuelva el ID del usuario correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getUsuarioID()).toBe(2);
	}));

	it('Debe tener un metodo getFechaCreacion() que devuelva la fecha de creacion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getFechaCreacion()).toBe("12/03/2016");
	}));

	it('Debe tener un metodo getEstaVigente() que devuelva si esta vigente correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getEstaVigente()).toBe(true);
	}));

	it('Debe tener un metodo getProvinciaID() que devuelva el ID de la provincia correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getProvinciaID()).toBe(3);
	}));

	it('Debe tener un metodo getLocalidadID() que devuelva el ID de la localidad correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getLocalidadID()).toBe(4);
	}));

	it('Debe tener un metodo getGrupoSanguineoID() que devuelva el ID del grupo sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getGrupoSanguineoID()).toBe(5);
	}));

	it('Debe tener un metodo getFactorSanguineoID() que devuelva el ID del factor sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getFactorSanguineoID()).toBe(6);
	}));

	it('Debe tener un metodo getCantidadDadores() que devuelva la cantidad de dadores correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getCantidadDadores()).toBe(7);
	}));

	it('Debe tener un metodo getInstitucion() que devuelva el la institucion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getInstitucion()).toBe("Sanatorio Mayo");
	}));

	it('Debe tener un metodo getNombrePaciente() que devuelva el la institucion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getNombrePaciente()).toBe("Nombre Apellido");
	}));

	it('Debe tener un metodo getDireccion() que devuelva la direccion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getDireccion()).toBe("Rivadavia 2345");
	}));

	it('Debe tener un metodo getHoraDesde() que devuelva la hora inicial correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getHoraDesde()).toBe("08:00");
	}));

	it('Debe tener un metodo getHoraHasta() que devuelva la hora final correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getHoraHasta()).toBe("18:00");
	}));

	it('Debe tener un metodo getDatosAdicionales() que devuelva los datos adicionales correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getDatosAdicionales()).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
	}));



	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setSolicitudID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setSolicitudID).toBeDefined();
	}));

	it('Debe tener un metodo setUsuarioID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setUsuarioID).toBeDefined();
	}));

	it('Debe tener un metodo setFechaCreacion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setFechaCreacion).toBeDefined();		
	}));

	it('Debe tener un metodo setEstaVigente()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setEstaVigente).toBeDefined();		
	}));

	it('Debe tener un metodo setProvinciaID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setProvinciaID).toBeDefined();		
	}));

	it('Debe tener un metodo setLocalidadID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setLocalidadID).toBeDefined();		
	}));

	it('Debe tener un metodo setGrupoSanguineoID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setGrupoSanguineoID).toBeDefined();		
	}));

	it('Debe tener un metodo setFactorSanguineoID()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setFactorSanguineoID).toBeDefined();
	}));

	it('Debe tener un metodo setCantidadDadores()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setCantidadDadores).toBeDefined();		
	}));

	it('Debe tener un metodo setInstitucion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setInstitucion).toBeDefined();		
	}));

	it('Debe tener un metodo setNombrePaciente()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setNombrePaciente).toBeDefined();		
	}));

	it('Debe tener un metodo setDireccion()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setDireccion).toBeDefined();
	}));

	it('Debe tener un metodo setHoraDesde()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setHoraDesde).toBeDefined();		
	}));

	it('Debe tener un metodo setHoraHasta()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setHoraHasta).toBeDefined();		
	}));

	it('Debe tener un metodo setDatosAdicionales()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setDatosAdicionales).toBeDefined();		
	}));



	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setSolicitudID() que setee el ID de la solicitud correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {		
		expect(solicitudModel.setSolicitudID(2)).toBe(2);
	}));

	it('Debe tener un metodo setUsuarioID() que setee el ID del usuario correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setUsuarioID(3)).toBe(3);
	}));

	it('Debe tener un metodo setFechaCreacion() que setee la fecha de creacion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let nuevaFecha = new Date();
		expect(solicitudModel.setFechaCreacion(nuevaFecha)).toBe(nuevaFecha);
	}));

	it('Debe tener un metodo setEstaVigente() que setee si esta vigente correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setEstaVigente(false)).toBe(false);
	}));

	it('Debe tener un metodo setProvinciaID() que setee el ID de la provincia correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setProvinciaID(4)).toBe(4);
	}));

	it('Debe tener un metodo setLocalidadID() que setee el ID de la localidad correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setLocalidadID(5)).toBe(5);
	}));

	it('Debe tener un metodo setGrupoSanguineoID() que setee el ID del grupo sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setGrupoSanguineoID(6)).toBe(6);
	}));

	it('Debe tener un metodo setFactorSanguineoID() que setee el ID del factor sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setFactorSanguineoID(7)).toBe(7);
	}));

	it('Debe tener un metodo setCantidadDadores() que setee la cantidad de dadores correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setCantidadDadores(8)).toBe(8);
	}));

	it('Debe tener un metodo setInstitucion() que setee la institucion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setInstitucion("Sanatorio Garay")).toBe("Sanatorio Garay");
	}));

	it('Debe tener un metodo setNombrePaciente() que setee el nombre del paciente correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setNombrePaciente("NuevoNombre NuevoApellido")).toBe("NuevoNombre NuevoApellido");
	}));

	it('Debe tener un metodo setDireccion() que setee la direccion correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setDireccion("Junin 1234")).toBe("Junin 1234");
	}));

	it('Debe tener un metodo setHoraDesde() que setee la hora inicial correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setHoraDesde("09:00")).toBe("09:00");
	}));

	it('Debe tener un metodo setHoraHasta() que setee la hora final correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setHoraHasta("19:00")).toBe("19:00");
	}));

	it('Debe tener un metodo setDatosAdicionales() que setee los datos adicionales correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setDatosAdicionales("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.")).toBe("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.");
	}));

});