// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare global {
  var jasmine: any;
  var spyOn: any;
  var describe: any;
  var it: any;
  var beforeEach: any;
  var afterEach: any;
  var beforeAll: any;
  var afterAll: any;
  var expect: any;
}

// First, initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Then initialize jasmine globals
if (typeof jasmine === 'undefined') {
  // Jasmine globals should be available automatically in Karma
  // This is a fallback in case they're not
  console.warn('Jasmine globals not available');
}
