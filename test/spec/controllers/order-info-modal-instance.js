'use strict';

describe('Controller: OrderInfoModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var OrderInfoModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderInfoModalInstanceCtrl = $controller('OrderInfoModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrderInfoModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
