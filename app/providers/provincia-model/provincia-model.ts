import {Injectable} from '@angular/core';

@Injectable()
export class ProvinciaModel {

	private id: number;
	private nombre: string;

	constructor(obj: any) {
		this.id = obj.id;
	    this.nombre = obj.nombre;
	}

	public getId(): number {
		return this.id;
	}

	public getNombre(): string {
		return this.nombre;
	}
}
