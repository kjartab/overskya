
        
        var Status = Backbone.Model.extend({ });

        var StatusCollection = Backbone.Collection.extend({
                model : Status
        });


        var Server = Backbone.Model.extend({

            initialize: function(data) {
                this.recursiveTimer();
                this.set('deadTime', 0);
                this.set('statusCollection', new StatusCollection());
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

                delete statusData['id'];
                var status = new Status(statusData);
                statusCollection.add(status);

            }

        });

        var ServerCollection = Backbone.Collection.extend({
            model : Server,

            addStatus : function(id, statusData) {
                var server = this.get(id);
                if (server) {
                    server.addStatus(statusData);
                } else {
                    this.addServer(id, statusData);
                }
            },

            addServer : function(id, statusData) {
                var server = new Server();
                server.set('id', id);
                console.log(statusData);
                server.set('lat', statusData.ipdata.lat);
                server.set('lon', statusData.ipdata.lon);
                server.addStatus(statusData);
                this.add(server);
            }

        });


        var servers = new ServerCollection();

        var ServerView = Backbone.View.extend({

            template: _.template( $('#serverTemplate').html()),

            initialize: function(){
                this.render();
                this.model.on('status:change', this.onStatusChange, this);
                this.model.on('change deadTime', this.onDeadTimeChange, this);
            },

            onDeadTimeChange: function(e) { 
                var deadTime = this.model.get('deadTime');
                console.log(deadTime);
                if (deadTime == 0) {
                    /* change marker color to normal */
                   this.$el.css('background-color', 'white');

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
                var status = statuses[statuses.length-1]

                var display = {
                    id : server.id,
                    memory : status.memory,
                    cpus : status.cpus
                }
                this.$el.html(this.template(display)); 
            },

            render: function() {

                var server = this.model.toJSON();
                var statuses = server.statusCollection.toJSON();
                var status = statuses[statuses.length-1]

                var display = {
                    id : server.id,
                    memory : status.memory,
                    cpus : status.cpus
                }
                this.$el.html(this.template(display)); 
            }

        });

        var ServerCollectionView = Backbone.View.extend({


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
                            var serverView = new ServerView({ model: server });
                            this.$el.append(serverView.el); 
                        }, this);
                return this;
            }

        });

        
        
        
$(function () {
    "use strict";    

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }
    
    var serverAddress = "ws://178.62.98.218:8000";
    var serverAddress = "ws://localhost:8000";

    // open connection
    var connection = new WebSocket(serverAddress);

    connection.onopen = function () {
        // first we want users to enter their names
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
    
            var json = JSON.parse(message.data);
            servers.addStatus(json.data.id, json.data);
    };




    setInterval(function() {
        
        if (connection.readyState !== 1) {
            console.log('error');
            console.log(connection);
        }
    }, 3000);


    
});


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

        if (deadTime == 0) {
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

var ServerCollectionMapView = Backbone.View.extend({


    initialize: function(options) {
        this.map = options.map;
        this.listenTo(this.collection, 'add', function(server) {
            var serverMapView = new ServerMapView({ model: server, map: this.map });
        });
    },

    getMap: function() {
        return this.map;
    }
});

var map = getMap();
        var serverCollectionView = new ServerCollectionView({ collection: servers });
        var serverCollectionMapView = new ServerCollectionMapView({ collection: servers, map: map});