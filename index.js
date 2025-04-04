import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import spline from "./spline.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Camera Position
camera.position.z = 5;
scene.fog = new THREE.FogExp2(0x000000, 0.3)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.02;

// construct tunnel path 
const points = spline.getPoints(100)
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 })
const line = new THREE.Line(geometry, material)
// scene.add(line);

// add tube on path
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 15, true)
const tubemat = new THREE.MeshBasicMaterial({ color: 0x0099ff, wireframe: true })
const tube = new THREE.Mesh(tubeGeo, tubemat);
// scene.add(tube)

// create edge geomety on tube 
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const linemat = new THREE.LineBasicMaterial({ color: 0xffffff })
const tubeline = new THREE.LineSegments(edges, linemat)
scene.add(tubeline)


const numBoxes = 45;


// update camer 
function updateCamera(i) {
    const time = i * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

// Animation Loop
function animate(i = 0) {
    requestAnimationFrame(animate);
    updateCamera(i);
    renderer.render(scene, camera);
    controls.update();
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
