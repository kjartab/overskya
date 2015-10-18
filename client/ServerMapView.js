

(function(ns) {

    ns.ServerMapView = Backbone.View.extend({



        initialize: function(options){
            this.map = options.map;
            var lat = options.model.get('lat');
            var lon = options.model.get('lon');
            this.setMarker(lat, lon);
            this.model.on('change deadTime', this.onDeadTimeChange, this);
            this.render();

        },

        getMap: function() {
            return this.map;
        },

        getMarker: function() {
            return this.marker;
        },

        setMarker: function(lat, lng) {
            var latlng = L.latLng(lat, lng);
            this.marker =  new L.CircleMarker(latlng);
        },

        onDeadTimeChange: function(e) {

            var deadTime = this.model.get('deadTime');

            if (deadTime === 0) {
                this.getMarker().setStyle({fillColor: '#0000ff'});
            } else if (deadTime < 6000) {
                this.getMarker().setStyle({fillColor: '#dddddd'});
                /* change marker to alarm */
            } else {
                this.getMarker().setStyle({fillColor: '#ff0000'});
            }
        },

        render: function() {        
            if (this.getMap().hasLayer(this.getMarker())) {
                this.getMap().removeLayer(this.getMarker);
            }
            this.getMarker().addTo(this.getMap());
        }

    });

    ns.ServerCollectionMapView = Backbone.View.extend({


        initialize: function(options) {
            this.map = options.map;

            this.listenTo(this.collection, 'add', function(server) {
                var serverMapView = new ns.ServerMapView({ model: server, map: this.map });
            });
            this.active = true;
        },

        disable: function() {
            $(this.map._container).addClass('content-disabled');
            this.active = false;
        },

        enable: function() {
            $(this.map._container).removeClass('content-disabled');
            this.active = true;
        },

        isActive: function() {
            return this.active;
        },

        getMap: function() {
            return this.map;
        }
    });

})(k);