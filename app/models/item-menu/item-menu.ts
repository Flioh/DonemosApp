import { Injectable } from '@angular/core';

@Injectable()
export class ItemMenuModel {

  constructor(
    private nombreIcono: string, 
    private titulo: string, 
    private componente: any,
    private esRoot: boolean,
    private requiereLogin: boolean) {
  }

  public getIconoIosOutline(): string {
    return 'ios-' + this.nombreIcono + '-outline';
  }

  public getIconoIos(): string {
    return 'ios-' + this.nombreIcono;
  }

  public getIconoAndroid(): string {
    return 'md-' + this.nombreIcono;
  }

  public getTitulo(): string {
	  return this.titulo;
  }

  public getComponente(): any {
	  return this.componente;
  }

  public getEsRoot(): boolean {
    return this.esRoot;
  }

  public getRequiereLogin(): boolean {
    return this.requiereLogin;
  }

}

