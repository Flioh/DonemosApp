import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../donaciones-service/donaciones-service';
import { FactorSanguineoHelper, GrupoSanguineoHelper, DonacionesHelper } from '../donaciones-service/donaciones-service';

describe('FactorSanguineoEnum', () => {

	var grupoSanguineoMock = FactorSanguineoEnum;

	it('Debe existir un enumerado con los factores sanguineos', () => {
		expect(grupoSanguineoMock).toBeDefined();
	});

	it('Debe contener el factor sanguineo RH+', () => {
		expect(grupoSanguineoMock.RhPositivo).toBeDefined();
	});

	it('Debe contener el factor sanguineo RH-', () => {
		expect(grupoSanguineoMock.RhNegativo).toBeDefined();
	});

	it('Debe contener dos factores sanguineos con diferente ID', () => {
		let factorRHPositivoId = grupoSanguineoMock.RhPositivo;
		let factorRHNegativoId = grupoSanguineoMock.RhNegativo;
		expect(factorRHNegativoId != factorRHPositivoId).toBe(true);
	});
});

describe ('GrupoSanguineoEnum', () => {

	var grupoSanguineoMock = GrupoSanguineoEnum;

	it('Debe existir un enumerado con los grupos sanguineos', () => {
		expect(grupoSanguineoMock).toBeDefined();
	});

	it('Debe contener el grupo sanguineo Cero', () => {
		expect(grupoSanguineoMock.Cero).toBeDefined();
	});

	it('Debe contener el grupo sanguineo A', () => {
		expect(grupoSanguineoMock.A).toBeDefined();
	});

	it('Debe contener el grupo sanguineo AB', () => {
		expect(grupoSanguineoMock.AB).toBeDefined();
	});

	it('Debe contener el grupo sanguineo B', () => {
		expect(grupoSanguineoMock.B).toBeDefined();
	});

	it('Debe contener cuatro grupos sanguineos con diferente ID', () => {
		let grupoSanguineoCeroID = grupoSanguineoMock.Cero;
		let grupoSanguineoAID = grupoSanguineoMock.A;
		let grupoSanguineoABID = grupoSanguineoMock.AB;
		let grupoSanguineoBID = grupoSanguineoMock.B;

		expect(grupoSanguineoCeroID != grupoSanguineoAID
			&& grupoSanguineoCeroID != grupoSanguineoABID
			&& grupoSanguineoCeroID != grupoSanguineoBID
			&& grupoSanguineoAID != grupoSanguineoABID
			&& grupoSanguineoAID != grupoSanguineoBID
			&& grupoSanguineoABID != grupoSanguineoBID).toBe(true)
	});
});

describe('FactorSanguineoHelperEnum', () => {

	let factorSanguineoMock = FactorSanguineoEnum;
	let factorSanguineoHelperMock = FactorSanguineoHelper;

	it('Debe estar definido', () => {
		expect(factorSanguineoHelperMock).toBeDefined();
	});

	it('Debe tener un metodo getDescripcion()', () => {
		expect(factorSanguineoHelperMock.getDescripcion).toBeDefined();
	});

	it('Debe tener un metodo getDescripcion() que devuelva la descripcion del factor sanguineo correctamente', () => {
		expect(factorSanguineoHelperMock.getDescripcion(factorSanguineoMock.RhNegativo)).toBeTruthy();
		expect(factorSanguineoHelperMock.getDescripcion(factorSanguineoMock.RhPositivo)).toBeTruthy();
	});

	it('Debe tener un metodo getAbreviacion()', () => {
		expect(factorSanguineoHelperMock.getAbreviacion).toBeDefined();
	});

	it('Debe tener un metodo getAbreviacion() que devuelva la abreviacion del factor sanguineo correctamente', () => {
		expect(factorSanguineoHelperMock.getAbreviacion(factorSanguineoMock.RhNegativo)).toBeTruthy();
		expect(factorSanguineoHelperMock.getAbreviacion(factorSanguineoMock.RhPositivo)).toBeTruthy();
	});
});

describe('GrupoSanguineoHelperEnum', () => {

	let grupoSanguineoMock = GrupoSanguineoEnum;
	let grupoSanguineoHelperMock = GrupoSanguineoHelper;

	it('Debe estar definido', () => {
		expect(grupoSanguineoHelperMock).toBeDefined();
	});

	it('Debe tener un metodo getDescripcion()', () => {
		expect(grupoSanguineoHelperMock.getDescripcion).toBeDefined();
	});

	it('Debe tener un metodo getDescripcion() que devuelva la descripcion del grupo sanguineo correctamente', () => {
		expect(grupoSanguineoHelperMock.getDescripcion(grupoSanguineoMock.Cero)).toBeTruthy();
		expect(grupoSanguineoHelperMock.getDescripcion(grupoSanguineoMock.A)).toBeTruthy();
		expect(grupoSanguineoHelperMock.getDescripcion(grupoSanguineoMock.AB)).toBeTruthy();
		expect(grupoSanguineoHelperMock.getDescripcion(grupoSanguineoMock.B)).toBeTruthy();
	});
});

describe('DonacionesHelper', () => {

	let donacionesHelperMock = DonacionesHelper;

	it('Debe estar definido', () => {
		expect(donacionesHelperMock).toBeDefined();
	});

	it('Debe tener un metodo getDescripcion()', () => {
		expect(donacionesHelperMock.getDescripcion).toBeDefined();
	});

	it('Debe tener un metodo puedeDonarA()', () => {
		expect(donacionesHelperMock.puedeDonarA).toBeDefined();
	});

	it('Debe tener un metodo puedeRecibirDe()', () => {
		expect(donacionesHelperMock.puedeRecibirDe).toBeDefined();
	});

	it('Si es del tipo A RH+ puede recibir de 0+, 0-, A+, A-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo A RH- puede recibir de 0-, A-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo B RH+ puede recibir de 0+, 0-, B+, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo B RH- puede recibir de 0-, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo);
	
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo AB RH+ puede recibir de A+, A-, 0+, 0-, AB+, AB-, B+, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(8);
	});

	it('Si es del tipo AB RH- puede recibir de A-, 0-, AB-, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo 0 RH+ puede recibir de 0+, 0-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo 0 RH- puede recibir de 0-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(1);
	});	
});