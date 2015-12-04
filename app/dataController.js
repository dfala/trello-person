angular.module('trello-person')
.controller('dataController', function ($scope, $http) {

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
    Trello.get('/member/me/boards', successGetData, errorGetData);
  };
  $scope.getData();

  function successGetData (response) {
    parseDataByUser(response);
  };

  function errorGetData (err) {
    console.error(err);
  };



  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////



  var cardsPerUser = [];
  var boards;
  var userIds;
  var promiseGoal = 0;

  var boardNamesMap = {};

  function parseDataByUser (data) {
    boards = data;
    var users = [];

    data.forEach(function (board) {
      // GET ID OF ALL USERS IN ARRAY
      board.memberships.forEach(function(member) {
        // Don't account for managers
         if (checkInvalidMember(member.idMember)) return;

        if (users.indexOf(member.idMember) < 0) {
          users.push(member.idMember);

          var obj = {
            userId: member.idMember,
            cards: []
          };
          // obj[member.idMember] = [];
          cardsPerUser.push(obj);
        }
      });

      // UPDATE BOARD NAMES OBJECT
      boardNamesMap[board.id] = board.name;

      // GET CARDS FROM EACH BOARD
      getBoardData(board.id);
    });

    userIds = users;
    return users;
  };

  function checkInvalidMember (memberId) {
    var nonAllowedMembers = [
      '54934bdddfd54cb2c7f37010', '52d84fcd9595f66b5b68801d', '4f552ff2b0ca8f2217fc7d38', '53c3772a84b64a8c50441911',
      '5474c41bf9c8688c5ec07390', '564a076e6c7e55890c4af0f1', '557976153d63ef846e16a992', '4e6a7fad05d98b02ba00845c',
      '560177cc7f811c3a8f2ac82b', '544727553007a090c3d02f7c', '560177385015d0908f5964ea', '56017726a92657be642536c3',
      '55fb8cd18615dde67bdd09b6', '55f85767d8ddcd153ed0baf1', '55f1f8466c4096eee9d49dab'
    ];
    if (nonAllowedMembers.indexOf(memberId) > -1) return true;
    return false;
  }

  /////////////////////////////////////////////////////////

  function getBoardData (boardId) {

    var success = function (cards) {
      promiseGoal += 1;

      cards.forEach(function (card) {
        // Don't consider JaneMountain or Hack ideas
        if (card.idBoard == '55fc4e7a5908de28331d8d0e' || card.idBoard == '56006352818d01c955612671') return;

        card.idMembers.forEach(function (memberId) {
          if (userIds.indexOf(memberId) < 0) return;
          card.boardName = boardNamesMap[boardId];

          cardsPerUser.forEach(function (userItem) {
            if (userItem.userId == memberId) {
              userItem.cards.push(card);
            }
          });
          // cardsPerUser[userIds.indexOf(memberId)][memberId].push(card);
        });
      });

      if (boards && (promiseGoal == boards.length)) {
        getMemberData();
      };
    };

    var error = function (err) {
      console.error(err);
    };

    Trello.get('/boards/' + boardId + '/cards', success, error);
  };

  /////////////////////////////////////////////////////////

  function getMemberData () {
    var promiseCount = 0;

    cardsPerUser.forEach(function (member) {
      Trello.get('/members/' + member.userId, function (memberData) {
        promiseCount += 1;
        member.userInfo = memberData;

        if (promiseCount === cardsPerUser.length) {
          $scope.users = cardsPerUser;
          $scope.$digest();
        }
      }, errorGetData);
    });
  };


  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  $scope.navigateToCard = function (url) {
    window.open( url, '_blank' );
  };

});
