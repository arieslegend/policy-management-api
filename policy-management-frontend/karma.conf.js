// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed
        // https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution order
        // random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/policy-management-frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        },
        // Component-specific thresholds
        'src/app/components/login/login.component.ts': {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85
        },
        'src/app/states/auth.state.ts': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90
        },
        'src/app/states/policy.state.ts': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90
        }
      },
      // Excluir archivos que no necesitan pruebas
      exclude: [
        '**/*.spec.ts',
        '**/test-setup.ts',
        '**/main.ts',
        '**/main.server.ts',
        '**/server.ts',
        '**/environments/**',
        '**/polyfills.ts',
        '**/typings.d.ts',
        '**/app.config.server.ts',
        '**/app.routes.server.ts'
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    // Custom configuration for integration tests
    files: [
      // Unit tests
      { pattern: 'src/app/**/*.spec.ts', type: 'module', included: true, watched: true },
      // Integration tests
      { pattern: 'src/app/integration/**/*.spec.ts', type: 'module', included: true, watched: true }
    ],
    preprocessors: {
      'src/app/**/*.spec.ts': ['@angular-devkit/build-angular'],
      'src/app/integration/**/*.spec.ts': ['@angular-devkit/build-angular']
    },
    // Test timeout configuration
    captureTimeout: 60000,
    browserDisconnectTimeout: 3000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 30000,
    // Memory and performance settings
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    // Custom launchers for different environments
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    }
  });
};
