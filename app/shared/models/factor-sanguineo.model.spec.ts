// Referencias de Angular
import { Component, Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

// Modelo principal
import { FactorSanguineoModel } from './factor-sanguineo.model';

// Mock de la clase FactorSanguineoModel
@Injectable()
export class FactorSanguineoModelMock extends FactorSanguineoModel {
	constructor(){
		super(1, "Rh+");
	}
}

describe('FactorSanguineoModel', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: FactorSanguineoModel, useClass: FactorSanguineoModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getId()', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {
		expect(factorSanguineoModel.getId).toBeDefined();
	}));

	it('Debe tener un metodo getNombre()', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {
		expect(factorSanguineoModel.getNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setId()', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {
		expect(factorSanguineoModel.setId).toBeDefined();
	}));

	it('Debe tener un metodo setNombre()', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {
		expect(factorSanguineoModel.setNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos get devuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID del factor sanguineo correctamente', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {		
		expect(factorSanguineoModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el nombre del factor sanguineo correctamente', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {		
		expect(factorSanguineoModel.getNombre()).toBe("Rh+");
	}));



	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setId() que setee el ID del factor sanguineo correctamente', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {		
		expect(factorSanguineoModel.setId(2)).toBe(2);
	}));

	it('Debe tener un metodo setId() que setee el nombre del factor sanguineo correctamente', inject([FactorSanguineoModel], (factorSanguineoModel: FactorSanguineoModelMock) => {		
		expect(factorSanguineoModel.setNombre("Rh-")).toBe("Rh-");
	}));

});