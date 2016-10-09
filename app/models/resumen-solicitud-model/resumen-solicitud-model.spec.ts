import { Injectable } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';
import { ResumenSolicitudModel } from './resumen-solicitud-model';

/* Modelos usados en los tests */
import { SolicitudModel } from '../solicitud-model/solicitud-model';
import { CiudadModel } from '../ciudad-model/ciudad-model';
import { ProvinciaModel } from '../provincia-model/provincia-model';
import { FactorSanguineoModel } from '../factor-sanguineo-model/factor-sanguineo-model';
import { GrupoSanguineoModel } from '../grupo-sanguineo-model/grupo-sanguineo-model';

/* Helpers */
import { DonacionesHelper} from '../../providers/donemos-helper-service/donemos-helper-service';
import { GrupoSanguineoHelper, FactorSanguineoHelper } from '../../providers/donemos-helper-service/donemos-helper-service';
import { FactorSanguineoEnum, GrupoSanguineoEnum } from '../../providers/donemos-helper-service/donemos-helper-service';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Mock del una pagina
@Component({
  templateUrl: 'build/pages/error/error.html',
})
export class MockPage {
  constructor(public nav: NavController) {}
}

// Mock de la clase MenuItemModel
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
			"grupoSanguineo" : new GrupoSanguineoModel(GrupoSanguineoEnum.A, GrupoSanguineoHelper.getDescripcion(GrupoSanguineoEnum.A)),
			"factorSanguineo" : new FactorSanguineoModel(FactorSanguineoEnum.RhPositivo, FactorSanguineoHelper.getDescripcion(FactorSanguineoEnum.RhPositivo)),
			"nombrePaciente": "Nombre Apellido",
			"cantidadDadores" : 7,
			"institucion" : "Sanatorio Mayo",
			"direccion" : "Rivadavia 2345",
			"horaDesde" : "08:00",
			"horaHasta" : "18:00",
			"datosAdicionales" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		};

		let nuevaSolicitud = new SolicitudModel(datosSolicitudMock);

		super(nuevaSolicitud, DonacionesHelper.puedeRecibirDe(nuevaSolicitud.getGrupoSanguineo().getId(), 
                                                			  nuevaSolicitud.getFactorSanguineo().getId()).join(' '));
	}
}

describe('SolicitudItem Model', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [{ provide: ResumenSolicitudModel, useClass: ResumenSolicitudModelMock}]);



	// Tests para asegurar que los metodos necesarios estan definidos
	// --------------------------------------------------------------
	it('Debe tener un metodo getSolicitud()', inject([ResumenSolicitudModel], (ResumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(ResumenSolicitudModel.getSolicitud).toBeDefined();
	}));

	it('Debe tener un metodo getDescripcionTiposSanguineos()', inject([ResumenSolicitudModel], (ResumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(ResumenSolicitudModel.getDescripcionTiposSanguineos).toBeDefined();
	}));

	it('Debe tener un metodo setDescripcionTiposSanguineos()', inject([ResumenSolicitudModel], (ResumenSolicitudModel: ResumenSolicitudModelMock) => {
		expect(ResumenSolicitudModel.setDescripcionTiposSanguineos).toBeDefined();
	}));

	



	// Tests para asegurar que los metodos devuelven los valores correctamente
	// -----------------------------------------------------------------------
	it('El metodo getSolicitud() debe devolver una solicitud', inject([ResumenSolicitudModel], (ResumenSolicitudModel: ResumenSolicitudModelMock) => {
		let solicitudObtenida = ResumenSolicitudModel.getSolicitud();

		let propiedadesSolicitudObtenida = JSON.stringify(Object.keys(solicitudObtenida).sort());
	    let propiedadesSolicitudCreada = JSON.stringify(Object.keys(new SolicitudModel()).sort());
	    expect(propiedadesSolicitudObtenida).toBe(propiedadesSolicitudCreada);
	}));

	it('El metodo getDescripcionTiposSanguineos() debe devolver un string con la descripcion de los tipos sanguineos buscados', inject([ResumenSolicitudModel], (ResumenSolicitudModel: ResumenSolicitudModelMock) => {
		let solicitudObtenida = ResumenSolicitudModel.getSolicitud();
		let descripcionTiposSanguineosObtenida = ResumenSolicitudModel.getDescripcionTiposSanguineos();
		let descripcionTiposSanguineosCreada = DonacionesHelper.puedeRecibirDe(solicitudObtenida.getGrupoSanguineo().getId(), 
                                                			  				   solicitudObtenida.getFactorSanguineo().getId()).join(' ');

		expect(descripcionTiposSanguineosObtenida).toBe(descripcionTiposSanguineosCreada);
	}));
});