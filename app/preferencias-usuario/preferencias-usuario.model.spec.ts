import { Component, Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { NavController } from 'ionic-angular';

import { PreferenciasUsuarioModel } from './preferencias-usuario.model';
import { ProvinciaModel } from '../shared/models/provincia.model';
import { CiudadModel } from '../shared/models/ciudad.model';
import { GrupoSanguineoModel } from "../shared/models/grupo-sanguineo.model";
import { FactorSanguineoModel } from "../shared/models/factor-sanguineo.model";

// Mock de la clase PreferenciasUsuarioModel
@Injectable()
export class PreferenciasUsuarioModelMock extends PreferenciasUsuarioModel {
	constructor(){

		let preferenciasObj = 	{	"ciudad" : { 
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

		super(preferenciasObj);
	}
}

describe('PreferenciasUsuarioModel', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: PreferenciasUsuarioModel, useClass: PreferenciasUsuarioModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getCiudad()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.getCiudad).toBeDefined();
	}));

	it('Debe tener un metodo getProvincia()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.getProvincia).toBeDefined();
	}));
	
	it('Debe tener un metodo getGrupoSanguineo()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.getGrupoSanguineo).toBeDefined();
	}));
	
	it('Debe tener un metodo getFactorSanguineo()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.getFactorSanguineo).toBeDefined();
	}));





	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setCiudad()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.setCiudad).toBeDefined();
	}));
	
	it('Debe tener un metodo setProvincia()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.setProvincia).toBeDefined();
	}));
	
	it('Debe tener un metodo setGrupoSanguineo()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.setGrupoSanguineo).toBeDefined();
	}));
	
	it('Debe tener un metodo setFactorSanguineo()', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {
		expect(datosUsuarioModel.setFactorSanguineo).toBeDefined();
	}));






	// Tests para asegurar que los metodos get deuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getCiudad() que devuelva la ciudad correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let ciudad = datosUsuarioModel.getCiudad();
		expect(ciudad.getId()).toBe(208);
		expect(ciudad.getNombre()).toBe("Santo Tome");
	}));
	
	it('Debe tener un metodo getProvincia() que devuelva la provincia correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let provincia = datosUsuarioModel.getProvincia();
		expect(provincia.getId()).toBe(21);
		expect(provincia.getNombre()).toBe("Santa Fe");
	}));

	it('Debe tener un metodo getGrupoSanguineo() que devuelva el grupo sanguineo correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let grupoSanguineo = datosUsuarioModel.getGrupoSanguineo();
		expect(grupoSanguineo.getId()).toBe(2);
		expect(grupoSanguineo.getNombre()).toBe("A");
	}));

	it('Debe tener un metodo getFactorSanguineo() que devuelva el factor sanguineo correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let factorSanguineo = datosUsuarioModel.getFactorSanguineo();
		expect(factorSanguineo.getId()).toBe(1);
		expect(factorSanguineo.getNombre()).toBe("RH+");
	}));





	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setCiudad() que setee la ciudad correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {				
		let nuevaCiudad = new CiudadModel(201, "San Carlos");
		datosUsuarioModel.setCiudad(nuevaCiudad);

		let ciudad = datosUsuarioModel.getCiudad();

		expect(ciudad.getId()).toBe(201);
		expect(ciudad.getNombre()).toBe("San Carlos");
	}));
	
	it('Debe tener un metodo setProvincia() que setee la provincia correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let nuevaProvincia = new ProvinciaModel(20, "San Luis");
		datosUsuarioModel.setProvincia(nuevaProvincia);

		let provincia = datosUsuarioModel.getProvincia();

		expect(provincia.getId()).toBe(20);
		expect(provincia.getNombre()).toBe("San Luis");
	}));

	it('Debe tener un metodo setGrupoSanguineo() que setee el grupo sanguineo correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let nuevoGrupoSanguineo = new GrupoSanguineoModel(1, "Cero");
		datosUsuarioModel.setGrupoSanguineo(nuevoGrupoSanguineo);

		let grupoSanguineo = datosUsuarioModel.getGrupoSanguineo();

		expect(grupoSanguineo.getId()).toBe(1);
		expect(grupoSanguineo.getNombre()).toBe("Cero");
	}));

	it('Debe tener un metodo setFactorSanguineo() que setee el factor sanguineo correctamente', inject([PreferenciasUsuarioModel], (datosUsuarioModel: PreferenciasUsuarioModelMock) => {		
		let nuevoFactorSanguineo = new FactorSanguineoModel(2, "RH-");
		datosUsuarioModel.setFactorSanguineo(nuevoFactorSanguineo);

		let factorSanguineo = datosUsuarioModel.getFactorSanguineo();

		expect(factorSanguineo.getId()).toBe(2);
		expect(factorSanguineo.getNombre()).toBe("RH-");
	}));
});