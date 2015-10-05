

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