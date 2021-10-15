import * as THREE from 'https://cdn.skypack.dev/three@v0.133.1';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.133.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.133.1/examples/jsm/controls/OrbitControls.js';

let renderer;
let scene;
let camera;
let controls;
let mesh;
let mixer;
let clock;



function init() {
    createRenderer()
    scene = new THREE.Scene()
    clock = new THREE.Clock()

    let aspect = $("#animation-section").width() / window.innerHeight
    camera = new THREE.PerspectiveCamera( 45, aspect, 5, 100 );
    camera.position.set(0, 3, 10)
    camera.lookAt(scene.position)
    controls = new OrbitControls( camera, renderer.domElement );
    
    scene.add(camera)
    controls.update();
    

    createLights(scene)
    

    const loader = new GLTFLoader();

    

    loader.load( '/model/magic_com.gltf', function ( gltf ) {

        var model = gltf.scene;
        var animations = gltf.animations;

        scene.add( model );
        mixer = new THREE.AnimationMixer( model );

        var action = mixer.clipAction( animations[ 0 ] ); // access first animation clip
        action.play();

    }, undefined, function ( error ) {

        console.error( error );

    } );

    

    animate();
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setClearColor( 0xf53CFE0, 1);

    renderer.setSize($("#animation-section").width(), window.innerHeight)
    document.getElementById('animation-3d').appendChild(renderer.domElement)
}



function createLights(scene) {


    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(20, 0, 0)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(0, 20, 0)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(-20, 0, 0)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(0, -20, 0)
    scene.add(light)


    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(0, 0, 20)
    scene.add(light)

    var light = new THREE.DirectionalLight(0xffffff,0.5)
    light.position.set(0, 0, -20)
    scene.add(light)

    

}

function animate(time) {
    requestAnimationFrame(animate)
    controls.update();
    var delta = clock.getDelta(); // clock is an instance of THREE.Clock
    if ( mixer ) mixer.update( delta );

    render()
}

function render() {
    renderer.render(scene, camera)
}

init();