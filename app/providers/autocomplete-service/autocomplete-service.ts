import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

let google: any = window.google || {};

@Injectable()
export class AutocompleteService {

	private autocompleteObserver: any;
	public autocomplete: any;

	private apiKey: string;

	private placeSearch: any;
	private autocompleteElement: any;
	private googleAddressInformation: any = {};

	constructor(private connectivityService: ConnectivityService) {
		this.autocompleteObserver = null;

		this.autocomplete = Observable.create(observer => {
			this.autocompleteObserver = observer;
		});
	}

	public initializeAutocomplete(element): void {
		// Create the autocomplete object, restricting the search to geographical location types.
		this.autocompleteElement = new google.maps.places.Autocomplete(element);

		let processAddress = () => {
			this.processAddressInformation();
		}

		// When the user selects an address from the dropdown,
		// populate the address fields in the form.
		google.maps.event.addListener(this.autocompleteElement, 'place_changed', function() {
			processAddress();
		});
	}

	public processAddressInformation(): void {
		// Get the place details from the autocomplete object.
		let place = this.autocompleteElement.getPlace();

		// Clean previous information
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

		// Aditional properties
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

		// Send informtaion back to the parent directive
		this.autocompleteObserver.next(result);
	}
}