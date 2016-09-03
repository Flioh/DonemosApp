import { Injectable } from '@angular/core';
import { ProvinciaModel } from "../provincia-model/provincia-model";

@Injectable()
export class CiudadModel {

	private id: number;
	private nombre: string;
	private provinciaID: number;

	constructor(obj: any) {
		this.id = obj.id;
	    this.nombre = obj.nombre;
	    this.provinciaID = obj.provinciaID;
	}

	public getId(): number {
		return this.id;
	}

	public getNombre(): string {
		return this.nombre;
	}

	public getProvinciaID(): number {
		return this.provinciaID;
	}
}
