const net = require("net");
var proc = require('node-proc');
var getmac = require('getmac');
var os = require('os');

// Create a socket (client) that connects to the server
var socket = new net.Socket();
socket.connect(8183, "10.0.0.116", function () {
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
	    	{ response: "Hey there server!" ,
	    		"cpus": os.cpus(),
	    		"loadavg": os.loadavg(),
	    		"memory" : {
	    			"free" : os.freemem(),
	    			"total" : os.totalmem()
	    		}
	    	}));


},1000);

