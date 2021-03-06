'use strict';

/**
 * @ngdoc function
 * @name karamuseDjApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the karamuseDjApp
 */
angular.module('karamuseClientApp')
	.controller('ResultsCtrl', function($rootScope, $auth, $log, $mdDialog, Utils, Catalog) {

		var self = this,
			i = 0,
			ticket = Utils.getInStorage('ticket') || {
				orders: [],
				code: null
			};

		this.bar = {
			info: Utils.getInStorage('bar')
		};
		this.catalog = $rootScope.catalog;

		this.elements = {
			buttons: {
				back: {
					disabled: true
				},
				next: {
					disabled: true
				},
				search: {
					state: 1
				}
			},
			inputs: {
				search: {
					show: false,
					value: ''
				},
				blur: false
			},
			content: {
				fill: {
					show: false
				},
				empty: {
					show: true,
					icon: 'library_music',
					message: '¡Busca tus karaokes!',
					keyword: ''
				}
			}
		};

		this.pagination = {
			totalPages: 0,
			sizePage: 100,
			currentPage: 1
		};

		this.results = {
			list: []
		};

		this.ticket = Utils.getInStorage('ticket') || {
			orders: [],
			code: null
		};

		this.getKaraokes = function(keyword, sizePage, numPage, mode) {

			if (keyword === '') {
				return;
			}

			//Quita foco del imput activo
			document.activeElement.blur();

			$rootScope.clientGlobalLoader.show = true;

			self.elements.buttons.next.disabled = false;
			self.elements.buttons.back.disabled = false;

			// si el modo es back, se resta el numero pag
			if (mode === 'back') {
				numPage--;
			} else if (mode === 'next') {
				numPage++;
			}
			// Si se consulta por la pagina 1, se desbloquea el botón atrás
			if (numPage <= 1) {
				self.elements.buttons.back.disabled = true;
			}

			self.pagination.currentPage = numPage;

			self.results.list = [];

			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				$rootScope.clientGlobalLoader.show = false;
				// 200: hay resultados
				if (success.status === 200) {

					self.pagination.totalPages = success.totalPages;

					// si el numero de página siguiente es menor a la cantidad total de paginas, se desbloquea el boton sgte
					if (numPage >= self.pagination.totalPages) {
						self.elements.buttons.next.disabled = true;
					}

					self.elements.content.empty.show = false;
					self.elements.content.fill.show = true;

					self.textAd = success.text_ad;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							self.results.list.push({
								id: success.data[i].id,
								artist: success.data[i].artist,
								song: success.data[i].song,
								url: success.data[i].url,
								active: success.data[i].active,
								avatar: success.data[i].url ? 'https://img.youtube.com/vi/' + success.data[i].url.substring(success.data[i].url.indexOf('=') + 1, success.data[i].url.length) + '/0.jpg' : 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png',
								disabled: false
							});
						}
					}
				} else if (success.status === 404) {
					self.elements.content.empty.icon = 'thumb_down';
					self.elements.content.empty.message = 'No se encontraron resultados con la palabra: ';
					self.elements.content.empty.keyword = keyword;
					self.elements.content.empty.show = true;
					self.elements.content.fill.show = false;
				} else if (success.status === 401) {
					window.location.replace("http://www.karamuse.cl/");
				}
			}, function(error) {
				$rootScope.clientGlobalLoader.show = false;
				$log.error(error);
			});
		};

		// Valida si ya está en lista temporal el pedido
		this.validateOrderInTicket = function(order) {
			var isInTicket = false;

			for (i = 0; i < ticket.orders.length; i++) {
				if (ticket.orders[i].id === order.id) {
					isInTicket = true;
					break;
				}
			}
			return isInTicket;
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
				.then(function() {}, function() {});
		};

		this.openDialogNameOrMessage = function(order) {

			if (self.validateOrderInTicket(order)) {
				self.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'Ya tienes este karaoke en tu ticket'
					}
				});
			} else {
				$mdDialog.show({
						controller: 'NameOrMessageCtrl',
						controllerAs: 'nameOrMessage',
						templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
						parent: angular.element(document.querySelector('#dialogContainer')),
						clickOutsideToClose: true,
						fullscreen: false, // Only for -xs, -sm breakpoints.
						locals: {
							order: order
						}
					})
					.then(function() {}, function() {});
			}
		};

		/* QUE ES ESTO??? PORQUE ESTA 2 VECES EL METODO openDialogNameOrMessage????*/

		var openDialogNameOrMessage = function(order) {

			if (self.validateOrderInTicket(order)) {
				self.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'Ya tienes este karaoke en tu ticket'
					}
				});
			} else {
				$mdDialog.show({
						controller: 'NameOrMessageCtrl',
						controllerAs: 'nameOrMessage',
						templateUrl: 'karamuse-client.nameOrMessage.tmpl.html',
						parent: angular.element(document.querySelector('#dialogContainer')),
						clickOutsideToClose: true,
						fullscreen: false, // Only for -xs, -sm breakpoints.
						locals: {
							order: order
						}
					})
					.then(function() {}, function() {});
			}
		};

		var openDialogKaraokeDetails = function(karaokeSelected) {
			karaokeSelected.fromResults = true;

			$mdDialog.show({
					controller: 'KaraokeDetailsCtrl',
					controllerAs: 'karaokeDetails',
					templateUrl: 'karamuse-client.karaoke-details.tmpl.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					clickOutsideToClose: true,
					fullscreen: false, // Only for -xs, -sm breakpoints.
					locals: {
						karaokeSelected: karaokeSelected
					}
				})
				.then(function() {}, function() {});
		};

		this.validateKaraokeUrl = function(karaokeSelected) {
			// $log.log(karaokeSelected);
			if (karaokeSelected.url) {
				openDialogKaraokeDetails(karaokeSelected);
			} else {
				openDialogNameOrMessage(karaokeSelected);
			}
		};

		this.openDialogTicket = function() {
			$log.log("ticket.orders: " + JSON.stringify(this.ticket.orders));
			if (Utils.getInStorage('ticket').orders.length === 0) {
				this.openDialogCustomAlert({
					title: '¡Hey!',
					subtitle: '',
					body: {
						paragraph1: 'No tienes Karaokes agregados por el momento.'
					}
				});
				return;
			}

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

		this.gotoState = function(state) {
			Utils.gotoState(state);
		};

		this.onBlur = function($event) {
			// $log.log($event);
		}

		// self.switchSearch(1);

	});