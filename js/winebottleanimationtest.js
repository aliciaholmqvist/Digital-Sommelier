let scene, camera, renderer, model;

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("wineBottle").appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Load GLB model
  const loader = new THREE.GLTFLoader();
  loader.load("../images/bottle.glb", (gltf) => {
    model = gltf.scene;
    scene.add(model);
    fitModelToCanvas();
  });

  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);

  // Start animation loop
  animate();
}

function fitModelToCanvas() {
  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = window.innerWidth / size.x;
    model.scale.setScalar(scale * 0.8); // Scale to 80% of the width for some padding
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  fitModelToCanvas();
}

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01; // Rotate the model
  }
  renderer.render(scene, camera);
}

init();
