'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:OrdersLimitModalInstanceCtrl
 * @description
 * # OrdersLimitModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
	.controller('OrdersLimitModalInstanceCtrl', function($log, $interval, $timeout, $uibModalInstance, $auth, data, Settings) {
		var self = this;

		this.modal = {
			loader: {
				show: false
			},
			subtitle: {
				text: '',
				danger: true,
				show: false
			},
			buttons: {
				save: {
					disabled: false
				}
			},
			form: {
				ordersLimit: {
					value: parseInt(data.ordersLimit) + 1,
					max: 60,
					min: parseInt(data.ordersLimit) + 1,
					step: 5
				}
			}
		};

		var timer;

		this.keyDown = function(action, value) {
			self.modal.form.ordersLimit.value = value;
			if (self.modal.subtitle.show) {
				$timeout(function() {
					self.modal.subtitle.show = false;
				}, 800);
			}

			if (timer) {
				return;
			}

			if (action === 'dec') {
				timer = $interval(function() {
					if (!isNaN(self.modal.form.ordersLimit.value)) {
						if (self.modal.form.ordersLimit.value > self.modal.form.ordersLimit.min) {
							self.modal.form.ordersLimit.value--;
						} else {
							$interval.cancel(timer);
						}
					}
				}, 60);
			} else if (action === 'inc') {
				timer = $interval(function() {
					if (!isNaN(self.modal.form.ordersLimit.value)) {
						if (self.modal.form.ordersLimit.value < self.modal.form.ordersLimit.max) {
							self.modal.form.ordersLimit.value++;
						} else {
							$interval.cancel(timer);
						}
					}
				}, 60);
			}
		};

		this.keyUp = function() {
			$interval.cancel(timer);
			timer = null;
		};

		this.setOrdersLimit = function(limit) {
			self.modal.loader.show = true;

			Settings.update({
				order_limit: limit,
				token: $auth.getToken()
			}, function(success) {
				// $log.log(success);
				self.modal.loader.show = false;
				if (success.status === 200) {
					$uibModalInstance.close({
						newOrdersLimit: limit
					});
				} else {
					$log.error(success);
				}
			}, function(error) {
				$log.error(error);
				self.modal.loader.show = false;
				self.openModalDialog({
					title: 'Houston, tenemos un problema...',
					subtitle: 'Ha ocurrido un error al cambiar el límite de pedidos!',
					submit: {
						text: 'Reintentar',
						function: function() {
							return self.setOrdersLimit(self.modal.form.ordersLimit.value);
						}
					},
					cancel: {
						text: 'Cancelar',
						function: null
					}
				});
			});
		};

		this.cancel = function() {
			$uibModalInstance.dismiss();
		};

	});