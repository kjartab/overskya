"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'overskya-logging-client';

var proc = require('node-proc');

function test(error, cpuinfo) {
	console.log(cpuinfo);
}



// var cpuinfo = require('cpuinfo');
 
// cpuinfo.on('update', function(d) { console.log(d); });
// cpuinfo.update();

var os = require('os');

// console.log(os.cpus());
// console.log(os.networkInterfaces());

