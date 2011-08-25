
/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');
var geoip = require('geoip');

var app = module.exports = express.createServer();
var webSocket = socketio.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Patron Volume'
  });
});

app.listen(3000);
webSocket.log.info("Express server listening on port " + app.address().port + " in " + app.settings.env + " mode");

var city = new geoip.City(__dirname + '/GeoLiteCity.dat');

var udpServer = require("dgram").createSocket("udp4");
udpServer.on("message", function (msg, rinfo) {
	var cityObj = city.lookupSync(msg);
	webSocket.sockets.emit('usage', [cityObj.latitude, cityObj.longitude]);
});
udpServer.on("listening", function () {
	var address = udpServer.address();
	webSocket.log.info("udp server listening " + address.address + ":" + address.port);
});
udpServer.bind(1515);
