import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import * as dat from 'dat.gui';

// Debug
//const gui = new dat.GUI()

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load('./textures/normalMap.jpg');
const dayTexture = textureLoader.load('./textures/earthMap8K.jpg');
const cloudTexture = textureLoader.load('./textures/cloudsMap4k.jpg');
const spaceTexture = textureLoader.load('./textures/space.jpg');

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

scene.background = spaceTexture;

// Objects
const geometry = new THREE.SphereGeometry(0.8, 64, 64);
const cloudGeometry = new THREE.SphereGeometry(0.805, 64, 64);

const material = new THREE.MeshStandardMaterial();
material.normalMap = normalTexture;
material.map = dayTexture;
material.wireframe = false;

const cloudMaterial = new THREE.MeshStandardMaterial();
cloudMaterial.transparent = true;
cloudMaterial.opacity = 0.5;
cloudMaterial.map = cloudTexture;
cloudMaterial.depthWrite = true;
cloudMaterial.side = THREE.DoubleSide;
cloudMaterial.wireframe = false;

const sphere = new THREE.Mesh(geometry, material);
sphere.position.set (0, 0, 0);
scene.add(sphere);

const cloudSphere = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloudSphere.position.set (0, 0, 0);
scene.add(cloudSphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(5, 5, 5);
pointLight.intensity = 1;

scene.add(pointLight);

const PointLightHelper = new THREE.PointLightHelper(pointLight, 1);

const pointLight2 = new THREE.PointLight(0xff0000, 2);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = false;
controls.enablePan = false;

// Animate
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

const clock = new THREE.Clock();

const tick = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.y += 0.1 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.1 * (targetY - sphere.rotation.x);
    sphere.rotation.z += 0.1* (targetY - sphere.rotation.x);

    cloudSphere.rotation.y = 0.1 * elapsedTime;

    cloudSphere.rotation.y += 0.1 * (targetX - sphere.rotation.y);
    cloudSphere.rotation.x += 0.1 * (targetY - sphere.rotation.x);
    cloudSphere.rotation.z += 0.1 * (targetY - sphere.rotation.x);

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();