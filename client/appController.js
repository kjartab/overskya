

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
				activateItem(item.id);
			})
			console.log(item);

			menuItems.push(item);
		}

		function activateItem(id) {
			_.each(menuItems, function(item) {
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