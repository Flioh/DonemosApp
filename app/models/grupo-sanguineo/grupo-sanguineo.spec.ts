import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { GrupoSanguineoModel } from './grupo-sanguineo';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock de la clase GrupoSanguineoModel
@Injectable()
export class GrupoSanguineoModelMock extends GrupoSanguineoModel {
	constructor(){
		super(1, "Cero");
	}
}

describe('GrupoSanguineo Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: GrupoSanguineoModel, useClass: GrupoSanguineoModelMock}]);



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getId()', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {
		expect(grupoSanguineoModel.getId).toBeDefined();
	}));

	it('Debe tener un metodo getNombre()', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {
		expect(grupoSanguineoModel.getNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos set esta definidos
	// ------------------------------------------------------
	it('Debe tener un metodo setId()', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {
		expect(grupoSanguineoModel.setId).toBeDefined();
	}));

	it('Debe tener un metodo setNombre()', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {
		expect(grupoSanguineoModel.setNombre).toBeDefined();
	}));



	// Tests para asegurar que los metodos get deuelven valores correctamente
	// ----------------------------------------------------------------------
	it('Debe tener un metodo getId() que devuelva el ID del grupo sanguineo correctamente', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {		
		expect(grupoSanguineoModel.getId()).toBe(1);
	}));

	it('Debe tener un metodo getNombre() que devuelva el nombre del grupo sanguineo correctamente', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {		
		expect(grupoSanguineoModel.getNombre()).toBe("Cero");
	}));



	// Tests para asegurar que los metodos set modifican los valores correctamente
	// ---------------------------------------------------------------------------
	it('Debe tener un metodo setId() que setee el ID del grupo sanguineo correctamente', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {		
		expect(grupoSanguineoModel.setId(2)).toBe(2);
	}));

	it('Debe tener un metodo setId() que setee el nombre del grupo sanguineo correctamente', inject([GrupoSanguineoModel], (grupoSanguineoModel: GrupoSanguineoModelMock) => {		
		expect(grupoSanguineoModel.setNombre("A")).toBe("A");
	}));

});