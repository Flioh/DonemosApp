// Referencias de Angular
import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

// Declaracion para evitar warnings de Typescript
declare var google: any;

@Directive({ 
    selector: '[institucionesAutocomplete]' 
})
export class InstitucionesAutocompleteDirective {
    @Output() seleccionarInstitucion = new EventEmitter();

	private autocomplete: any;
	private datosDireccion: any = {};
    
    constructor(public el: ElementRef) { }

    public ngAfterViewInit() {
        // Inicializamos el autocomplete ahora y no en el constructor ya que necesitamos hacerlo
        // luego de que Ionic modifique el HTML del ion-input
        this.inicializarAutocomplete(this.el.nativeElement.children[0]);
    }

    // Método que inicializa el autocomplete usando la libreria Google Places
    public inicializarAutocomplete(element): void {

		// Restringimos los resultados solo a establecimientos de Argentina
		var options = {
		  types: ['establishment'],
		  componentRestrictions: {country: 'ar'}
		};

		// Creamos el objeto autocomplete
		this.autocomplete = new google.maps.places.Autocomplete(element, options);

        // Seteamos el callback para cuando el usuario seleccione una opcion del autocomplete
		let processAddress = () => {
			this.procesarDatosDireccion();
		}

		// Cuando el usuario elija una opcion, usamos esa informacion para completar los campos del formulario
		google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
			processAddress();
		});
	}

    // Método que obtiene los campos relevantes de la direccion enviada por Google
	public procesarDatosDireccion(): void {
		// Obtenemos el lugar seleccionado
		let datosLugar = this.autocomplete.getPlace();

		// Inicializamos el objeto donde vamos a guardar la informacion
		this.datosDireccion = {};

		for (let i = 0; i < datosLugar.address_components.length; i++) {
			let tipoDireccion = datosLugar.address_components[i].types[0];
			let atributoBuscado;
			if (tipoDireccion === 'country') {
				atributoBuscado = 'short_name';
			}
			else {
				atributoBuscado = 'long_name';
			}

			this.datosDireccion[tipoDireccion] = datosLugar.address_components[i][atributoBuscado];
		}

		// Propiedades adicionales que podrían agregarse más adelante
		this.datosDireccion['name'] = datosLugar['name'];
		this.datosDireccion['place_id'] = datosLugar['place_id'];
		this.datosDireccion['formatted_phone_number'] = datosLugar['formatted_phone_number'];

		this.formatearDireccion();
	}

    // Método que emite el evento con la informacion relevante del lugar
	private formatearDireccion(): void {

		let numeroCalle = this.datosDireccion.street_number ? this.datosDireccion.street_number : '',
		    nombreCalle = this.datosDireccion.route ? this.datosDireccion.route : '',
		    nombreCiudad = this.datosDireccion.locality ? this.datosDireccion.locality : '',
		    codigoPais = this.datosDireccion.country ? this.datosDireccion.country : '',
		    nombreProvincia = this.datosDireccion.administrative_area_level_1 ? this.datosDireccion.administrative_area_level_1 : '',
		    codigoPostal = this.datosDireccion.postal_code ? this.datosDireccion.postal_code : '',
		    codigoPostaSufijo = this.datosDireccion.postal_code_suffix ? this.datosDireccion.postal_code_suffix : '',
		    nombreInstitucion = this.datosDireccion.name ? this.datosDireccion.name : '',
		    lugarId = this.datosDireccion.place_id ? this.datosDireccion.place_id : '',
		    numeroTelefono = this.datosDireccion.formatted_phone_number ? this.datosDireccion.formatted_phone_number : '';

		let resultado = {

			getNombreInstitucion : function(): string {
				return nombreInstitucion;
			},
			getLugarId : function(): string {
				return lugarId;
			},
			getNumeroTelefono : function(): string {
				return numeroTelefono;
			},
			getDireccion: function(): string {
				return nombreCalle + ' ' + numeroCalle;
			},
			getNombreCiudad: function(): string {
				return nombreCiudad;
			},
			getNombreProvincia: function(): string {
				return nombreProvincia;
			},
			getCodigoPais: function(): string {
				return codigoPais;
			},
			getCodigoPostal: function(): string {
				return codigoPostal + codigoPostaSufijo;
			},
			getDatosDireccion: function(): any {
				return this.datosDireccion;
			}
		}

		// Enviamos la informacion a los componentes que esten subscriptos
		this.seleccionarInstitucion.emit(resultado);
	}
}