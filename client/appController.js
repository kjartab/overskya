

(function(ns) {


	ns.AppController = function() {

		var menuItems = [];

		function addItem(id, $button, viewController) {
			var item = {
				'id' : id,
				'button' : $button, 
				'viewController' : viewController
			};
			item.button.on('click', function(event) {
				console.log(item);
				console.log('click')
				activateItem(item.id);
			})

			menuItems.push(item);
		}

		function activateItem(id) {

			_.each(menuItems, function(item) {
				console.log(item);
				console.log(item.id);
				console.log('and id ' + id);
				if (item.id == id && !item.viewController.isActive()) {
					item.viewController.enable();
				} else if (item.id != id && item.viewController.isActive()) {
					item.viewController.disable();
				}
			});
		}



		return {
			addItem: addItem
		}

	}

})(k);