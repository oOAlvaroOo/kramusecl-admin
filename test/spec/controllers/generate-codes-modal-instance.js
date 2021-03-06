'use strict';

describe('Controller: GenerateCodesModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('karamuseDjApp'));

  var GenerateCodesModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GenerateCodesModalInstanceCtrl = $controller('GenerateCodesModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GenerateCodesModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
