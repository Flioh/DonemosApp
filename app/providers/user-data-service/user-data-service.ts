import { Injectable } from '@angular/core';
import { SqlStorage, Storage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserDataService {

	private storage: Storage;
  	private datosUsuarioObj: any;

  	private datosUsuarioObserver: any;
  	public datosUsuario: Observable<any>;

  	constructor() {
  		// Inicializa los datos del usuario
  		this.datosUsuarioObj = null;

  		// Inicializamos el observable
  		this.datosUsuarioObserver = null;
	    this.datosUsuario = Observable.create(observer => {
	        this.datosUsuarioObserver = observer;
	    });

  		// Inicializa el objeto storage
  		if(!this.storage) {
  			this.storage = new Storage(SqlStorage);  
  		}
  	}

	// Método que obtiene los datos del usuario
	public getDatosUsuario(): Promise<any> {
		return new Promise((resolve)=> {

			if(this.datosUsuarioObj === null) {
				// Aún no se consulto si habia o no datos, por lo que hacemos la consulta
				this.storage.get('datosUsuarioObj').then((datosUsuario) => {
					if(!datosUsuario) {
			          // No hay datos guardados, por lo que seteamos la variable en false
			          this.datosUsuarioObj = false;			         
			          resolve(this.datosUsuarioObj);
			      } else {
			          // Inicializamos los listados con la informacion del usuario
			          this.datosUsuarioObj = JSON.parse(datosUsuario);	          
			          resolve(this.datosUsuarioObj);          
			      }
	  			});

			} else {
				// Devolver los datos guardados ya sea false o el objeto con la informacion
				resolve(this.datosUsuarioObj);
			}			
		});
	}

	public setDatosUsuario(datosUsuario: any): Promise<any> {
		return this.storage.set('datosUsuarioObj', JSON.stringify(datosUsuario))
				.then(() => { 
					this.datosUsuarioObj = datosUsuario;
					this.datosUsuarioObserver.next(datosUsuario);
				});
	}
}