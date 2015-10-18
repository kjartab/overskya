


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
                        var serverView = new ns.ServerView({ model: server });
                        this.$el.append(serverView.el); 
                    }, this);
            return this;
        }

    });

})(k);

        