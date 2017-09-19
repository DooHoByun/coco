
var express = require('express')
  , http = require('http')
  , path = require('path');

var ip = require("ip");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var Book = require('./models/book');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var router = require('./routes/coinAPI')(app, Book);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/coco');


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on : ' + ip.address() + ":" + app.get('port'));
});
