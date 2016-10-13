// Referencias de Angular
import { Component, Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

// Modelo principal
import { ItemMenuModel } from './item-menu.model';

// Mock de una pagina
@Component({
  templateUrl: 'build/pages/error/error.html',
})
export class MockPage {
  constructor(public nav: NavController) {}
}

// Mock de la clase ItemMenuModel
@Injectable()
export class ItemMenuModelMock extends ItemMenuModel {
	constructor(){
		super('icono', 'titulo', MockPage, true, true);
	}
}

describe('ItemMenuModel', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: ItemMenuModel, useClass: ItemMenuModelMock}]);



	// Tests para asegurar que los metodos necesarios estan definidos
	// --------------------------------------------------------------
	it('Debe tener un metodo getIconoIosOutline()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoIosOutline).toBeDefined();
	}));

	it('Debe tener un metodo getIconoIos()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoIos).toBeDefined();
	}));

	it('Debe tener un metodo getIconoAndroid()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoAndroid).toBeDefined();
	}));

	it('Debe tener un metodo getTitulo()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getTitulo).toBeDefined();
	}));

	it('Debe tener un metodo getComponente()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getComponente).toBeDefined();
	}));

	it('Debe tener un metodo getEsRoot()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getEsRoot).toBeDefined();
	}));

	it('Debe tener un metodo getRequiereLogin()', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getRequiereLogin).toBeDefined();
	}));

	



	// Tests para asegurar que los metodos devuelven los valores correctamente
	// -----------------------------------------------------------------------
	it('El metodo getIconoIosOutline() debe contener ios- y -outline', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoIosOutline()).toMatch(/ios-icono-outline/);
	}));

	it('El metodo getIconoIos() debe contener ios-', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoIos()).toMatch(/ios-icono/);
	}));

	it('El metodo getIconoAndroid() debe contener md-', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getIconoAndroid()).toMatch(/md-icono/);
	}));

	it('El metodo getTitulo() debe devolver titulo', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getTitulo()).toMatch(/titulo/);
	}));

	it('El metodo getComponente() debe devolver la pagina de error', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(typeof menuItemModel.getComponente()).toEqual(typeof MockPage);
	
	}));

	it('El metodo getEsRoot() debe devolver true', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getEsRoot()).toBe(true);
	}));

	it('El metodo getRequiereLogin() debe devolver true', inject([ItemMenuModel], (menuItemModel: ItemMenuModelMock) => {
		expect(menuItemModel.getRequiereLogin()).toBe(true);
	}));
});