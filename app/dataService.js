angular.module('trello-person')
.factory('dataService', function () {
  var service = {};

  service.parseDataByUser = function (data) {
    console.info(data);

    var users = [];

    data.forEach(function (board) {
      board.memberships.forEach(function(member) {
        if (users.indexOf(member.idMember) < 0) {
          users.push(member.idMember);
        }
      });
    });

    console.warn(users);
    return users;
  };

  function getBoardData (boardId) {
    
  };

  return service;
});
