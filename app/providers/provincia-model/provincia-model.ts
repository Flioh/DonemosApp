import { Injectable } from '@angular/core';

@Injectable()
export class ProvinciaModel {

	private id: string;
	private nombre: string;

	constructor(id?: string, nombre?: string) {
		this.id = id ? id : null;
		this.nombre = nombre ? nombre : null;
	}

	public getId(): string {
		return this.id;
	}

	public getNombre(): string {
		return this.nombre;
	}

	public setId(id: string): string {
		return this.id = id;
	}

	public setNombre(nombre: string): string {
		return this.nombre = nombre;
	}
}
