

(function(ns) {




    ns.ServerCesiumView = Backbone.View.extend({



        initialize: function(options){
            this.cesiumViewer = options.cesiumViewer;
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
            console.log(this);
            // Adding a marker for Stryn
            var strynMarker = this.cesiumViewer.entities.add({
              position : Cesium.Cartesian3.fromDegrees(lng, lat, 80),
              billboard : {
                    image : '../common/img/marker-icon-green.png',
                    show : true, // default
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    scale : 1
              },
              label : {
                text : 'Stryn',
                font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, 32)
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
            this.cesiumViewer = options.cesiumViewer;
            this.listenTo(this.collection, 'add', function(server) {
                var serverMapView = new ns.ServerCesiumView({ model: server, cesiumViewer: this.cesiumViewer });
            });
        },

        getMap: function() {
            return this.cesiumViewer ;
        }
    });

})(k);