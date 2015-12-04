angular.module('trello-person')
.factory('dataService', function () {
  var service = {};

  var cardsPerUser = [];
  var boards;
  var userIds;
  var promiseGoal = 0;

  var boardNamesMap = {};

  service.parseDataByUser = function (data) {
    console.info(data);
    boards = data;

    var users = [];

    data.forEach(function (board) {
      // GET ID OF ALL USERS IN ARRAY
      board.memberships.forEach(function(member) {
        if (users.indexOf(member.idMember) < 0) {
          users.push(member.idMember);

          var obj = {};
          obj[member.idMember] = [];
          cardsPerUser.push(obj);
        }
      });

      // UPDATE BOARD NAMES OBJECT
      boardNamesMap[board.id] = board.name;

      // GET CARDS FROM EACH BOARD
      getBoardData(board.id);
    });
    console.error(boardNamesMap);
    userIds = users;
    return users;
  };

  function getBoardData (boardId) {

    var success = function (cards) {
      promiseGoal += 1;
      console.log(cards);
      cards.forEach(function (card) {
        card.idMembers.forEach(function (memberId) {
          if (userIds.indexOf(memberId) < 0) return;
          card.boardName = getBoardName(card.idBoard);
          cardsPerUser[userIds.indexOf(memberId)][memberId].push(card);
        });
      });

      if (boards && (promiseGoal == boards.length)) console.warn(cardsPerUser);
    };

    var error = function (err) {
      console.error(err);
    };

    Trello.get('/boards/' + boardId + '/cards', success, error);

  };


  function getBoardName (boardId) {
    return boardNamesMap[boardId]
  };

  return service;
});
