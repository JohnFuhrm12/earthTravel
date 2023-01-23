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
const nightTexture = textureLoader.load('./textures/earthNightMap.jpg');
const cloudTexture = textureLoader.load('./textures/cloudsMap4k.jpg');
const spaceTexture = textureLoader.load('./textures/space2.jpg');

const specularMap = textureLoader.load('./textures/specularMap.jpg');

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

scene.background = spaceTexture;

// Objects
const geometry = new THREE.SphereGeometry(0.8, 64, 64);
const cloudGeometry = new THREE.SphereGeometry(0.805, 64, 64);

const material = new THREE.MeshPhongMaterial();
material.normalMap = normalTexture;
material.specularMap = specularMap;
material.map = dayTexture;
material.wireframe = false;

const cloudMaterial = new THREE.MeshStandardMaterial();
cloudMaterial.transparent = true;
cloudMaterial.opacity = 0.4;
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
pointLight.position.set(5, 3, 6);
pointLight.intensity = 1.2;

scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x1300a6, 0.1);
pointLight2.position.set(5, 3, 6);
pointLight2.intensity = 0.3;

scene.add(pointLight2);

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
    alpha: true,
    antialias: true
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
let rotating = true;

const tick = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    if (!rotating) {
        sphere.rotation.y = 0 * elapsedTime;

        sphere.rotation.y += 0 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0 * (targetY - sphere.rotation.x);
        sphere.rotation.z += 0* (targetY - sphere.rotation.x);

        cloudSphere.rotation.y = 0 * elapsedTime;

        cloudSphere.rotation.y += 0 * (targetX - sphere.rotation.y);
        cloudSphere.rotation.x += 0 * (targetY - sphere.rotation.x);
        cloudSphere.rotation.z += 0 * (targetY - sphere.rotation.x);
    } else {
        sphere.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.y += 0.1 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0.1 * (targetY - sphere.rotation.x);
        sphere.rotation.z += 0.1* (targetY - sphere.rotation.x);

        cloudSphere.rotation.y = 0.1 * elapsedTime;

        cloudSphere.rotation.y += 0.1 * (targetX - sphere.rotation.y);
        cloudSphere.rotation.x += 0.1 * (targetY - sphere.rotation.x);
        cloudSphere.rotation.z += 0.1 * (targetY - sphere.rotation.x);
    };

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

const nightButton = document.querySelector('#nightBtn');
nightButton.addEventListener("click", changeToNight);

function changeToNight() {
    material.map = nightTexture;
    pointLight.intensity = 2.5;
    material.specularMap = null;
};

const dayButton = document.querySelector('#dayBtn');
dayButton.addEventListener("click", changeToDay);

function changeToDay() {
    material.map = dayTexture;
    pointLight.intensity = 1.2;
};

const rotationButton = document.querySelector('#rotationBtn');
rotationButton.addEventListener("click", toggleRotation);

function toggleRotation() {
    if (rotating) {
        rotating = false;
        rotationButton.innerHTML = 'Start Rotation';
    } else {
        rotating = true;
        rotationButton.innerHTML = 'Stop Rotation';
    };
};
