// Referencias de Angular
import { Component, Injectable, provide } from '@angular/core';
import { beforeEachProviders, beforeEach, it, describe, expect, inject } from '@angular/core/testing';

// Referencias de Ionic
import { Platform } from 'ionic-angular';

// Servicio principal
import { ConectividadService } from './conectividad.service';

// Mock de la clase Platform de Ionic
class PlatformMock {

  private platform: string;

  public setPlatform(platformName:string) {
    this.platform = platformName;
  }

  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  public is(platformName:string): boolean {
      return this.platform.toLowerCase() === platformName.toLowerCase();
  }
}

// Mock del servicio a testear
let conectividadServiceMock: ConectividadService;

describe('ConectividadService', () => {

  // Usamos el mock en lugar del modelo real
  beforeEach(function() {
      let platform = (<any>new PlatformMock());
      platform.setPlatform('ios');
      conectividadServiceMock = new ConectividadService(platform);
  });



	// Tests para asegurar que los metodos get estan definidos
	// -------------------------------------------------------
	it('Debe tener un metodo hayConexion()', () => {
		expect(conectividadServiceMock.hayConexion).toBeDefined();
	});

  it('Debe tener un metodo hayConexion()', () => {
		expect(conectividadServiceMock.noHayConexion).toBeDefined();
	});

});