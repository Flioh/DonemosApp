import { Injectable } from '@angular/core';

@Injectable()
export class GrupoSanguineoModel {

	private id: number;
	private nombre: string;

	constructor(id?: number, nombre?: string) {
		this.id = id ? id : null;
		this.nombre = nombre ? nombre : null;
	}

	public getId(): number {
		return this.id;
	}

	public getNombre(): string {
		return this.nombre;
	}

	public setId(id: number): number {
		return this.id = id;
	}

	public setNombre(nombre: string): string {
		return this.nombre = nombre;
	}
}
