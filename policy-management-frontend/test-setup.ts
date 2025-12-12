// This file is required for karma configuration to load up all tests
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Global test setup
beforeEach(() => {
  // Reset any global state before each test
  jasmine.clock().uninstall();
  jasmine.clock().install();
});

afterEach(() => {
  // Clean up after each test
  jasmine.clock().uninstall();
});

// Custom matchers for common assertions
const customMatchers: jasmine.CustomMatcherFactories = {
  toBeValidForm: function() {
    return {
      compare: function(actual: any) {
        const result = {
          pass: actual && actual.valid === true,
          message: ''
        };

        if (result.pass) {
          result.message = `Expected form to be invalid, but it is valid`;
        } else {
          result.message = `Expected form to be valid, but it is invalid`;
        }

        return result;
      }
    };
  },
  toBeInvalidForm: function() {
    return {
      compare: function(actual: any) {
        const result = {
          pass: actual && actual.invalid === true,
          message: ''
        };

        if (result.pass) {
          result.message = `Expected form to be valid, but it is invalid`;
        } else {
          result.message = `Expected form to be invalid, but it is valid`;
        }

        return result;
      }
    };
  },
  toContainAction: function() {
    return {
      compare: function(actual: any, expected: any) {
        const result = {
          pass: actual && actual.some((call: any) => 
            call.args[0] instanceof expected
          ),
          message: ''
        };

        if (result.pass) {
          result.message = `Expected dispatch not to contain ${expected.name} action`;
        } else {
          result.message = `Expected dispatch to contain ${expected.name} action`;
        }

        return result;
      }
    };
  }
};

// Add custom matchers to jasmine
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

// Mock console methods during tests to avoid noise
const originalConsole = console;
beforeEach(() => {
  console.warn = jasmine.createSpy('warn');
  console.error = jasmine.createSpy('error');
  console.log = jasmine.createSpy('log');
});

afterEach(() => {
  console = originalConsole;
});

// Global test utilities
export class TestUtils {
  static createMockStore() {
    return jasmine.createSpyObj('Store', ['dispatch', 'select']);
  }

  static createMockRouter() {
    return jasmine.createSpyObj('Router', ['navigate']);
  }

  static createMockFormBuilder() {
    return jasmine.createSpyObj('FormBuilder', ['group', 'control']);
  }

  static waitForAsync(ms: number = 0): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        jasmine.clock().tick(ms);
        resolve();
      }, 0);
    });
  }

  static flushMicrotasks(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        jasmine.clock().tick(0);
        resolve();
      }, 0);
    });
  }

  static createMockHttpResponse<T>(data: T, status = 200) {
    return {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: {},
      ok: true
    };
  }

  static createMockHttpError(error: string, status = 400) {
    return {
      error,
      status,
      statusText: 'Bad Request',
      headers: {},
      config: {},
      ok: false
    };
  }
}

// Global test data fixtures
export const TestData = {
  users: {
    admin: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    },
    client: {
      id: 2,
      name: 'Client User',
      email: 'client@example.com',
      role: 'client'
    }
  },
  clients: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      identificationNumber: '12345678901',
      phone: '1234567890',
      address: '123 Main St'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      identificationNumber: '98765432109',
      phone: '0987654321',
      address: '456 Oak St'
    }
  ],
  policies: [
    {
      id: 1,
      type: 0,
      status: 0,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 1000,
      coverage: 'Full coverage',
      clientId: 1
    },
    {
      id: 2,
      type: 1,
      status: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 1500,
      coverage: 'Basic coverage',
      clientId: 2
    }
  ],
  auth: {
    validToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid.token',
    invalidToken: 'invalid-token',
    loginRequest: {
      email: 'test@example.com',
      password: 'password123'
    },
    loginResponse: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid.token',
      user: TestData.users.admin
    }
  }
};

// Export for use in test files
declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeValidForm(): boolean;
      toBeInvalidForm(): boolean;
      toContainAction(expected: any): boolean;
    }
  }
}
