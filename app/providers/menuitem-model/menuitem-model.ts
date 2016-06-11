import {Injectable} from '@angular/core';

@Injectable()
export class MenuItemModel {

  constructor(private nombreIcono: string, private titulo: string, private componente: any) {

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

}

