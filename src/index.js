import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Group, Object3D, Vector2, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const light = new THREE.AmbientLight(0xFFFFFF, .2);
light.position.set( 50, 50, 50 );
scene.add( light );


const light2 = new THREE.SpotLight(0xFFFFFF, .5, 0, 0.45, 0.5, 0);
light2.position.set( 200, 200, 200);
light2.castShadow = true;
light2.shadow.mapSize = new Vector2(1024, 1024);
light2.shadow.camera.fov = 25;
scene.add( light2 );

const light3 = new THREE.SpotLight(0xFFFFFF, .5, 0, 0.45, 0.5, 0);
light3.position.set( -200, 200, 200);
light3.castShadow = true;
light3.shadow.mapSize = new Vector2(1024, 1024);
light3.shadow.camera.fov = 25;
scene.add( light3 );

//onst light3 = new THREE.PointLight(0xFFFFFF, 1, 0, 0);
//light3.position.set( 100, 100, );
//light3.castShadow = true;
//scene.add( light3 );


//const helper = new THREE.CameraHelper( light2.shadow.camera );
//scene.add( helper );

camera.position.z = 100;
camera.position.y = 50;
camera.lookAt(new Vector3(0, 0, 0));




const loader = new GLTFLoader()




const plane = new THREE.BoxGeometry(5000, 0.0001, 5000);
const white = new THREE.MeshStandardMaterial({ color: 0xDDDDDD, roughness: 0.1 });
const ground = new THREE.Mesh(plane, white);
ground.receiveShadow = true;

scene.add(ground);

let obj = new Object3D();
obj.castShadow = true;

scene.add(obj)

const textureLoader = new THREE.TextureLoader();
const textureEquirec = textureLoader.load( 'model3/environmentmap.jpg' );
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.encoding = THREE.sRGBEncoding;


//scene.background = textureEquirec;

scene.background = textureEquirec;
ground.material.envMap = textureEquirec;
ground.material.envMapIntensity = 1;


loader.load( 'model3/model.glb', function ( gltf ) {

    const center = new THREE.Vector3();
    new THREE.Box3().setFromObject(gltf.scene).getCenter(center);
    
    gltf.scene.translateX(-center.x);
    gltf.scene.translateZ(+center.y);
    gltf.scene.traverse( function( child ){ 
        child.castShadow = true;
        //child.receiveShadow = true;
        
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap = textureEquirec;
            child.material.envMapIntensity = 1;
        }
        
    } );


    
    gltf.scene.scale.set(5, 5, 5);
    gltf.scene.castShadow = true;
    obj.add(gltf.scene);
}, undefined, function ( error ) {

    console.error( error );

} );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


const animate = function () {
    requestAnimationFrame( animate );

    //obj.rotation.y += 0.005;

    controls.update();
    controls.autoRotate = true;

    renderer.render( scene, camera );
};

animate();