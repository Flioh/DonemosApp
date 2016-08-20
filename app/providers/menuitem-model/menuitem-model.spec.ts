import {Injectable} from '@angular/core';
import {beforeEachProviders, beforeEach, it, describe, expect, inject} from '@angular/core/testing';
import {MenuItemModel} from './menuitem-model';

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

// Mock del una pagina
@Component({
  templateUrl: 'build/pages/error/error.html',
})
export class MockPage {
  constructor(public nav: NavController) {}
}

// Mock de la clase MenuItemModel
@Injectable()
export class MenuItemModelMock extends MenuItemModel {
	constructor(){
		super('icono', 'titulo', MockPage);
	}
}

describe('MenuItem Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: MenuItemModel, useClass: MenuItemModelMock}]);

	it('Debe tener un metodo getIconoIosOutline()', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoIosOutline()).toBeDefined();
	}));

	it('El metodo getIconoIosOutline() debe contener ios- y -outline', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoIosOutline()).toMatch(/ios-icono-outline/);
	}));

	it('Debe tener un metodo getIconoIos()', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoIos()).toBeDefined();
	}));

	it('El metodo getIconoIos() debe contener ios-', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoIos()).toMatch(/ios-icono/);
	}));

	it('Debe tener un metodo getIconoAndroid()', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoAndroid()).toBeDefined();
	}));

	it('El metodo getIconoAndroid() debe contener md-', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getIconoAndroid()).toMatch(/md-icono/);
	}));

	it('Debe tener un metodo getTitulo()', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getTitulo()).toBeDefined();
	}));

	it('El metodo getTitulo() debe devolver titulo', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getTitulo()).toMatch(/titulo/);
	}));

	it('Debe tener un metodo getComponente()', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(menuItemModel.getComponente()).toBeDefined();
	}));

	it('El metodo getComponente() debe devolver la pagina de error', inject([MenuItemModel], (menuItemModel: MenuItemModelMock) => {
		expect(typeof menuItemModel.getComponente()).toEqual(typeof MockPage);
	
	}));

});