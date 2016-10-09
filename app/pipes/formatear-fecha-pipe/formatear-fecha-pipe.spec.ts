import { FormatearFechaPipe } from './formatear-fecha-pipe';
import {beforeEachProviders, beforeEach, it, describe, expect, inject} from '@angular/core/testing';

describe('FormatearFechaPipe', () => {

	let timeAgoPipeMock: FormatearFechaPipe = new FormatearFechaPipe();

	it('Debe estar definido', () => {
		expect(timeAgoPipeMock).toBeDefined();
	});



	/* Tests de "Ahora" */
	it('Debe retornar "Ahora" si la fecha de la solicitud es igual a la fecha actual', () => {
		let date = new Date();

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Ahora'.toLowerCase());
	});	

	it('Debe retornar "Ahora" si la fecha de la solicitud es de hace 9 segundos', () => {
		let date = new Date();

		// Resta 9 segundos a la fecha actual
		date.setSeconds(date.getSeconds() - 9);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Ahora'.toLowerCase());
	});



	/* Tests de "Hace ... segundos" */
	it('Debe retornar "Hace 10 segundos" si la fecha de la solicitud es de hace 10 segundos', () => {
		let date = new Date();

		// Resta 59 segundos a la fecha actual
		date.setSeconds(date.getSeconds() - 10);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 10 segundos'.toLowerCase());
	});

	it('Debe retornar "Hace 59 segundos" si la fecha de la solicitud es de hace 59 segundos', () => {
		let date = new Date();

		// Resta 59 segundos a la fecha actual
		date.setSeconds(date.getSeconds() - 59);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 59 segundos'.toLowerCase());
	});



	/* Tests de "Hace ... minutos" */
	it('Debe retornar "Hace 1 minuto" si la fecha de la solicitud es de hace un minuto', () => {
		let date = new Date();

		// Resta 1 minuto la fecha actual
		date.setMinutes(date.getMinutes() - 1);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 1 minuto'.toLowerCase());
	});

	it('Debe retornar "Hace 59 minutos" si la fecha de la solicitud es de hace 59 minutos', () => {
		let date = new Date();

		// Resta 59 minutos a la fecha actual
		date.setMinutes(date.getMinutes() - 59);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 59 minutos'.toLowerCase());
	});




	/* Tests de "Hace ... horas" */
	it('Debe retornar "Hace 1 hora" si la fecha de la solicitud es de hace una hora', () => {
		let date = new Date();

		// Resta 1 hora la fecha actual
		date.setHours(date.getHours() - 1);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 1 hora'.toLowerCase());
	});

	it('Debe retornar "Hace 23 horas" si la fecha de la solicitud es de hace 23 horas', () => {
		let date = new Date();

		// Resta 23 horas la fecha actual
		date.setHours(date.getHours() - 23);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 23 horas'.toLowerCase());
	});



	/* Tests de "Hace ... dias" */
	it('Debe retornar "Hace 1 dia" si la fecha de la solicitud es de hace un dia', () => {
		let date = new Date();

		// Resta 1 dia la fecha actual
		date.setDate(date.getDate() - 1);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 1 dia'.toLowerCase());
	});

	it('Debe retornar "Hace 6 dias" si la fecha de la solicitud es de hace 6 dias', () => {
		let date = new Date();

		// Resta 6 dias la fecha actual
		date.setDate(date.getDate() - 6);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 6 dias'.toLowerCase());
	});



	/* Tests de "Hace ... semanas" */
	it('Debe retornar "Hace 1 semana" si la fecha de la solicitud es de hace 7 dias', () => {
		let date = new Date();

		// Resta 7 dias la fecha actual
		date.setDate(date.getDate() - 7);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 1 semana'.toLowerCase());
	});

	it('Debe retornar "Hace 3 semanas" si la fecha de la solicitud es de hace 21 dias', () => {
		let date = new Date();

		// Resta 7 dias la fecha actual
		date.setDate(date.getDate() - 21);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 3 semanas'.toLowerCase());
	});

	it('Debe retornar "Hace 4 semanas" si la fecha de la solicitud es de hace 29 dias', () => {
		let date = new Date();

		// Resta 7 dias la fecha actual
		date.setDate(date.getDate() - 29);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 4 semanas'.toLowerCase());
	});



	/* Tests de "Hace ... semanas" */
	it('Debe retornar "Hace 1 mes" si la fecha de la solicitud es de hace un mes', () => {
		let date = new Date();

		// Resta 1 mes a la fecha actual
		date.setMonth(date.getMonth() - 1);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 1 mes'.toLowerCase());
	});

	it('Debe retornar "Hace 5 meses" si la fecha de la solicitud es de hace 5 meses', () => {
		let date = new Date();

		// Resta 5 meses a la fecha actual
		date.setMonth(date.getMonth() - 5);

		let resultado = timeAgoPipeMock.transform(date, []);
		expect(resultado.toString().toLowerCase()).toBe('Hace 5 meses'.toLowerCase());
	});

});

