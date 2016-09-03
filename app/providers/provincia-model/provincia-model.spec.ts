
import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { ProvinciaModel } from './provincia-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase ProvinciaModel
@Injectable()
export class ProvinciaModelMock extends ProvinciaModel {
	constructor(){
		let datosProvinciaMock = { "id" : 1, "nombre": "Provincia 1"};
		super(datosProvinciaMock);
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



	// Tests para asegurar que los metodos get deuelven valores correctamente
	// --------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID de la solicitud correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el ID de la solicitud correctamente', inject([ProvinciaModel], (provinciaModel: ProvinciaModelMock) => {		
		expect(provinciaModel.getNombre()).toBe("Provincia 1");
	}));

});