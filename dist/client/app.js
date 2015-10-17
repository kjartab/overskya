

var k = k || {};



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
        },

        getMap: function() {
            return this.map;
        }
    });

})(k);


(function(ns) {

        ns.Server = Backbone.Model.extend({

            initialize: function(data) {
                this.recursiveTimer();
                this.set('deadTime', 0);
                this.set('statusCollection', new ns.StatusCollection());
                this.get('statusCollection').on('add',
                    function(status) {
                        this.resetTimer();
                        this.statusCollectionChanged(this);
                    }, this);
            },
            statusCollectionChanged: function() {
                // trigger new event.
                this.recursiveTimer();
                this.trigger('status:change', this, this);
            },
            addedStatus: function() {
                // this.trigger('statusadded', this);
            },

            updateTimer: null,

            resetUpdateTimer: function() {
                var that = this;
                this.updateTimer = setTimeout(
                    function() {
                        that.setUpdateState(2000);
                    }, 2000);
            },

            recursiveTimer: function() {
                var that = this;
                console.log("recursive timer");
                this.updateTimer = setTimeout(
                    function() {
                        that.setUpdateState(2000);
                        that.recursiveTimer();
                    }, 2000);

            },

            resetTimer : function() {
                if(this.get('deadTime') > 0) {
                    this.set('deadTime', 0);
                }
                clearTimeout(this.updateTimer);
            },

            setUpdateState: function(timePassed) {
                var newTime = this.get('deadTime') + timePassed;
                this.set('deadTime', newTime);
            },

            addStatus: function(statusData) {
                var statusCollection = this.get('statusCollection');
                if (statusCollection.length > 99) {
                    statusCollection.pop();
                }                

                delete statusData.id;
                var status = new ns.Status(statusData);
                statusCollection.add(status);

            }

        });

        ns.ServerCollection = Backbone.Collection.extend({
            model : ns.Server,

            addStatus : function(id, statusData) {
                var server = this.get(id);
                if (server) {
                    server.addStatus(statusData);
                } else {
                    this.addServer(id, statusData);
                }
            },

            addServer : function(id, statusData) {
                var server = new ns.Server();
                server.set('id', id);
                console.log(statusData);
                server.set('lat', statusData.ipdata.lat);
                server.set('lon', statusData.ipdata.lon);
                server.addStatus(statusData);
                this.add(server);
            }

        });
})(k);



(function(ns) {

    ns.ServerView = Backbone.View.extend({

        template: _.template( $('#serverTemplate').html()),

        initialize: function(){
            this.render();
            this.model.on('status:change', this.onStatusChange, this);
            this.model.on('change deadTime', this.onDeadTimeChange, this);
        },

        onDeadTimeChange: function(e) { 
            var deadTime = this.model.get('deadTime');
            console.log(deadTime);
            if (deadTime === 0) {
                /* change marker color to normal */
               this.$el.css('background-color', '#343434');

            } else if (deadTime < 6000) {
                /* change marker to alarm */
               this.$el.css('background-color', 'yellow');
                
            } else {
                /* change marker color to disconnected */
                this.$el.css('background-color', 'red');
                
            }
        },

        onStatusChange: function(e) {
            console.log(e);
            console.log('server view sees change');
            this.render();
            //this.$el.append('test');
            var server = this.model.toJSON();
            var statuses = server.statusCollection.toJSON();
            var status = statuses[statuses.length-1];

            var display = {
                id : server.id,
                memory : status.memory,
                cpus : status.cpus
            };
            this.$el.html(this.template(display)); 
        },

        render: function() {

            var server = this.model.toJSON();
            var statuses = server.statusCollection.toJSON();
            var status = statuses[statuses.length-1];

            var display = {
                id : server.id,
                memory : status.memory,
                cpus : status.cpus
            };
            this.$el.html(this.template(display)); 
        }

    });

    ns.ServerCollectionView = Backbone.View.extend({


        initialize: function(options) {
            this.listenTo(this.collection, 'add', function(d) {
                $('#summary-view').empty();
                $('#summary-view').append(this.render().el);
            });
        },

        render: function() {
            this.$el.empty();
            this.collection.each(function(server){
                        console.log("adding: " + server);
                        var serverView = new ns.ServerView({ model: server });
                        this.$el.append(serverView.el); 
                    }, this);
            return this;
        }

    });

})(k);

        

(function(ns) {

	ns.Status = Backbone.Model.extend({ });

	ns.StatusCollection = Backbone.Collection.extend({
        model : ns.Status
	});

})(k);


function getThree() {

            var container = $('#three-view');
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera( 70, container.width() / container.height(), 1, 10000 );
                camera.position.z = 400;
            
            var renderer = new THREE.WebGLRenderer();
            var mesh;





                var geometry = new THREE.BoxGeometry( 200, 200, 200 );
                var material = new THREE.MeshBasicMaterial();

                mesh = new THREE.Mesh( geometry, material );
                scene.add( mesh );

                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( container.width() , container.height() );
                container.append( renderer.domElement );





            animate();



            function animate() {

                requestAnimationFrame( animate );

                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.01;

                renderer.render( scene, camera );

            }



        }



        var ServerThreeCollectionView = Backbone.View.extend({
            initialize: function() {
                getThree();     
                this.map = getMap();
                this.render();
                this.listenTo(this.collection, 'change', function(d) {
                    this.render();
                });
            },

            render: function() {
                L.marker([90*Math.random(), 90*Math.random()]).addTo(this.map);
            }
        });