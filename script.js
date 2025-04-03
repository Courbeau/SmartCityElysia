import * as THREE from "https://esm.sh/three@latest";
import { GLTFLoader } from "https://esm.sh/three@latest/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://esm.sh/three@latest/examples/jsm/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", () => {
    // 📝 Select "Spin Me!" Message from HTML
    const spinMessage = document.getElementById("spin-message");

    // 🎥 Set up Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xC0C0C0, 1); // Set the background color of the canvas to white


    // 💡 Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 🎮 Orbit Controls (No Auto-Rotation)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 1.1;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;

    // 🎯 Hide Message on First User Interaction
    let userInteracted = false;
    function hideMessage() {
        if (!userInteracted && spinMessage) {
            spinMessage.style.opacity = "0";
            setTimeout(() => spinMessage.remove(), 500); // Remove from DOM after fade-out
            userInteracted = true;
        }
    }

    // Listen for any user interaction
    controls.addEventListener("start", hideMessage);

    // 🔄 Load Model
    const loader = new GLTFLoader();
    let model;

    loader.load("./SmartcityV5.glb", (gltf) => {
        model = gltf.scene;

        // 🌍 Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y = -box.min.y; // Ensure it rests on the ground
        scene.add(model);

        // 🎯 Set camera to focus on the model
        controls.target.copy(center);
        camera.position.set(center.x + 15, center.y + 10, center.z + 15);
        controls.update();
    }, undefined, (error) => {
        console.error("Error loading model:", error);
    });

    // 📌 Responsive Resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 🚀 Animation Loop (No Auto-Rotation)
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});
