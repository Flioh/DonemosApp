import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { FactorSanguineo, GrupoSanguineo } from '../donemos-helper-service/donemos-helper-service';
import { FactorSanguineoHelper, GrupoSanguineoHelper, DonacionesHelper } from '../donemos-helper-service/donemos-helper-service';

describe('FactorSanguineoEnum', () => {

	var grupoSanguineoMock = FactorSanguineo;

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

	var grupoSanguineoMock = GrupoSanguineo;

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

	let factorSanguineoMock = FactorSanguineo;
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

	it('Debe tener un metodo getFactoresSanguineos()', () => {
		expect(factorSanguineoHelperMock.getFactoresSanguineos).toBeDefined();
	});

	it('Debe tener un metodo getFactoresSanguineos() que devuelva un listado con dos factores sanguineos', () => {
		let listaFactoresSanguineos = factorSanguineoHelperMock.getFactoresSanguineos();
		expect(listaFactoresSanguineos).toBeTruthy();
		expect(listaFactoresSanguineos.length).toBe(2);
	});
});

describe('GrupoSanguineoHelperEnum', () => {

	let grupoSanguineoMock = GrupoSanguineo;
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

	it('Debe tener un metodo getGruposSanguineos()', () => {
		expect(grupoSanguineoHelperMock.getGruposSanguineos).toBeDefined();
	});

	it('Debe tener un metodo getGruposSanguineos() que devuelva un listado con cuatro grupos sanguineos', () => {
		let listaGruposSanguineos = grupoSanguineoHelperMock.getGruposSanguineos();
		expect(listaGruposSanguineos).toBeTruthy();
		expect(listaGruposSanguineos.length).toBe(4);
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
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.A, FactorSanguineo.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo A RH- puede recibir de 0-, A-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.A, FactorSanguineo.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo B RH+ puede recibir de 0+, 0-, B+, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.B, FactorSanguineo.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo B RH- puede recibir de 0-, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.B, FactorSanguineo.RhNegativo);
	
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo AB RH+ puede recibir de A+, A-, 0+, 0-, AB+, AB-, B+, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.AB, FactorSanguineo.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.AB, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.AB, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(8);
	});

	it('Si es del tipo AB RH- puede recibir de A-, 0-, AB-, B-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.AB, FactorSanguineo.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.A, FactorSanguineo.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.AB, FactorSanguineo.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.B, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(4);
	});

	it('Si es del tipo 0 RH+ puede recibir de 0+, 0-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhPositivo)) > -1).toBe(true);		
		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(2);
	});

	it('Si es del tipo 0 RH- puede recibir de 0-', () => {
		let resultado = donacionesHelperMock.puedeRecibirDe(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo);

		expect(resultado.indexOf(DonacionesHelper.getDescripcion(GrupoSanguineo.Cero, FactorSanguineo.RhNegativo)) > -1).toBe(true);

		expect(resultado.length).toBe(1);
	});	
});