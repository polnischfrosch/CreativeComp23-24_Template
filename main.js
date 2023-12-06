//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;

//-- GUI PARAMETERS
var gui;
const parameters = {
  InputRadius: 5,
  RecursionDepth: 5
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cubes
let inputRadius = parameters.InputRadius;
let recursionDepth = parameters.RecursionDepth;

function main(){
  //GUI
  gui = new GUI;
  gui.add(parameters, 'InputRadius', 1, 10, 0.1);
  gui.add(parameters, 'RecursionDepth', 1, 10, 1);

  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 15, width / height, 0.1, 1000);
  camera.position.set(10, 10, 10)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  // Create circles here

  var circles = generateCircles(0, 0, 0, 5, 7);
  console.log(circles);

  circles.forEach((element) => scene.add(element.lineRepresentation));


  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 
//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------
//GEOMETRY FUNCTIONS

//Remove 3D Objects and clean the caches
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;

  //Remove the geometry to free GPU resources
  if(sceneObject.geometry) sceneObject.geometry.dispose();

  //Remove the material to free GPU resources
  if(sceneObject.material){
    if (sceneObject.material instanceof Array) {
      sceneObject.material.forEach(material => material.dispose());
    } else {
        sceneObject.material.dispose();
    }
  }
  //Remove object from scene
  sceneObject.removeFromParent();
}

//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

//ANIMATE AND RENDER
function animate() {
	requestAnimationFrame( animate );
 
  control.update();

  if(inputRadius != parameters.InputRadius){
  }

  if (recursionDepth != parameters.RecursionDepth){
  }
 
	renderer.render( scene, camera );
}

function generateCircles(x,y,z, radius, depth){
  if(depth === 0) return [];

  // create Circles
  const currentCircle = new Circle(x, y, z, radius);
  
  // Recursion
  const leftCircles = generateCircles(x - radius, y, z, radius/2, depth - 1);
  const rightCircles = generateCircles(x + radius, y, z, radius/2, depth - 1);

  return[currentCircle, ...leftCircles, ...rightCircles];
}

//-----------------------------------------------------------------------------------
// CLASS
//-----------------------------------------------------------------------------------
class Circle {
  constructor(centerX, centerY, centerZ, radius) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.centerZ = centerZ;
      this.radius = radius;
      this.points = this.generatePoints();
      this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
      this.material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 1
        });
      this.lineRepresentation = this.drawCircle(this.geometry,this.material);
  }

  generatePoints() {
      const points = [];
      for (let i = 0; i < 100; i++) {
          // Divide the circle into 100 segments
          const theta = (2 * Math.PI / 100) * i;
          const x = this.centerX + this.radius * Math.cos(theta);
          const y = this.centerY + this.radius * Math.sin(theta);
          const z = this.centerZ;
          points.push(new THREE.Vector3(x,y,z));
      }
      return points;
  }
  drawCircle(geometry,material){
    return new THREE.LineLoop(geometry, material);
  }
}

//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();