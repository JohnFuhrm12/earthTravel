import './style.css';
import * as THREE from 'three';
//import * as dat from 'dat.gui';

// Debug
//const gui = new dat.GUI()

//Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('./textures/earthnormalmap.jpg');
const dayTexture = textureLoader.load('./textures/earthtexturemapday.jpg');
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(0.8, 120, 120);

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.map = dayTexture;
material.wireframe = false;
material.color = new THREE.Color(0xffffff);

const sphere = new THREE.Mesh(geometry, material);

sphere.position.set (0, 0, 0);

scene.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(10, 5, 5);
pointLight.intensity = 100;

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
    sphere.rotation.y = 0.5 * elapsedTime;

    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);
    sphere.rotation.z += 0.5 * (targetY - sphere.rotation.x);

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();