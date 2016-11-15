'use strict';

/**
 * @ngdoc function
 * @name karamuseClientApp.controller:SearchKaraokeCtrl
 * @description
 * # SearchKaraokeCtrl
 * Controller of the karamuseClientApp
 */
angular.module('karamuseClientApp')
	.controller('SearchKaraokeCtrl', function($rootScope, $location, $auth, $log, $state, Utils, Catalog) {

		var self = this,
			i = 0;

		this.bar = {
			info: Utils.getInStorage('bar')
		};

		this.form = {
			buttons: {
				search: {
					disabled: false
				}
			}
		};

		$rootScope.catalog = {
			list: [],
			pagination: {
				show: false,
				currentPage: 1,
				sizePage: 100,
				maxSize: 5,
				totalResults: 1,
				totalPages: 1
			},
			show: false,
			criterion: {
				text: '',
				focus: true
			}
		};

		this.getKaraokes = function(keyword, sizePage, numPage) {
			Catalog.query({
				keyword: keyword,
				sizePage: sizePage,
				numPage: numPage,
				token: $auth.getToken()
			}, function(success) {
				$log.log(success);
				if (success.status === 200) { // 200 = hay resultados
					$rootScope.catalog.pagination.totalPages = success.totalPages;
					$rootScope.catalog.pagination.totalResults = success.totalResults;
					$rootScope.catalog.pagination.show = true;

					for (i = 0; i < success.data.length; i++) {
						if (success.data[i].active === '1') {
							$rootScope.catalog.list.push({
								id: success.data[i].id,
								title: success.data[i].title,
								url: success.data[i].url,
								active: success.data[i].active,
								avatar: 'https://img.youtube.com/vi/' + success.data[i].url.substring(success.data[i].url.indexOf('=') + 1, success.data[i].url.length) + '/mqdefault.jpg'
							});
						}
					}

					$state.go('client.results');
				} else if (success.status === 404) { // 404 = no hay resultados
					self.gotoEmptyState(keyword);
				}
			}, function(error) {
				$log.error(error);
				// self.openModalDialog({
				// 	title: 'Houston, tenemos un problema...',
				// 	subtitle: 'Ha ocurrido un error al buscar tus karaokes D:',
				// 	submit: {
				// 		text: 'Reintentar',
				// 		function: function() {
				// 			return self.getKaraokes($rootScope.catalog.criterion.text, $rootScope.catalog.pagination.sizePage, $rootScope.catalog.pagination.currentPage);
				// 		},
				// 		show: true
				// 	},
				// 	cancel: {
				// 		text: 'Cancelar',
				// 		function: null
				// 	}
				// });
			});
		};

		this.gotoEmptyState = function(data) {
			Utils.gotoState('client.empty-state', {
				data: {
					messages: {
						primary: 'que contengan `' + data + '`'
					}
				}
			});
		};


	});