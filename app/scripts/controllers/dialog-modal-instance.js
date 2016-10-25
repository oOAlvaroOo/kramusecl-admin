'use strict';

/**
 * @ngdoc function
 * @name karamuseclAdminApp.controller:DialogModalModalInstanceCtrl
 * @description
 * # DialogModalModalInstanceCtrl
 * Controller of the karamuseclAdminApp
 */
angular.module('karamuseclAdminApp')
  .controller('DialogModalInstanceCtrl', function($log, $uibModalInstance, data) {

    var self = this;

    this.modal = {
      title: {
        text: data.title || null,
        show: true
      },
      subtitle: {
        text: data.subtitle || null,
        show: true
      },
      paragraph1: {
        text: null,
        show: false
      },
      paragraph2: {
        text: null,
        show: false
      },
      paragraph3: {
        text: null,
        show: false
      },
      buttons: {
        submit: {
          function: data.submit.function || null,
          text: data.submit.text || null,
          show: data.submit.show
        },
        cancel: {
          function: data.cancel.function || function() {
            return self.cancel();
          },
          text: data.cancel.text || null,
          show: data.cancel.show || false
        }
      }
    };

    this.cancel = function() {
      $uibModalInstance.dismiss();
    };

    // $log.log(data);
  });