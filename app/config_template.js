(function(module) {

 	var randomName = "server"+Math.random();

    module.exports.getName = function () {
		return randomName;
    };

})(module);