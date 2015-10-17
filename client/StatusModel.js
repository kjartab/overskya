
(function(ns) {

	ns.Status = Backbone.Model.extend({ });

	ns.StatusCollection = Backbone.Collection.extend({
        model : ns.Status
	});

})(k);