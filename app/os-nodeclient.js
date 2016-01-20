const net = require('net');
var proc = require('node-proc');
var getmac = require('getmac');
var os = require('os');
var config = require('./config.js');

// Socket parameters
var host = config.server.ip;
var port = config.server.port;

var timeout = config.client.timeout;
var retrying = false;
var clientName = config.client.clientName;

// Functions to handle socket events
function makeConnection () {
    socket.connect(port, host);
}

function connectEventHandler() {
    console.log('Connected');
    retrying = false;
    sendDataEverySecond();
}

function dataEventHandler(data) {
    data = JSON.parse(data);
    if (config.client.debug)
    	console.log("Response from server: %s", data.response);
}
function endEventHandler() {
    // console.log('end');
}
function timeoutEventHandler() {
    // console.log('timeout');
}
function drainEventHandler() {
    // console.log('drain');
}
function errorEventHandler(err) {
    // console.log('error');
    console.log("Error: " + err.message);
  	clearInterval(interval);

}
function closeEventHandler () {
    // console.log('close');
    if (!retrying) {
        retrying = true;
        console.log('Reconnecting...');
    }
    setTimeout(makeConnection, timeout);
}

// Create socket and bind callbacks
var socket = new net.Socket();

socket.on('connect', connectEventHandler);
socket.on('data',    dataEventHandler);
socket.on('end',     endEventHandler);
socket.on('timeout', timeoutEventHandler);
socket.on('drain',   drainEventHandler);
socket.on('error',   errorEventHandler);
socket.on('close',   closeEventHandler);

// Connect
console.log('Connecting to ' + host + ':' + port + '...');
makeConnection();

var interval;

function sendDataEverySecond() {
	interval = setInterval(function(){
        
		socket.write(JSON.stringify(
		{
			"id" : 	clientName,
			"cpus": os.cpus(),
			"loadavg": os.loadavg(),
			"memory" : {
				"free" : (os.totalmem() - os.freemem()),
				"total" : os.totalmem()
			}
		}));
	},1000);
}
