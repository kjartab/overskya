

(function(ns) {




    ns.ServerCesiumView = Backbone.View.extend({



        initialize: function(options){
            this.cesiumViewer = options.cesiumViewer;
            var lat = options.model.get('lat');
            var lon = options.model.get('lon');
            var name = this.model.get('id');
            this.setMarker(lat, lon, name);
            this.model.on('change deadTime', this.onDeadTimeChange, this);

            this.render();

        },

        setMarker: function(lat, lng, name) {
            // Adding a marker for Stryn
            var strynMarker = this.cesiumViewer.entities.add({
              position : Cesium.Cartesian3.fromDegrees(lng, lat, 89990),
              billboard : {
                    image : '../common/img/marker-icon-green.png',
                    show : true, // default
                    scale : 1
              },
              label : {
                text : name,
                font : '10pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE
              }
            });

            this.marker = strynMarker;
        },

        onDeadTimeChange: function(e) {

            var deadTime = this.model.get('deadTime');

            // if (deadTime === 0) {
            //     this.getMarker().setStyle({fillColor: '#0000ff'});
            // } else if (deadTime < 6000) {
            //     this.getMarker().setStyle({fillColor: '#dddddd'});
            //     /* change marker to alarm */
            // } else {
            //     this.getMarker().setStyle({fillColor: '#ff0000'});
            // }
        },

        render: function() {
            // if (this.getMap().hasLayer(this.getMarker())) {
            //     this.getMap().removeLayer(this.getMarker);
            // }
            // this.getMarker().addTo(this.getMap());
        }

    });

    ns.ServerCollectionCesiumView = Backbone.View.extend({


        initialize: function(options) {
            this.$container = options.container;
            this.cesiumViewer = options.cesiumViewer;
            this.active = false;
            this.listenTo(this.collection, 'add', function(server) {
                var serverMapView = new ns.ServerCesiumView({ model: server, cesiumViewer: this.cesiumViewer });
            });
        },


        disable: function() {
            this.$container.addClass('content-disabled');
            this.active = false;
        },

        enable: function() {
            this.$container.removeClass('content-disabled');
            this.active = true;
        },


        isActive: function() {
            return this.active;
        },


        getMap: function() {
            return this.cesiumViewer;
        }
    });

})(k);