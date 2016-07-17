import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  constructor(public http: Http) {}

  public obtenerSolicitudes(): any {
    return new Promise(resolve => {
      this.http.get('./solicitudes.json')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}

