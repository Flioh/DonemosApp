import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

/* Modelos usados en los tests */
import { SolicitudModel } from './solicitud-model';
import { CiudadModel } from '../ciudad-model/ciudad-model';
import { ProvinciaModel } from '../provincia-model/provincia-model';
import { FactorSanguineoModel } from '../factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../grupo-sanguineo-model/grupo-sanguineo-model';

/* Helpers */
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../donemos-helper-service/donemos-helper-service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../donemos-helper-service/donemos-helper-service';

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
			"provincia" : new ProvinciaModel(1, "Provincia 1"),
			"ciudad" : new CiudadModel(1, "Ciudad 1"),
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhPositivo)),
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

	it('Debe tener un metodo getProvincia()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getProvincia).toBeDefined();		
	}));

	it('Debe tener un metodo getCiudad()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getCiudad).toBeDefined();		
	}));

	it('Debe tener un metodo getGrupoSanguineo()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getGrupoSanguineo).toBeDefined();		
	}));

	it('Debe tener un metodo getFactorSanguineo()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.getFactorSanguineo).toBeDefined();
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

	it('Debe tener un metodo getProvincia() que devuelva el ID de la provincia correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let provincia = solicitudModel.getProvincia();

		expect(provincia.getId()).toBe(1);
		expect(provincia.getNombre()).toBe("Provincia 1");
	}));

	it('Debe tener un metodo getCiudad() que devuelva el ID de la localidad correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let ciudad = solicitudModel.getCiudad();

		expect(ciudad.getId()).toBe(1);
		expect(ciudad.getNombre()).toBe("Ciudad 1");
	}));

	it('Debe tener un metodo getGrupoSanguineo() que devuelva el grupo sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let grupoSanguineo = solicitudModel.getGrupoSanguineo();
		expect(grupoSanguineo.getId()).toBe(GrupoSanguineoEnum.A);
		expect(grupoSanguineo.getNombre()).toBe(GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.A));
	}));

	it('Debe tener un metodo getFactorSanguineo() que devuelva el factor sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let factorSanguineo = solicitudModel.getFactorSanguineo();
		expect(factorSanguineo.getId()).toBe(FactorSanguineoEnum.RhPositivo);
		expect(factorSanguineo.getNombre()).toBe(FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhPositivo));
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

	it('Debe tener un metodo setProvincia()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setProvincia).toBeDefined();		
	}));

	it('Debe tener un metodo setCiudad()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setCiudad).toBeDefined();		
	}));

	it('Debe tener un metodo setGrupoSanguineo()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setGrupoSanguineo).toBeDefined();		
	}));

	it('Debe tener un metodo setFactorSanguineo()', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		expect(solicitudModel.setFactorSanguineo).toBeDefined();
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

	it('Debe tener un metodo setProvincia() que setee la ciudad de la provincia correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let nuevaProvincia = new ProvinciaModel(2, "Ciudad 2");
		solicitudModel.setProvincia(nuevaProvincia);

		expect(solicitudModel.getProvincia().getId()).toBe(2);
		expect(solicitudModel.getProvincia().getNombre()).toBe("Ciudad 2");
	}));

	it('Debe tener un metodo setLocalidadID() que setee la provincia de la localidad correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let nuevaCiudad = new CiudadModel(2, "Ciudad 2");
		solicitudModel.setCiudad(nuevaCiudad);

		expect(solicitudModel.getCiudad().getId()).toBe(2);
		expect(solicitudModel.getCiudad().getNombre()).toBe("Ciudad 2");
	}));

	it('Debe tener un metodo setGrupoSanguineo() que setee el grupo sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let nuevoGrupoSanguineo = new GrupoSanguineoModel(GrupoSanguineoEnum.B, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.B));
		solicitudModel.setGrupoSanguineo(nuevoGrupoSanguineo);
		
		expect(solicitudModel.getGrupoSanguineo().getId()).toBe(GrupoSanguineoEnum.B);
		expect(solicitudModel.getGrupoSanguineo().getNombre()).toBe(GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.B));
	}));

	it('Debe tener un metodo setFactorSanguineo() que setee el factor sanguineo correctamente', inject([SolicitudModel], (solicitudModel: SolicitudModelMock) => {
		let nuevoFactorSanguineo = new FactorSanguineoModel(FactorSanguineoEnum.RhNegativo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhNegativo));
		solicitudModel.setFactorSanguineo(nuevoFactorSanguineo);
		
		expect(solicitudModel.getFactorSanguineo().getId()).toBe(FactorSanguineoEnum.RhNegativo);
		expect(solicitudModel.getFactorSanguineo().getNombre()).toBe(FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhNegativo));
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