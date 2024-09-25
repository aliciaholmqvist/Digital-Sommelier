// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("wineBottle");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();

  let effect;
  let characters = " .:-+*=%@#";
  const effectSize = { amount: 0.175 };
  let backgroundColor = "transparent";
  let ASCIIColor = "white";

  function createEffect() {
    effect = new THREE.AsciiEffect(renderer, characters, {
      invert: true,
      resolution: effectSize.amount,
    });
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
  }

  createEffect();
  canvas.appendChild(effect.domElement);

  function setRendererSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Update renderer and effect size
    renderer.setSize(width, height, false);
    effect.setSize(width, height);

    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  setRendererSize();

  // Add lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.z = 1;
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight2.position.z = 1;
  scene.add(directionalLight2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Initialize a model to make it accessible to other functions
  let model;
  const loader = new THREE.GLTFLoader();
  loader.load("../images/bottle.glb", function (gltf) {
    model = gltf.scene;

    // Apply MeshLambertMaterial to all meshes
    model.traverse((node) => {
      if (node.isMesh) {
        node.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      }
    });

    // Calculate model's bounding box
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Add a padding factor (e.g., 1.2 for 20% extra space around the model)
    const paddingFactor = 1.2;

    // Calculate distance required to fit the model in view with padding
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const cameraDistance = (maxDim / (2 * Math.tan(fov / 2))) * paddingFactor;

    // Adjust camera position based on model size and canvas size
    camera.position.z = cameraDistance;

    // Center the model
    const center = boundingBox.getCenter(new THREE.Vector3());
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;

    scene.add(model);
  });

  // Create a div to hide the thin border around the ascii effect
  const canvasFrame = document.createElement("div");

  function updateCanvasFrameSize() {
    // Get the first child of the wineBottle element
    const firstChildDiv = canvas.firstElementChild;

    // Get the height of the first child div
    const height = firstChildDiv.offsetHeight;

    // Get the table inside the wineBottle div
    const table = canvas.querySelector("table");

    // Get the width of the table or fall back to canvas width
    const width = table.offsetWidth;

    // Set the border, height, and width of the canvasFrame
    canvasFrame.style.border = "2px solid #290e3a";
    canvasFrame.style.height = height + "px";
    canvasFrame.style.width = width + "px";
    canvasFrame.style.top = 0;
    canvasFrame.style.left = 0;
    canvasFrame.style.position = "absolute";
  }

  // Append the canvasFrame div to the canvas
  canvas.appendChild(canvasFrame);

  // Initial size setup
  updateCanvasFrameSize();

  // Animation and render loop
  function animate() {
    requestAnimationFrame(animate);

    // Update lighting positions
    const radius = 5;
    const lightSpeed = 0.001;
    const timeOffset = 2.5;
    const time = Date.now() * lightSpeed;

    directionalLight.position.x = Math.cos(time) * radius;
    directionalLight.position.z = Math.sin(time) * radius;

    directionalLight2.position.x = Math.cos(time + timeOffset) * radius;
    directionalLight2.position.z = Math.sin(time + timeOffset) * radius;

    // Render the scene using the ASCII effect
    effect.render(scene, camera);

    // Ensure the canvas frame is rendered at each frame
    updateCanvasFrameSize();
  }

  animate();

  // Resize event listener
  window.addEventListener("resize", () => {
    setRendererSize(); // Update renderer size
  });
});
