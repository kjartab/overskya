

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