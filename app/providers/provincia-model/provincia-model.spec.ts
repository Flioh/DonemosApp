
import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { ProvinciaModel } from './provincia-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase ProvinciaModel
@Injectable()
export class ProvinciaModelMock extends ProvinciaModel {
	constructor(){
		super(1, "Provincia 1");
	}
}

describe('Provincia Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: ProvinciaModel, useClass: ProvinciaModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getId()', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {
		expect(provinciaModel.getId).toBeDefined();
	}));

	it('Debe tener un metodo getNombre()', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {
		expect(provinciaModel.getNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setId()', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {
		expect(provinciaModel.setId).toBeDefined();
	}));

	it('Debe tener un metodo setNombre()', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {
		expect(provinciaModel.setNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos get deuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID de la provincia correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el nombre de la provincia correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.getNombre()).toBe("Provincia 1");
	}));



	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setId() que setee el ID de la provincia correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.setId(2)).toBe(2);
	}));

	it('Debe tener un metodo setId() que setee el nombre de la provincia correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.setNombre("Provincia 2")).toBe("Provincia 2");
	}));

});