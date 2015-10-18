(function(module) {

 	//var serverName = "server"+Math.random();
 	var serverName = "regn";

 	var hostIp = "localhost";
 	var hostIp = "178.62.98.218";
 	var hostIp = "84.48.195.109";
 	
    module.exports.getName = function () {
		return serverName;
    };

})(module);
(function(module) {

 	//var serverName = "server"+Math.random();
 	var serverName = "regn";

 	var hostIp = "localhost";
 	var hostIp = "178.62.98.218";
 	var hostIp = "84.48.195.109";
 	
    module.exports.getName = function () {
		return serverName;
    };

})(module);
const net = require("net");
var proc = require('node-proc');
var getmac = require('getmac');
var os = require('os');
var config = require('./config.js');

var socket = new net.Socket();
//var server = "178.62.98.218";
//var server = "localhost";
var server = "84.48.195.109";
var server = "localhost";
socket.connect(8183, server, function () {
    console.log("Client: Connected to server");
});



// Let's handle the data we get from the server
socket.on("data", function (data) {
    data = JSON.parse(data);
    console.log("Response from server: %s", data.response);
    // Respond back
    // Close the connection
});

setInterval(function(){

	    socket.write(JSON.stringify(
	    		{
                "id" : config.getName(),
	    		"cpus": os.cpus(),
	    		"loadavg": os.loadavg(),
	    		"memory" : {
	    			"free" : os.freemem(),
	    			"total" : os.totalmem()
	    		}
	    	}));


},1000);


const net = require("net");
var http = require("http");

    process.title = 'overskya';

    // Create a simple server
    var server = net.createServer(function (conn) {
        console.log("Server: Node client connected");

        conn.on('error', function(err){

            console.log(err);    
        });             

        conn.on("end", function() { 
            console.log('Server: Node client disconnected');
        });

        // Handle data from client
        conn.on("data", function(data) {

              try {
                data = JSON.parse(data);
              } catch (e) {
                return console.error(e);
                data = null;
              }

            if (data) {
                tryUpdate(conn.remoteAddress, data);
            }
            
            conn.write(
                JSON.stringify(
                    { response: conn.remoteAddress }
                )
            );


        });

    });

    var nodes = {};
    var clients = [];
    var ipLocations = {};

    
    // Listen for connections
    server.listen(8183, "0.0.0.0", function () {
        console.log("Server: Listening port " + 8183);
    });


    function tryUpdate(ip, data) {

        if (ipLocations.hasOwnProperty(ip)) {

            ipData = ipLocations[ip];
            updateData(ip, ipData, data);
        } else {

            findGeolocation(ip, function(response) {
                var str = '';

                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });

                //the whole response has been recieved, so we just print it out here
                response.on('end', function () {
                    var ipdata = JSON.parse(str);
                    ipLocations[ipdata.query] = ipdata;

                    updateData(ip, ipdata, data);
                });

            });
        }
    }

    function updateData(ip, ipData, data) {

        data['ipdata'] = ipData;
        data['ip'] = ip;
        
        if (clients.length > 0) {
            var json = JSON.stringify( { type: 'status', data: data} );
            for (var i=0; i < clients.length; i++) {
                clients[i].sendUTF(json);
            }
        }
    }

    function findGeolocation(ip, successCallback) {

        //IP in private range
        if (ip.lastIndexOf("10.", 0) === 0 || ip.lastIndexOf("127.", 0) === 0) {
            ip = "";
        }

        var options = {
            host: 'ip-api.com',
            path: '/json/'+ip
        };

        http.request(options, successCallback).end();

    }

    var webSocketsServerPort = 8000;
    var webSocketServer = require('websocket').server;
    var http = require('http');

    /**
     * HTTP server
     */
    var httpServer = http.createServer(function(request, response) {
        
    });

    httpServer.listen(webSocketsServerPort, function() {
        console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
    });

    /**
     * WebSocket server
     */
    var wsServer = new webSocketServer({
        httpServer: httpServer
    });


    wsServer.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
        var connection = request.accept(null, request.origin); 
        var index = clients.push(connection) - 1;

        console.log((new Date()) + ' Connection accepted.');

        if (nodes.length > 0) {
            connection.sendUTF(JSON.stringify( { type: 'nodes', data: nodes} ));
        }

        // user disconnected
        connection.on('close', function(connection) {
                clients.splice(index, 1);
        });

    });




$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');


    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://178.62.98.218:81');

    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Choose name:');
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        
        console.log(message);

    };

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

});