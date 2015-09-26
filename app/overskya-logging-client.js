"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'overskya-logging-client';

var proc = require('node-proc');
var getmac = require('getmac');
// var config = require('config');

function test(error, cpuinfo) {
	console.log(cpuinfo);
}

require('getmac').getMac(function(err,macAddress){
    if (err)  throw err
    console.log(macAddress)
})

// var cpuinfo = require('cpuinfo');
 
// cpuinfo.on('update', function(d) { console.log(d); });
// cpuinfo.update();

var os = require('os');

console.log(os.networkInterfaces());
console.log(os.cpus());


const net = require("net");

// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(61337, "localhost", function () {
    console.log("Client: Connected to server");
    startLogging();
});

function startLogging() {

	

}

// Let's handle the data we get from the server
socket.on("data", function (data) {
    data = JSON.parse(data);
    console.log("Response from server: %s", data.response);
    // Respond back
    socket.write(JSON.stringify({ response: "Hey there server!" }));
    // Close the connection
    socket.end();
});