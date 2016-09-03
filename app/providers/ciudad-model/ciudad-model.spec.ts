
import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { CiudadModel } from './ciudad-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase CiudadModel
@Injectable()
export class CiudadModelMock extends CiudadModel {
	constructor(){
		let datosCiudadMock = { "id" : 1, "nombre": "Ciudad 1", "provinciaID": 2};
		super(datosCiudadMock);
	}
}

describe('Ciudad Model', () => {

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

	it('Debe tener un metodo getProvinciaID()', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {
		expect(ciudadModel.getProvinciaID).toBeDefined();
	}));


	// Tests para asegurar que los metodos get deuelven valores correctamente
	// --------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID de la solicitud correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el ID de la solicitud correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.getNombre()).toBe("Ciudad 1");
	}));

	it('Debe tener un metodo getProvinciaID() que devuelva el ID de la solicitud correctamente', inject([CiudadModel], (ciudadModel: CiudadModelMock) => {		
		expect(ciudadModel.getProvinciaID()).toBe(2);
	}));

});