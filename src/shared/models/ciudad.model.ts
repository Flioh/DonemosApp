// Referencias de Angular
import { Injectable } from '@angular/core';

@Injectable()
export class CiudadModel {

	public id: string;
	public nombre: string;

	constructor(id?: string, nombre?: string) {
		// Inicializamos el modelo con el objeto pasado como parametro
		this.id = id ? id : null;
		this.nombre = nombre ? nombre : null;		
	}
}
