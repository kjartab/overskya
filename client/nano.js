
n (ns) {
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
    /*
    var serverAddress = "ws://" + ns.config.server + "/overskya/ws";*/
    var serverAddress = "ws://localhost:8017/overskya/ws";

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


    
})(k);


var servers = new k.ServerCollection();

function getMap() {

    var map = L.map('map-view', {zoomControl:false});

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {});       

    // start the map in South-East England
    map.setView(new L.LatLng(51.3, 0.7),1);
    map.addLayer(osm);
    map.setZoom(4);
    //$('#map-view').css('height', window.innerHeight);
    return map;
}

function getMapWidth() {
    var width = $('#firstbar').width() + $('#secondbar').width();
    return window.innerWidth - width;
}



var map = getMap();
var serverCollectionView = new k.ServerCollectionView({ collection: servers });
var serverCollectionMapView = new k.ServerCollectionMapView({ collection: servers, map: map});

var whatView = new k.WhatView({ collection: servers, $el: $('#what-view')});

        // config object removing timeline and other elements that are on by default
        var config = {
            cesiumViewerOpts : {
                timeline: false, 
                baseLayerPicker: false, 
                geocoder : false, 
                animation: false,
                orderIndependentTranslucency: false,
                skyBox: new Cesium.SkyBox({
                  sources : {
                    positiveX : 'skybox_px.png',
                    negativeX : 'skybox_nx.png',
                    positiveY : 'skybox_py.png',
                    negativeY : 'skybox_ny.png',
                    positiveZ : 'skybox_pz.png',
                    negativeZ : 'skybox_nz.png'
                  }, show: false
                }),
                fullscreenButton: false,
                babseLayerPicker: false,
                infoBox: false,
                homeButton:false,
                sceneModePicker:false,
                navigationHelpButton: false,
                creditContainer: 'attribution'

            }
        }

var cesiumDiv= 'map-cesium-view';
var cesiumViewer = new Cesium.Viewer(cesiumDiv, config.cesiumViewerOpts);
            
            
        // Add the terrain provider (AGI)
        var cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world',
            requestVertexNormals : true,
            requestWaterMask: false
        });

        var scene = cesiumViewer.scene;
        var globe = scene.globe;
        console.log(scene);
        scene.skyAtmosphere.show = false;

        // Will use local time to estimate actual daylight 
        globe.enableLighting = false;

        // Depth test: If this isn't on, objects will be visible through the terrain.
        globe.depthTestAgainstTerrain = true;


        cesiumViewer.terrainProvider = cesiumTerrainProvider;


var serverCollectionCesiumView = new k.ServerCollectionCesiumView({collection: servers, cesiumViewer: cesiumViewer, container : $('#'+cesiumDiv)});
