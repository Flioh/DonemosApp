// Referencias de Angular
import { Injectable } from '@angular/core';

// Modelos compartidos
import { LocalidadModel } from '../../shared/models/localidad.model';
import { FactorSanguineoModel } from '../../shared/models/factor-sanguineo.model';
import { GrupoSanguineoModel } from '../../shared/models/grupo-sanguineo.model';
import { ProvinciaModel } from '../../shared/models/provincia.model';

@Injectable()
export class PreferenciasUsuarioModel {

	public provincia : ProvinciaModel;
	public localidad: LocalidadModel;
	public grupoSanguineo: GrupoSanguineoModel;
	public factorSanguineo: FactorSanguineoModel;

	constructor(obj?) {
		// Inicializamos el modelo con el objeto pasado como parametro
		this.provincia = obj && obj.provincia ? new ProvinciaModel(obj.provincia.id, obj.provincia.nombre) : null;
		this.localidad = obj && obj.localidad ? new LocalidadModel(obj.localidad.id, obj.localidad.nombre) : null;
		this.grupoSanguineo = obj && obj.grupoSanguineo ? new GrupoSanguineoModel(obj.grupoSanguineo.id, obj.grupoSanguineo.nombre) : null;
		this.factorSanguineo = obj && obj.factorSanguineo ? new FactorSanguineoModel(obj.factorSanguineo.id, obj.factorSanguineo.nombre) : null;		
	}
}
