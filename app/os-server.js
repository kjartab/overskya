const net = require("net");

process.title = 'overskya';

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Server: Client connected");

    conn.on('error', function(err){
        // Handle the connection error.
	console.log(err);    
});

    // If connection is closed
    conn.on("end", function() {
        console.log('Server: Client disconnected');
        // Close the server
    });
    // Handle data from client
    conn.on("data", function(data) {
        data = JSON.parse(data);

        
        updateData(conn.remoteAddress, data);
        server.getConnections(function(err, result) {
            if (err) {
		console.log(err);
            }
            console.log(result);
        });
        
        // Let's response with a hello message
        conn.write(
            JSON.stringify(
                { response: conn.remoteAddress }
            )
        );
    });

});

var nodes = {};

var clients = [ ];


function updateData(ip, data) {
    nodes[ip] = data;
    
    if (clients.length > 0) {
         // broadcast message to all connected clients
        var json = JSON.stringify( { type: 'status', data: nodes} );
        for (var i=0; i < clients.length; i++) {
            clients[i].sendUTF(json);
        }
    }
}

// Listen for connections
server.listen(8183, "0.0.0.0", function () {
    console.log("Server: Listening");
});


var webSocketsServerPort = 8001;

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
    console.log(request);
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    
    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (nodes.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'nodes', data: nodes} ));
    }

    // user disconnected
    connection.on('close', function(connection) {
            clients.splice(index, 1);
    });

});



