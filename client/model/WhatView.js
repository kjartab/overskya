(function(ns) {

    ns.WhatView = Backbone.View.extend({

        initialize: function(options) {
            this.$el = options.$el;
            this.$el.html('<div class="what-container"><h4>Server monitoring</h4><p>This is a simple, real-time application for monitoring the load of servers I maintain. The application is built with a Node-backend using TCP communication between servers, and relaying this information using Websocket to the web client.</p><p>More to come.</p></div>');
            this.active = false;
        },

        disable: function() {
            this.$el.addClass('content-disabled');
            this.active = false;
        },

        enable: function() {
            this.$el.removeClass('content-disabled');
            this.active = true;
        },

        isActive: function() {
            this.active = false;
        }

    });

})(k);
                    
            