// Referencias de Angular
import { Component, Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

// Modelo principal
import { CiudadModel } from './ciudad.model';

// Mock de la clase CiudadModel
@Injectable()
export class CiudadModelMock extends CiudadModel {
	constructor(){
		super(1, "Ciudad 1");
	}
}

describe('CiudadModel', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: CiudadModel, useClass: CiudadModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getId()', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {
		expect(ciudadModel.getId).toBeDefined();
	}));

	it('Debe tener un metodo getNombre()', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {
		expect(ciudadModel.getNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setId()', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {
		expect(ciudadModel.setId).toBeDefined();
	}));

	it('Debe tener un metodo setNombre()', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {
		expect(ciudadModel.setNombre).toBeDefined();
	}));




	// Tests para asegurar que los metodos get devuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID de la ciudad correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el nombre de la ciudad correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.getNombre()).toBe("Ciudad 1");
	}));



	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setId() que setee el ID de la ciudad correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.setId(2)).toBe(2);
	}));

	it('Debe tener un metodo setId() que setee el nombre de la ciudad correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.setNombre("Ciudad 2")).toBe("Ciudad 2");
	}));

});