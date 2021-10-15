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

    let aspect = $("#3d-section").width() / window.innerHeight
    let d = 10
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 2000)

    camera.position.set(10, 10, 10)
    camera.lookAt(scene.position)
    controls = new OrbitControls( camera, renderer.domElement );
    
    scene.add(camera)
    controls.update();
    

    createLights(scene)
    

    const loader = new GLTFLoader();

    loader.load( '/model/masjid.gltf', function ( gltf ) {

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    loader.load( '/model/bedug.gltf', function ( gltf ) {

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // loader.load( '/model/magic_com.gltf', function ( gltf ) {

    //     var model = gltf.scene;
    //     var animations = gltf.animations;

    //     scene.add( model );
    //     mixer = new THREE.AnimationMixer( model );

    //     var action = mixer.clipAction( animations[ 0 ] ); // access first animation clip
    //     action.play();

    // }, undefined, function ( error ) {

    //     console.error( error );

    // } );

    

    animate();
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setClearColor( 0xf53CFE0, 1);

    renderer.setSize($("#3d-section").width(), window.innerHeight)
    document.getElementById('model-3d').appendChild(renderer.domElement)
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