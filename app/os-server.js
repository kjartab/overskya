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
        console.log("Server: Listening");
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



