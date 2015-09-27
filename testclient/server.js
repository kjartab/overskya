const net = require("net");

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Server: Client connected");

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
            console.log(result);
        });
        console.log("Response from client: %s", data.response);
            
        // Let's response with a hello message
        conn.write(
            JSON.stringify(
                { response: "Hey there client!" }
            )
        );
    });

});

var nodes = {};

function updateData(ip, data) {
    nodes[ip] = data;
}

// Listen for connections
server.listen(8181, "0.0.0.0", function () {
    console.log("Server: Listening");
});
