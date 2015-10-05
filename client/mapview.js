
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


        

        var ServerMapCollectionView = Backbone.View.extend({

            initialize: function() {
                // getThree();     
                // this.map = getMap();
                // this.render();
                // this.listenTo(this.collection, 'change', function(d) {
                //     this.render();
                // });
            },

            render: function() {
                L.marker([90*Math.random(), 90*Math.random()]).addTo(this.map);
            }

        });
