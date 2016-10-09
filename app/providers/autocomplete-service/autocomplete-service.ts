import { ConectividadService } from '../../providers/conectividad-service/conectividad-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var google: any;

@Injectable()
export class AutocompleteService {

	private autocompleteObserver: any;
	public autocomplete: any;

	private apiKey: string;

	private placeSearch: any;
	private autocompleteElement: any;
	private googleAddressInformation: any = {};

	constructor(private conectividadService: ConectividadService) {
		this.autocompleteObserver = null;

		this.autocomplete = Observable.create(observer => {
			this.autocompleteObserver = observer;
		});
	}

	public initializeAutocomplete(element): void {

		// Restringimos los resultados solo a establecimientos de Argentina
		var options = {
		  types: ['establishment'],
		  componentRestrictions: {country: 'ar'}
		};

		// Creamos el objeto autocomplete
		this.autocompleteElement = new google.maps.places.Autocomplete(element, options);

		let processAddress = () => {
			this.processAddressInformation();
		}

		// Cuando el usuario elija una opcion, usamos esa informacion para completar los campos del formulario
		google.maps.event.addListener(this.autocompleteElement, 'place_changed', function() {
			processAddress();
		});
	}

	public processAddressInformation(): void {
		// Obtenemos el lugar seleccionado
		let place = this.autocompleteElement.getPlace();

		// Inicializamos el objeto donde vamos a guardar la informacion
		this.googleAddressInformation = {};

		for (let i = 0; i < place.address_components.length; i++) {
			let addressType = place.address_components[i].types[0];
			let attributeToGet;
			if (addressType === 'country') {
				attributeToGet = 'short_name';
			}
			else {
				attributeToGet = 'long_name';
			}

			this.googleAddressInformation[addressType] = place.address_components[i][attributeToGet];
		}

		// Propiedades adicionales
		this.googleAddressInformation['name'] = place['name'];
		this.googleAddressInformation['place_id'] = place['place_id'];
		this.googleAddressInformation['formatted_phone_number'] = place['formatted_phone_number'];

		this.returnAddress();
	}

	private returnAddress(): void {
		let streetNumber = this.googleAddressInformation.street_number ? this.googleAddressInformation.street_number : '',
		route = this.googleAddressInformation.route ? this.googleAddressInformation.route : '',
		city = this.googleAddressInformation.locality ? this.googleAddressInformation.locality : '',
		country = this.googleAddressInformation.country ? this.googleAddressInformation.country : '',
		province = this.googleAddressInformation.administrative_area_level_1 ? this.googleAddressInformation.administrative_area_level_1 : '',
		postal_code = this.googleAddressInformation.postal_code ? this.googleAddressInformation.postal_code : '',
		postal_code_suffix = this.googleAddressInformation.postal_code_suffix ? this.googleAddressInformation.postal_code_suffix : '',
		name = this.googleAddressInformation.name ? this.googleAddressInformation.name : '',
		place = this.googleAddressInformation.place_id ? this.googleAddressInformation.place_id : '',
		phoneNumber = this.googleAddressInformation.formatted_phone_number ? this.googleAddressInformation.formatted_phone_number : '';

		let result = {

			getName : function(): string {
				return name;
			},
			getPlace : function(): string {
				return place;
			},
			getPhoneNumber : function(): string {
				return phoneNumber;
			},
			getAdressLine1: function(): string {
				return route + ' ' + streetNumber;
			},
			getCity: function(): string {
				return city;
			},
			getProvince: function(): string {
				return province;
			},
			getCountryCode: function(): string {
				return country;
			},
			getPostalCode: function(): string {
				return postal_code + postal_code_suffix;
			},
			getEntireResponse: function(): any {
				return this.googleAddressInformation;
			}
		}

		// Enviamos la informacion a los componentes que esten subscriptos
		this.autocompleteObserver.next(result);
	}
}