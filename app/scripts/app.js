'use strict';

/**
 * @ngdoc overview
 * @name karamuseApp
 * @description
 * # karamuseApp
 *
 * Main module of the application.
 */

angular
  .module('karamuseDjApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'ng.deviceDetector',
    'LocalStorageModule',
    'ui.router',
    'ui.bootstrap',
    'ui.footable',
    'picardy.fontawesome',
    'ngclipboard',
  ]);

angular
  .module('karamuseClientApp', []);

angular
  .module('karamuseApp', [
    'karamuseDjApp',
    'karamuseClientApp'
  ]);