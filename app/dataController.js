angular.module('trello-person')
.controller('dataController', function ($scope, $http, dataService) {

  var authenticationSuccess = function() { console.log("Successful authentication"); };
  var authenticationFailure = function() { console.log("Failed authentication"); };

  $scope.authenticate = function () {
    Trello.authorize({
      type: "popup",
      name: "Getting Started Application",
      scope: {
        read: true,
        write: true },
      expiration: "never",
      authenticationSuccess,
      authenticationFailure
    });
  };
  $scope.authenticate();


  $scope.getData = function () {
    Trello.get('/member/me/boards', success, error);
  };

  function success (response) {
    $scope.users = dataService.parseDataByUser(response);
    $scope.$digest();
  };

  function error (err) {
    console.error(err);
  };

});
