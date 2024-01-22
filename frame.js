var scene = new THREE.Scene();

/**
 * Light
 */
 var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
 directionalLight.position.set(400, 200, 300);
 scene.add(directionalLight);
 
 var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
 directionalLight2.position.set(-400, -200, -300);
 scene.add(directionalLight2);

var ambient = new THREE.AmbientLight(0xffffff,0.4);
scene.add(ambient);
/**
 * Camera
 */
var width = window.innerWidth; 
var height = window.innerHeight; 
var k = width / height; 
var s = 150; 
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(11, 280, 299); 
camera.lookAt(scene.position); 
/**
 * render obj
 */
var renderer = new THREE.WebGLRenderer({
  antialias: true, 
});
renderer.setSize(width, height); 
document.body.appendChild(renderer.domElement); 
var controls = new THREE.OrbitControls(camera, renderer.domElement);
