'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:TicketCtrl
 * @description
 * # TicketCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('TicketCtrl', function($rootScope, $auth, $q, $state, $mdDialog, $log, deviceDetector, Orders, Utils, orderWarnings) {
		$log.log('Orders: ' + JSON.stringify(Utils.getInStorage('ticket')));
		var self = this,
			i = 0,
			j = 0;

		this.elements = {
			errors: {
				show: orderWarnings,
				message: orderWarnings === null ? '' : orderWarnings.capacity === 0 ? 'Los pedidos se encuentran bloqueados temporalmente' : 'Puedes pedir ' + orderWarnings.capacity + ' karaokes como máximo'
			},
			form: {
				buttons: {
					next: {
						disabled: Utils.getInStorage('ticket').orders.length > 0 ? false : true
					}
				}
			}
		};

		this.ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
		};

		var openDialogCode = function(data) {
			$mdDialog.show({
					controller: 'CodeCtrl',
					controllerAs: 'code',
					templateUrl: 'karamuse-client.code.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: false,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						data: data
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogCustomAlert = function(data) {
			$mdDialog.show({
					controller: 'CustomAlertCtrl',
					controllerAs: 'customAlert',
					templateUrl: 'karamuse-client.custom-alert.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						data: data
					}
				})
				.finally(function() {
					$log.log('finally');
					self.openDialogTicket();
				});
		};

		this.openDialogOrderResults = function() {
			$mdDialog.show({
					controller: 'OrderResultsCtrl',
					controllerAs: 'orderResults',
					templateUrl: 'karamuse-client.order-results.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: false,
					fullscreen: false, // Only for -xs, -sm breakpoints.
				})
				.then(function() {}, function() {});
		};

		this.validateCode = function() {
			var deferred = $q.defer();
			deferred.resolve();
			// deferred.reject();
			return deferred.promise;
		};

		this.order = function() {
			$rootScope.clientGlobalLoader.show = true;
			var validateCode = self.validateCode();
			validateCode.then(function() {

				var ticket = Utils.getInStorage('ticket'),
					order = [];

				for (i = 0; i < ticket.orders.length; i++) {
					order.push({
						id_karaoke: ticket.orders[i].id,
						message: ticket.orders[i].message
					});
				}

				Orders.save({
					token: $auth.getToken(),
					code_client: ticket.code,
					origin: deviceDetector.os,
					order: order
				}, function(success) {
					// $log.log(success);
					var tempOrderAttribute = [];
					$rootScope.clientGlobalLoader.show = false;
					if (success.status === 200) {
						for (i = 0; i < success.data.length; i++) {
							for (j = 0; j < ticket.orders.length; j++) {
								if (success.data[i].id_karaoke === ticket.orders[j].id) {
									ticket.orders[j].result.show = true;
									if (success.data[i].add_order) {
										ticket.orders[j].result.added = true;
										ticket.orders[j].result.color = 'primary-hue-3';
										ticket.orders[j].result.message = 'Enviado correctamente';										
									} else {
										ticket.orders[j].result.added = false;
										ticket.orders[j].result.color = 'warn';
										ticket.orders[j].result.message = 'Otro usuario ya lo había pedido';
									}

									tempOrderAttribute.push(ticket.orders[j]);
								}
							}
						}

						$mdDialog.hide();
						self.openDialogOrderResults();

						Utils.setInStorage('ticket', {
							orders: tempOrderAttribute,
							code: ticket.code
						});
					} else if (success.status === 403) {
						$log.error('codigo inválido');
						openDialogCode({
							error: {
								text: 'Código inválido',
								show: true
							}
						});
					} else if (success.status === 404) {
						$log.error('puede ser que el arreglo del pedido está vacío o es invalido');
					} else if (success.status === 406) {
						$log.error('Cupos limitados');
						var message = "";
						if (success.capacity === 0) {
							message = "No hay más espacio para cantar. Por favor intenta más tarde.";
						} else {
							message = 'Sólo hay espacio para ' + success.capacity + ' karaoke(s). Por favor intenta nuevamente';
						}
						self.openDialogCustomAlert({
							title: '¡Cupos limitados!',
							subtitle: '',
							body: {
								paragraph1: message
							}
						});
					} else if (success.status === 401) {
						window.location.replace("http://www.karamuse.cl/");
					} else {						
						$log.error(success);
					}
				}, function(error) {
					$rootScope.clientGlobalLoader.show = false;
					$log.error(error);
				});
			}, function() {
				// abre modal que solicita codigo
				$rootScope.clientGlobalLoader.show = false;
				openDialogCode({
					error: {
						text: 'Código inválido',
						show: true
					}
				});
			});
		};

		this.addAnotherOrder = function() {
			$mdDialog.hide();
			$state.go('client.search-karaoke');
		};

		this.openDialogTicket = function() {
			$mdDialog.show({
					controller: 'TicketCtrl',
					controllerAs: 'ticket',
					templateUrl: 'karamuse-client.ticket.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						orderWarnings: null
					}
				})
				.then(function() {}, function() {});
		};

		this.openDialogOrderOptions = function(order) {
			$mdDialog.show({
					controller: 'OrderOptionsCtrl',
					controllerAs: 'orderOptions',
					templateUrl: 'karamuse-client.order-options.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						order: order
					}
				})
				.then(function() {}, function() {
					if (angular.element(document.body).hasClass('md-dialog-is-showing')) {
						self.openDialogTicket();
					}

				});
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});