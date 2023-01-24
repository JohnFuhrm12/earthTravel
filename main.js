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

let svgFromHTML = document.getElementById('svgMap');
let svgData = (new XMLSerializer()).serializeToString(svgFromHTML);
let base64 = window.btoa(unescape(encodeURIComponent(svgData)));
let src = "data:image/svg+xml;base64," + base64;
let svgMap = textureLoader.load(src);

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

// Button Functions
const nightButton = document.querySelector('#nightBtn');
nightButton.addEventListener("click", changeToNight);

function changeToNight() {
    material.map = nightTexture;
    material.normalMap = normalTexture;
    material.specularMap = specularMap;
    material.needsUpdate = true;
    pointLight.intensity = 2.5;
};

const dayButton = document.querySelector('#dayBtn');
dayButton.addEventListener("click", changeToDay);

function changeToDay() {
    material.map = dayTexture;
    material.normalMap = normalTexture;
    material.specularMap = specularMap;
    material.needsUpdate = true;
    pointLight.intensity = 1.2;
};

const rotationButton = document.querySelector('#rotationBtn');
rotationButton.addEventListener("click", toggleRotation);

function toggleRotation() {
    if (rotating) {
        rotating = false;
    } else {
        rotating = true;
    };
};

const mapButton = document.querySelector('#mapBtn');
mapButton.addEventListener("click", mapToGlobe);

function mapToGlobe() {
    const ocean = document.querySelector('.ocean');
    const lakes = document.querySelector('.lake');
    ocean.style.fill = 'rgb(1, 1, 98)';
    lakes.style.fill = 'rgb(1, 1, 98)';

    svgFromHTML = document.getElementById('svgMap');
    svgData = (new XMLSerializer()).serializeToString(svgFromHTML);
    base64 = window.btoa(unescape(encodeURIComponent(svgData)));
    src = "data:image/svg+xml;base64," + base64;
    svgMap = textureLoader.load(src);
    material.map = svgMap;
    document.documentElement.scrollTo({ top:0, behavior:'smooth'});

    material.normalMap = null;
    material.specularMap = null;
    material.needsUpdate = true;
};

const traveledButton = document.querySelector('#traveledBtn');
traveledButton.addEventListener("click", goToTraveled);

const traveledSection = document.querySelector('#travledSection');

function goToTraveled() {
    const ocean = document.querySelector('.ocean');
    const lakes = document.querySelector('.lake');
    ocean.style.fill = 'black';
    lakes.style.fill = 'black';

    traveledSection.style.display = 'block';
    const traveledSectionTop = document.querySelector('#travledSection').offsetTop;
    window.scrollTo({ top: traveledSectionTop, behavior: 'smooth'});
};

const clearButton = document.querySelector('#clearBtn');
clearButton.addEventListener("click", clearSelection);

function clearSelection() {
    const paths = document.querySelectorAll('path');
    paths.forEach((path) => {
        path.style.fill = null;
    });
};

// SVG Map Event Listeners
const countryCodes = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BQ": "Bonaire, Sint Eustatius and Saba",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CD": "Congo",
    "CG": "Congo",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "CI": "Côte d'Ivoire",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (Malvinas)",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "North Korea",
    "KR": "South Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "MK": "Republic of North Macedonia",
    "RO": "Romania",
    "RU": "Russia",
    "RW": "Rwanda",
    "RE": "Réunion",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French Side)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch Side)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania, United Republic of",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom of Great Britain and Northern Ireland",
    "UM": "United States Minor Outlying Islands",
    "US": "United States of America",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "AX": "Åland Islands"
};

const paths = document.querySelectorAll('svg > path');
const countryName = document.querySelector('#countryName');

paths.forEach((path) => {
    path.addEventListener('click', clickHandler);
    path.addEventListener('mouseover', showCountryName);
});

const pathParents = document.querySelectorAll('g');

pathParents.forEach((pathParent) => {
    pathParent.addEventListener('click', clickHandler);
    pathParent.addEventListener('mouseover', showCountryName);
});

function showCountryName(e) {
    let countryNameFromId = e.target.id;

    if (countryNameFromId.length > 2) {
        countryNameFromId = e.target.parentElement.id;
    };

    let countryNameFromCode = countryCodes[countryNameFromId.toUpperCase()];
    if (countryNameFromCode === undefined) {
        countryNameFromCode = 'None';
    };

    countryName.innerHTML = `Selected Country: ${countryNameFromCode}`;
};

function clickHandler(e){
    let fillColor = 'lime';
    let secondFillColor = 'green';

    if (e.target.style.fill == fillColor) {
        e.target.style.fill = secondFillColor;
    } else if (e.target.style.fill == secondFillColor) {
        e.target.style.fill = null;
    } else if (e.target.style.fill !== fillColor && !e.target.classList.contains('ocean')) {
        e.target.style.fill = fillColor;
    };

    let nodes = document.getElementById(e.target.id).childNodes;
    for(let i = 0; i<nodes.length; i++) {
        if (nodes[i].nodeName.toLowerCase() == 'path') {
         nodes[i].style.fill = fillColor;
        };
    };
  };