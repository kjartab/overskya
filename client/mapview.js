
        function getMap() {

            var map = L.map('map-view');

            // create the tile layer with correct attribution
            var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osm = new L.TileLayer(osmUrl, {});       

            // start the map in South-East England
            map.setView(new L.LatLng(51.3, 0.7),1);
            map.addLayer(osm);
            return map;
        }


        var ServerMapView = Backbone.View.extend({

            template: _.template( $('#serverTemplate').html()),

            initialize: function(options){
                this.set('map', options.map);
                this.setMarker();
                this.render();
                this.model.on('change deadTime', this.onDeadTimeChange, this);
            },

            getMap: function() {
                return this.get('map');
            },

            getMarker: function() {
                return this.get('marker');
            }

            setMarker: function() {
                var latlng = L.latLng(90*Math.random(), 90*Math.random());
                this.set('marker', L.CircleMarker(latlng));
                this.getMarker().addTo(this.getMap());
            },

            onDeadTimeChange: function(e) {
                var deadTime = this.model.get('deadTime');
                if (deadTime == 0) {
                    /* change marker color to normal */

                } else if (deadTime > 4000 && deadTime < 6000)) {
                    /* change marker to alarm */
                    
                } else {
                    /* change marker color to disconnected */
                    
                }
            },

            render: function()) {
                
            }

        });

        var ServerMapCollectionView = Backbone.View.extend({

            initialize: function() {
                // getThree();     
                this.map = getMap();
                this.render();
                //this.collection.on('change')
               // this.listenTo(this.collection, 'change', function(d) {
                //     this.render();
                // });
            },

            render: function() {
                L.marker([90*Math.random(), 90*Math.random()]).addTo(this.map);
            }

        });
