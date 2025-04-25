import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const loader = new GLTFLoader();
loader.load('./_reeliz.glb', (gltf) => {
  scene.add(gltf.scene);
});

const input = document.getElementById('textInput');
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && input.value.trim()) {
    const text = input.value.trim();
    createFloatingText(text);
    input.value = '';
  }
});

const createFloatingText = (text) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '20px Inter';
  const width = ctx.measureText(text).width;
  canvas.width = width + 20;
  canvas.height = 40;
  ctx.font = '20px Inter';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, 10, 25);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.position.set((Math.random() - 0.5) * 4, Math.random() * 2 - 1, -2 + Math.random() * -2);
  sprite.scale.set(1.5, 0.5, 1);
  scene.add(sprite);
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
