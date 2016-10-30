// Referencias de Angular
import { Injectable } from '@angular/core';

@Injectable()
export class ItemMenuModel {

  constructor(public nombreIcono: string, 
              public titulo: string, 
              public componente: any,
              public esRoot: boolean,
              public requiereLogin: boolean) { }

  public getIconoIosOutline(): string {
    return 'ios-' + this.nombreIcono + '-outline';
  }

  public getIconoIos(): string {
    return 'ios-' + this.nombreIcono;
  }

  public getIconoAndroid(): string {
    return 'md-' + this.nombreIcono;
  }
}

