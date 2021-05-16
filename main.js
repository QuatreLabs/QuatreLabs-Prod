import * as THREE from "https://cdn.skypack.dev/three@0.128.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js";
import { SphereGeometry } from "./geometry/SphereGeometry.js";

// SCENE CREATION

const scene = new THREE.Scene();

const bgcolor = new THREE.Color(0xffffff);
scene.background = bgcolor;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.getElementById("tagline-section").appendChild(renderer.domElement);

// CAMERA CONTROL

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
// const camera = new THREE.OrthographicCamera( -window.innerWidth/60, window.innerWidth/60, window.innerHeight/60, -window.innerHeight/60, 0, 100);
// camera.position.set(0,0,20)
camera.position.z = 20
// scene.add(camera);
// new OrbitControls(camera, renderer.domElement);

// GEOMETRY STRUCTURE

const planeGeometry = new SphereGeometry(8, 40, 22);

const blueColor = 0x307eff;
const whiteColor = 0xffffff;

const material = new THREE.MeshPhysicalMaterial({
  color: blueColor,
  roughness: 0.65,
  metalness: 1,
  reflectivity: 0.5,
  flatShading: THREE.FlatShading,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(planeGeometry, material);

scene.add(mesh);

// ROTATION CONTROL

let fromRotation = new THREE.Quaternion();
fromRotation.copy(mesh.quaternion);

let toRotation = new THREE.Quaternion();
const axisNormalised = new THREE.Vector3(0, 1, 0).normalize();
const angle = 1;
toRotation.setFromAxisAngle(axisNormalised, angle);

let angle1 = 0;

function update() {
  const percent = Math.abs(angle1);
  angle1 += 0.001;

  THREE.Quaternion.slerp(fromRotation, toRotation, mesh.quaternion, percent);
}

// LIGHTING

const top_right_light = new THREE.DirectionalLight(whiteColor, 0.75);
top_right_light.position.set(1, 1, 1);
scene.add(top_right_light);

const top_left_light = new THREE.DirectionalLight(whiteColor, 0.75);
top_left_light.position.set(-1, 1, 1);
scene.add(top_left_light);

const bottom_left_light = new THREE.DirectionalLight(whiteColor, 0.75);
bottom_left_light.position.set(-1, -1, 1);
scene.add(bottom_left_light);

const bottom_right_light = new THREE.DirectionalLight(whiteColor, 0.75);
bottom_right_light.position.set(1, -1, 1);
scene.add(bottom_right_light);

// MAIN FUNCTION

function animate() {
  update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

animate();
