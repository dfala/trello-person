var express     = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors')

// App definition
var app = express();
app.use(cors());

// Expanding server capacity
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Routing
app.use(express.static(__dirname + '/'));

// API
var MainController = require('./controllers/MainController.js');
app.get('/api/get-trello-data', MainController.getTrelloData);

// Turn on server
var portNum = 3000;
app.listen(portNum, function () {
    console.log('Trello-person listening on port: ' + portNum);
});
