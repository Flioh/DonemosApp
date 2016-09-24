import { Platform } from 'ionic-angular';
import { Injectable, provide } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { beforeEachProviders, beforeEach, it, describe, expect, inject, async } from '@angular/core/testing';

import { NavigationService } from './navigation-service';

let navService = null;

class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

describe('Navigation Service', () => {

	// Usamos el mock en lugar del modelo real
	beforeEachProviders(() => [NavigationService, Platform]);

    beforeEach(function() {
    let platform = (<any>new PlatformMock());
        navService = new NavigationService(platform);
    });

    // Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo mostrarRuta()', () => {
		expect(navService.mostrarRuta).toBeDefined();
	});
});
