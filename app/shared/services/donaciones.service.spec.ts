// Referencias de Angular
import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Servicio principal
import { DonacionesService, FactorSanguineoEnum, GrupoSanguineoEnum } from '../services/donaciones.service';

// Tests relacionados con el enumerado de factores sanguineos
// ----------------------------------------------------------
describe('FactorSanguineoEnum', () => {
	
	it('Debe estar definido', () => {
		expect(FactorSanguineoEnum).toBeDefined();
	});

	it('Debe contener el factor sanguineo RH+', () => {
		expect(FactorSanguineoEnum.RhPositivo).toBeDefined();
	});

	it('Debe contener el factor sanguineo RH-', () => {
		expect(FactorSanguineoEnum.RhNegativo).toBeDefined();
	});

	it('Debe contener factores sanguineos con diferentes ID', () => {
		let factorRHPositivoId = FactorSanguineoEnum.RhPositivo;
		let factorRHNegativoId = FactorSanguineoEnum.RhNegativo;
		expect(factorRHNegativoId != factorRHPositivoId).toBe(true);
	});
});



// Tests relacionados con el enumerado de grupos sanguineos
// ----------------------------------------------------------
describe('GrupoSanguineoEnum', () => {

	it('Debe estar definido', () => {
		expect(GrupoSanguineoEnum).toBeDefined();
	});

	it('Debe contener el grupo sanguineo Cero', () => {
		expect(GrupoSanguineoEnum.Cero).toBeDefined();
	});

	it('Debe contener el grupo sanguineo A', () => {
		expect(GrupoSanguineoEnum.A).toBeDefined();
	});

	it('Debe contener el grupo sanguineo AB', () => {
		expect(GrupoSanguineoEnum.AB).toBeDefined();
	});

	it('Debe contener el grupo sanguineo B', () => {
		expect(GrupoSanguineoEnum.B).toBeDefined();
	});

	it('Debe contener grupos sanguineos con diferentes ID', () => {
		let grupoSanguineoCeroID = GrupoSanguineoEnum.Cero;
		let grupoSanguineoAID = GrupoSanguineoEnum.A;
		let grupoSanguineoABID = GrupoSanguineoEnum.AB;
		let grupoSanguineoBID = GrupoSanguineoEnum.B;

		expect(grupoSanguineoCeroID != grupoSanguineoAID
			&& grupoSanguineoCeroID != grupoSanguineoABID
			&& grupoSanguineoCeroID != grupoSanguineoBID
			&& grupoSanguineoAID != grupoSanguineoABID
			&& grupoSanguineoAID != grupoSanguineoBID
			&& grupoSanguineoABID != grupoSanguineoBID).toBe(true)
	});
});



// Tests relacionados con el servicio a testear
// ----------------------------------------------------------
describe('DonacionesService', () => {

	// Inicializamos el injector
	beforeEachProviders(() => [DonacionesService]);


	// Tests para asegurar que los metodos estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo getDescripcionFactorSanguineo()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getDescripcionFactorSanguineo).toBeDefined();
	}));

	it('Debe tener un metodo getAbreviacionFactorSanguineo()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getAbreviacionFactorSanguineo).toBeDefined();
	}));

	it('Debe tener un metodo getDescripcionCompleta()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getDescripcionGrupoSanguineo).toBeDefined();
	}));

	it('Debe tener un metodo getDescripcionCompleta()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getDescripcionCompleta).toBeDefined();
	}));

	it('Debe tener un metodo puedeDonarA()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.puedeDonarA).toBeDefined();
	}));

	it('Debe tener un metodo puedeRecibirDe()', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.puedeRecibirDe).toBeDefined();
	}));



	// Tests para asegurar que los metodos devuelven los valores correctos
	// -------------------------------------------------------------------
	it('Debe tener un metodo getDescripcionCompleta() que devuelva la descripcion del factor sanguineo correctamente', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhNegativo)).toBeTruthy();
		expect(donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)).toBeTruthy();
	}));

	it('Debe tener un metodo getAbreviacionFactorSanguineo() que devuelva la abreviacion del factor sanguineo correctamente', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getAbreviacionFactorSanguineo(FactorSanguineoEnum.RhNegativo)).toBeTruthy();
		expect(donacionesService.getAbreviacionFactorSanguineo(FactorSanguineoEnum.RhPositivo)).toBeTruthy();
	}));

	it('Debe tener un metodo getDescripcionGrupoSanguineo() que devuelva la descripcion del grupo sanguineo correctamente', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.Cero)).toBeTruthy();
		expect(donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)).toBeTruthy();
		expect(donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.AB)).toBeTruthy();
		expect(donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.B)).toBeTruthy();
	}));

	it('Si es del tipo A RH+ puede recibir de 0+, 0-, A+, A-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo);
		expect(resultado.length).toBe(4);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
	}));

	it('Si es del tipo A RH- puede recibir de 0-, A-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo);
		expect(resultado.length).toBe(2);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo B RH+ puede recibir de 0+, 0-, B+, B-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo);
		expect(resultado.length).toBe(4);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo B RH- puede recibir de 0-, B-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo);
		expect(resultado.length).toBe(2);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo AB RH+ puede recibir de A+, A-, 0+, 0-, AB+, AB-, B+, B-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhPositivo);
		expect(resultado.length).toBe(8);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo AB RH- puede recibir de A-, 0-, AB-, B-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo);
		expect(resultado.length).toBe(4);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.A, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.AB, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);		
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo 0 RH+ puede recibir de 0+, 0-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo);
		expect(resultado.length).toBe(2);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)) > -1).toBe(true);		
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Si es del tipo 0 RH- puede recibir de 0-', inject([DonacionesService], (donacionesService) => {
		let resultado = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo);
		expect(resultado.length).toBe(1);
		expect(resultado.indexOf(donacionesService.getDescripcionCompleta(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhNegativo)) > -1).toBe(true);
	}));

	it('Debe tener un metodo puedeDonarA() que aun no este implementado', inject([DonacionesService], (donacionesService) => {
		expect(donacionesService.puedeDonarA(GrupoSanguineoEnum.Cero, FactorSanguineoEnum.RhPositivo)).toBe('test');
	}));
});