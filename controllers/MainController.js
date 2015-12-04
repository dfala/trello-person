var exports = module.exports = {},
    requestify = require('requestify'),
    keys = require('../keys.js');

var Trello = function (key, token) {
  this.uri = "https://api.trello.com";
  this.key = keys.trelloKey;
  this.token = keys.trelloSecretKey;
}

Trello.prototype.createQuery = function () {
    return {key: this.key, token: this.token};
};

exports.getTrelloData = function (req, res) {
  var uri = 'https://api.trello.com/1/boards/55f6eec9ad25c6e35caf3c98';

  requestify.get(uri)
  .then(function (response) {
    console.log("RESPONSE:", response);
    res.json(response);
  })
  .catch(function (err) {
    console.log("ERROR:", err);
    res.status(500).json(err);
  });

};
