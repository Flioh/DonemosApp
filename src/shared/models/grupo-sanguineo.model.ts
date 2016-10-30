// Referencias de Angular
import { Injectable } from '@angular/core';

@Injectable()
export class GrupoSanguineoModel {

	public id: number;
	public nombre: string;

	constructor(id?: number, nombre?: string) {
		// Inicializamos el modelo con el objeto pasado como parametro
		this.id = id ? id : null;
		this.nombre = nombre ? nombre : null;
	}
}
