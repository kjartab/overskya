(function(module) {

 	var serverName = "regn";
 	var hostIp = "localhost";
 	//var hostIp = "some ip";
 	
    module.exports.getName = function () {
		return serverName;
    };

    module.exports.getHostIp = function () {
    	return hostIp;
    };

})(module);