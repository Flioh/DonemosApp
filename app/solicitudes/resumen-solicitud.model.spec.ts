// Referencias de Angular
import { Injectable, Component } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { NavController } from 'ionic-angular';

// Modelos
import { SolicitudModel } from './solicitud.model';
import { ResumenSolicitudModel } from '../solicitudes/resumen-solicitud.model';
import { CiudadModel } from '../shared/models/ciudad.model';
import { ProvinciaModel } from '../shared/models/provincia.model';
import { FactorSanguineoModel } from '../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../shared/models/grupo-sanguineo.model';

// Servicios
import { DonacionesService } from '../shared/services/donaciones.service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../shared/services/donaciones.service';

// Servicio usado para crear los mocks
let donacionesService = new DonacionesService();

// Mock de una pagina
@Component({
  templateUrl: 'build/pages/error/error.html',
})
export class MockPage {
  constructor(public nav: NavController) {}
}

// Mock de la clase ResumenSolicitudModel
@Injectable()
export class ResumenSolicitudModelMock extends ResumenSolicitudModel {
	constructor(){

		let datosSolicitudMock = { 
			"solicitudID" : 1,
			"usuarioID": 2,
			"fechaCreacion": "12/03/2016",
			"estaVigente" : true,
			"provincia" : new ProvinciaModel(1, "Provincia 1"),
			"ciudad" : new CiudadModel(1, "Ciudad 1"),
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, donacionesService.getDescripcionGrupoSanguineo(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, donacionesService.getDescripcionFactorSanguineo(FactorSanguineoEnum.RhPositivo)),
			"nombrePaciente": "Nombre Apellido",
			"cantidadDadores" : 7,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		};

		let nuevaSolicitud = new SolicitudModel(datosSolicitudMock);

		super(nuevaSolicitud, donacionesService.puedeRecibirDe(nuevaSolicitud.getGrupoSanguineo().getId(), 
                                                			  nuevaSolicitud.getFactorSanguineo().getId()).join(' '));
	}
}

describe('SolicitudItem Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: ResumenSolicitudModel, useClass: ResumenSolicitudModelMock}]);



	// Tests para asegurar que los metodos necesarios estan definidos
	// --------------------------------------------------------------
	it('Debe tener un metodo getSolicitud()', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(resumenSolicitudModel.getSolicitud).toBeDefined();
	}));

	it('Debe tener un metodo getDescripcionTiposSanguineos()', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(resumenSolicitudModel.getDescripcionTiposSanguineos).toBeDefined();
	}));

	it('Debe tener un metodo setDescripcionTiposSanguineos()', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(resumenSolicitudModel.setDescripcionTiposSanguineos).toBeDefined();
	}));

	



	// Tests para asegurar que los metodos devuelven los valores correctamente
	// -----------------------------------------------------------------------
	it('El metodo getSolicitud() debe devolver una solicitud', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		let solicitudObtenida = resumenSolicitudModel.getSolicitud();

		let propiedadesSolicitudObtenida = JSON.stringify(Object.keys(solicitudObtenida).sort());
	    let propiedadesSolicitudCreada = JSON.stringify(Object.keys(new SolicitudModel()).sort());
	    expect(propiedadesSolicitudObtenida).toBe(propiedadesSolicitudCreada);
	}));

	it('El metodo getDescripcionTiposSanguineos() debe devolver un string con la descripcion de los tipos sanguineos buscados', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		let solicitudObtenida = resumenSolicitudModel.getSolicitud();
		let descripcionTiposSanguineosObtenida = resumenSolicitudModel.getDescripcionTiposSanguineos();
		let descripcionTiposSanguineosCreada = donacionesService.puedeRecibirDe(solicitudObtenida.getGrupoSanguineo().getId(), 
                                                			  				   solicitudObtenida.getFactorSanguineo().getId()).join(' ');

		expect(descripcionTiposSanguineosObtenida).toBe(descripcionTiposSanguineosCreada);
	}));

	it('El metodo getDescripcionTiposSanguineos() debe devolver un string con la descripcion de los tipos sanguineos buscados', inject([ResumenSolicitudModel], (resumenSolicitudModel: ResumenSolicitudModelMock) => {
		let solicitudObtenida = resumenSolicitudModel.getSolicitud();
		let descripcionTiposSanguineosCreada = donacionesService.puedeRecibirDe(solicitudObtenida.getGrupoSanguineo().getId(), solicitudObtenida.getFactorSanguineo().getId()).join(' ');
		expect(descripcionTiposSanguineosCreada).toBe(resumenSolicitudModel.getDescripcionTiposSanguineos());

		let nuevaDescripcionTiposSanguineos = donacionesService.puedeRecibirDe(GrupoSanguineoEnum.B, FactorSanguineoEnum.RhNegativo).join(' ');
		resumenSolicitudModel.setDescripcionTiposSanguineos(nuevaDescripcionTiposSanguineos);
		expect(nuevaDescripcionTiposSanguineos).toBe(resumenSolicitudModel.getDescripcionTiposSanguineos());
	}));
});