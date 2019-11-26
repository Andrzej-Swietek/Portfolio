// threeshowcase.js

// Constants
const canvas_width = 1200;
const canvas_height = 800;

// Scene init.
var scene = new THREE.Scene();

// Camera init. 65 deg fov.
var camera = new THREE.PerspectiveCamera(65,
   canvas_width / canvas_height, 0.1, 100);
var flashlight = new THREE.DirectionalLight(0xfd9e9e, 0.2);
scene.add(flashlight);
camera.position.z = -5

// Renderer init.
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas_width, canvas_height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
var composer = new THREE.EffectComposer(renderer);

var render_pass = new THREE.RenderPass(scene, camera);
var ub_pass = new THREE.UnrealBloomPass(new THREE.Vector2(canvas_width, canvas_height), 1, 0.4, 0.85)
composer.addPass(render_pass);
composer.addPass(ub_pass);

// Lighting setup.
var sun = new THREE.DirectionalLight(0xcdcebe, 10);
var albedo = new THREE.HemisphereLight(0xffffff, 0x202080, 3);
sun.position.set(4,4,4);
sun.castShadow = true;
scene.add(sun);
scene.add(albedo);

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

// Loader setup.
var gltf_loader = new THREE.GLTFLoader();
var cube_loader = new THREE.CubeTextureLoader();

// Cube loading array.
let format = '.png';
let path = './dupemap/'
var url_array = [
  path + 'px' + format,
  path + 'nx' + format,
  path + 'py' + format,
  path + 'ny' + format,
  path + 'pz' + format,
  path + 'nz' + format,
];

// Load it in.
var refl_cube = cube_loader.load(url_array);
refl_cube.format = THREE.RGBFormat;
scene.background = refl_cube;

// Orbit controls setup.
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.update();

// Robo geometry and materials.
var robo;
gltf_loader.load('./models/robo.gltf',
  function onLoad(obj) {
    // Sets envMap for every material.
    var asset = obj.scene.children[0]
    asset.children.forEach(
      function (index) {
        index.material.envMap = refl_cube;
        index.material.envMapIntensity = 2;
        index.castShadow = true;
        index.receiveShadow = true;
      });
    asset.scale.set(0.03, 0.03, 0.03);
    window.robo = asset;
    scene.add(robo);
  });



function animate() {
  controls.update();
  flashlight.position.copy(camera.position);
  flashlight.lookAt(new THREE.Vector3(0, 0, 0));
  requestAnimationFrame(animate);
  /*try {
    robo.rotation.y += 0.02;
  } catch(err) {}*/
  composer.render(scene, camera);
};
animate();
