import { Component, Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import {NavController} from 'ionic-angular';

import { DatosPersonalesModel } from './datos-personales-model';
import { ProvinciaModel } from '../../models/provincia-model/provincia-model';
import { CiudadModel } from '../../models/ciudad-model/ciudad-model';
import { GrupoSanguineoModel } from "../../models/grupo-sanguineo-model/grupo-sanguineo-model";
import { FactorSanguineoModel } from "../../models/factor-sanguineo-model/factor-sanguineo-model";

// Mock de la clase DatosPersonalesModel
@Injectable()
export class DatosPersonalesModelMock extends DatosPersonalesModel {
	constructor(){

		let datosUsuarioObj = {	"ciudad" : { 
									"id": 208, 
									"nombre": "Santo Tome"
								},
								"provincia" : {
									"id" : 21, 
									"nombre": "Santa Fe"
								},
								"grupoSanguineo" : {
									"id": 2, 
									"nombre": "A"		
								},
								"factorSanguineo" : {
									"id": 1, 
									"nombre": "RH+"
								}
							};

		super(datosUsuarioObj);
	}
}

describe('DatosUsuario Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: DatosPersonalesModel, useClass: DatosPersonalesModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getCiudad()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.getCiudad).toBeDefined();
	}));

	it('Debe tener un metodo getProvincia()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.getProvincia).toBeDefined();
	}));
	
	it('Debe tener un metodo getGrupoSanguineo()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.getGrupoSanguineo).toBeDefined();
	}));
	
	it('Debe tener un metodo getFactorSanguineo()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.getFactorSanguineo).toBeDefined();
	}));





	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setCiudad()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.setCiudad).toBeDefined();
	}));
	
	it('Debe tener un metodo setProvincia()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.setProvincia).toBeDefined();
	}));
	
	it('Debe tener un metodo setGrupoSanguineo()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.setGrupoSanguineo).toBeDefined();
	}));
	
	it('Debe tener un metodo setFactorSanguineo()', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {
		expect(datosUsuarioModel.setFactorSanguineo).toBeDefined();
	}));






	// Tests para asegurar que los metodos get deuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getCiudad() que devuelva la ciudad correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let ciudad = datosUsuarioModel.getCiudad();
		expect(ciudad.getId()).toBe(208);
		expect(ciudad.getNombre()).toBe("Santo Tome");
	}));
	
	it('Debe tener un metodo getProvincia() que devuelva la provincia correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let provincia = datosUsuarioModel.getProvincia();
		expect(provincia.getId()).toBe(21);
		expect(provincia.getNombre()).toBe("Santa Fe");
	}));

	it('Debe tener un metodo getGrupoSanguineo() que devuelva el grupo sanguineo correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let grupoSanguineo = datosUsuarioModel.getGrupoSanguineo();
		expect(grupoSanguineo.getId()).toBe(2);
		expect(grupoSanguineo.getNombre()).toBe("A");
	}));

	it('Debe tener un metodo getFactorSanguineo() que devuelva el factor sanguineo correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let factorSanguineo = datosUsuarioModel.getFactorSanguineo();
		expect(factorSanguineo.getId()).toBe(1);
		expect(factorSanguineo.getNombre()).toBe("RH+");
	}));





	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setCiudad() que setee la ciudad correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {				
		let nuevaCiudad = new CiudadModel(201, "San Carlos");
		datosUsuarioModel.setCiudad(nuevaCiudad);

		let ciudad = datosUsuarioModel.getCiudad();

		expect(ciudad.getId()).toBe(201);
		expect(ciudad.getNombre()).toBe("San Carlos");
	}));
	
	it('Debe tener un metodo setProvincia() que setee la provincia correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let nuevaProvincia = new ProvinciaModel(20, "San Luis");
		datosUsuarioModel.setProvincia(nuevaProvincia);

		let provincia = datosUsuarioModel.getProvincia();

		expect(provincia.getId()).toBe(20);
		expect(provincia.getNombre()).toBe("San Luis");
	}));

	it('Debe tener un metodo setGrupoSanguineo() que setee el grupo sanguineo correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let nuevoGrupoSanguineo = new GrupoSanguineoModel(1, "Cero");
		datosUsuarioModel.setGrupoSanguineo(nuevoGrupoSanguineo);

		let grupoSanguineo = datosUsuarioModel.getGrupoSanguineo();

		expect(grupoSanguineo.getId()).toBe(1);
		expect(grupoSanguineo.getNombre()).toBe("Cero");
	}));

	it('Debe tener un metodo setFactorSanguineo() que setee el factor sanguineo correctamente', inject([DatosPersonalesModel], (datosUsuarioModel: DatosPersonalesModelMock) => {		
		let nuevoFactorSanguineo = new FactorSanguineoModel(2, "RH-");
		datosUsuarioModel.setFactorSanguineo(nuevoFactorSanguineo);

		let factorSanguineo = datosUsuarioModel.getFactorSanguineo();

		expect(factorSanguineo.getId()).toBe(2);
		expect(factorSanguineo.getNombre()).toBe("RH-");
	}));
});