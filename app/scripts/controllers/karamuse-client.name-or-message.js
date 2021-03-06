'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:NameOrMessageCtrl
 * @description
 * # NameOrMessageCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseDjApp')
	.controller('NameOrMessageCtrl', function($rootScope, $log, $auth, $q, $mdDialog, order, Utils, Codes) {

		var self = this;

		var ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
		};

		this.elements = {
			form: {
				code: {
					text: ticket.code,
					show: true,
					error: {
						show: false,
						text: ''
					}
				},
				nameOrMessage: {
					focus: true,
					text: ''
				},
				buttons: {
					next: {
						disabled: false
					},
					skip: {
						show: ticket.code ? true : false
					}
				}
			}
		};

		var openDialogTicket = function() {
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

		this.validateCode = function() {
			var deferred = $q.defer();

			Codes.verify({
				token: $auth.getToken(),
				code: self.elements.form.code.text
			}, function(success) {
				if (success.status === 200) {
					deferred.resolve();
				} else if (success.status === 201 || success.status === 202) {
					deferred.reject();
				} else {
					deferred.reject();
				}
			}, function(error) {
				$log.error(error);
				deferred.reject();
			});
			return deferred.promise;
		};

		this.addNameOrMessage = function(message) {

			$rootScope.clientGlobalLoader.show = true;

			// aqui valida el código
			var validateCode = self.validateCode();
			validateCode.then(function() {
				order.message = message; // al obj order agrega el attr message
				order.result = {
					added: false,
					show: false,
					color: '',
					message: ''
				};
				ticket.orders.push(order);
				ticket.code = self.elements.form.code.text;
				Utils.setInStorage('ticket', ticket);
				$rootScope.clientGlobalLoader.show = false;
				openDialogTicket(); // abre modal ticket
			}, function() {
				$rootScope.clientGlobalLoader.show = false;
				self.elements.form.code.error.text = 'Código inválido';
				self.elements.form.code.error.show = true;
			});
			// if (!ticket.code) {
			// 	var validateCode = self.validateCode();
			// 	validateCode.then(function() {
			// 		order.message = message; // al obj order agrega el attr message
			// 		order.result = {
			// 			added: false,
			// 			show: false,
			// 			color: '',
			// 			message: ''
			// 		};
			// 		ticket.orders.push(order);
			// 		ticket.code = self.elements.form.code.text;
			// 		Utils.setInStorage('ticket', ticket);
			// 		$rootScope.clientGlobalLoader.show = false;
			// 		openDialogTicket(); // abre modal ticket
			// 	}, function() {
			// 		$rootScope.clientGlobalLoader.show = false;
			// 		self.elements.form.code.error.text = 'Código inválido';
			// 		self.elements.form.code.error.show = true;
			// 	});
			// } else {
			// 	order.message = message; // al obj order agrega el attr message
			// 	order.result = {
			// 		added: false,
			// 		show: false,
			// 		color: '',
			// 		message: ''
			// 	};
			// 	ticket.orders.push(order);
			// 	$rootScope.clientGlobalLoader.show = false;
			// 	Utils.setInStorage('ticket', ticket);
			// 	openDialogTicket(); // abre modal ticket
			// }
		};

		this.skip = function() {
			$mdDialog.cancel();
		};

		this.closeDialog = function() {
			$mdDialog.cancel();
		};

	});