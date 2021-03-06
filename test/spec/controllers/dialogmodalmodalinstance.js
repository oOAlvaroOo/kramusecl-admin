'use strict';

describe('Controller: DialogmodalmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var DialogmodalmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogmodalmodalinstanceCtrl = $controller('DialogmodalmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogmodalmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
