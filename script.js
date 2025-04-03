import * as THREE from "https://esm.sh/three@latest";
import { GLTFLoader } from "https://esm.sh/three@latest/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://esm.sh/three@latest/examples/jsm/controls/OrbitControls.js";

// 🎥 Set up Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 💡 Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 🎮 Smooth Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Smoother stopping motion
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2; // Adjust zoom speed
controls.enableZoom = true;
controls.minDistance = 5;  // Prevent excessive zoom-in
controls.maxDistance = 100; // Prevent zooming too far out

// 🔄 Load Model
const loader = new GLTFLoader();
let model;

loader.load("./SmartcityV4.glb", (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.position.y = 0;
    scene.add(model);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

// 🎯 Set Initial Camera Position (Farther Out for Smooth Zoom)
camera.position.set(10, 10, 10);
controls.update(); // Apply target position

// 🔥 Scroll-based Model Movement (Doesn't Affect Camera Zoom)
window.addEventListener("scroll", () => {
    if (model) {
        let scrollY = window.scrollY;
        model.position.y = -scrollY * 0.01; // Move model up/down slightly
        model.rotation.y = scrollY * 0.002; // Rotate slightly
    }
});

// 📌 Responsive Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🚀 Animation Loop (Smooth Camera Rotation)
let angle = 0;

function animate() {
    requestAnimationFrame(animate);

    // 🌀 Rotate Camera Around the Scene, But Keep User Zoom Control
    angle += 0.001; // Slower, smoother rotation
    const radius = controls.target.distanceTo(camera.position); // Maintain zoom level
    camera.position.x = Math.sin(angle) * radius;
    camera.lookAt(controls.target); // Always look at the center of the model

    controls.update(); // Smooth controls
    renderer.render(scene, camera);
}
animate();
