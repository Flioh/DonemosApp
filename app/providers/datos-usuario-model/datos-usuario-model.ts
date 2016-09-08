import { Injectable } from '@angular/core';
import { ProvinciaModel } from '../../providers/provincia-model/provincia-model';
import { CiudadModel } from '../../providers/ciudad-model/ciudad-model';
import { GrupoSanguineoModel } from "../../providers/grupo-sanguineo-model/grupo-sanguineo-model";
import { FactorSanguineoModel } from "../../providers/factor-sanguineo-model/factor-sanguineo-model";

@Injectable()
export class DatosUsuarioModel {

	private provincia : ProvinciaModel;
	private ciudad: CiudadModel;
	private grupoSanguineo: GrupoSanguineoModel;
	private factorSanguineo: FactorSanguineoModel;

	constructor(obj?) {
		this.provincia = obj && obj.provincia ? new ProvinciaModel(obj.provincia.id, obj.provincia.nombre) : null;
		this.ciudad = obj && obj.ciudad ? new CiudadModel(obj.ciudad.id, obj.ciudad.nombre) : null;
		this.grupoSanguineo = obj && obj.grupoSanguineo ? new GrupoSanguineoModel(obj.grupoSanguineo.id, obj.grupoSanguineo.nombre) : null;
		this.factorSanguineo = obj && obj.factorSanguineo ? new FactorSanguineoModel(obj.factorSanguineo.id, obj.factorSanguineo.nombre) : null;		
	}

	public getProvincia(): ProvinciaModel {
		return this.provincia;
	}

	public getCiudad(): CiudadModel {
		return this.ciudad;
	}

	public getGrupoSanguineo(): GrupoSanguineoModel {
		return this.grupoSanguineo;
	}

	public getFactorSanguineo(): FactorSanguineoModel {
		return this.factorSanguineo;
	}

	public setProvincia(unaProvincia: ProvinciaModel): void {
		this.provincia = unaProvincia;
	}

	public setCiudad(unaCiudad: CiudadModel): void {
		this.ciudad = unaCiudad;
	}

	public setGrupoSanguineo(unGrupoSanguineo: GrupoSanguineoModel): void {
		this.grupoSanguineo = unGrupoSanguineo;
	}

	public setFactorSanguineo(unFactorSanguineo: FactorSanguineoModel): void {
		this.factorSanguineo = unFactorSanguineo;
	}

}
