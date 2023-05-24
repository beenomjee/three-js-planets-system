import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from "./img/stars.jpg";
import sunTexture from "./img/sun.jpg";
import mercuryTexture from "./img/mercury.jpg";
import venusTexture from "./img/venus.jpg";
import earthTexture from "./img/earth.jpg";
import marsTexture from "./img/mars.jpg";
import jupiterTexture from "./img/jupiter.jpg";
import saturnTexture from "./img/saturn.jpg";
import saturnRingTexture from "./img/saturn ring.png";
import uranusTexture from "./img/uranus.jpg";
import uranusRingTexture from "./img/uranus ring.png";
import neptuneTexture from "./img/neptune.jpg";
import plutoTexture from "./img/pluto.jpg";
import { gsap } from "gsap";

// creating renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.querySelector("#canvaContainer").appendChild(renderer.domElement);

// texture loader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// creating scene and setting background
const scene = new THREE.Scene();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

// creating camera
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

// new orbit control
const orbitControl = new OrbitControls(camera, renderer.domElement);

// set camera position and update orbit controls
// camera.position.set(300, 70, 0);
// camera.position.set(0, 140, 140);
camera.position.set(0, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
orbitControl.update();

// light
const ambientLight = new THREE.AmbientLight(0x333333);
ambientLight.position.set(0, 10, 0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2.5, 400);
scene.add(pointLight);

// sun
const sunGeometry = new THREE.SphereGeometry(20, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const createPlanet = (
  radius,
  defaltXPos,
  texture,
  ringsTexture = null,
  ringRadius
) => {
  const obj = new THREE.Object3D();
  const geo = new THREE.SphereGeometry(radius, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(geo, material);
  planet.position.set(defaltXPos, 0, 0);

  if (ringsTexture) {
    const geo = new THREE.RingGeometry(radius + 3, radius + ringRadius, 50);
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ringsTexture),
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geo, material);
    ring.position.set(defaltXPos, 0, 0);
    ring.rotation.x = Math.PI / 2;
    obj.add(ring);
  }

  const imaginaryRingsGeo = new THREE.RingGeometry(
    defaltXPos,
    defaltXPos + 0.2,
    50
  );
  const imaginaryRingsMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const imaginaryRings = new THREE.Mesh(imaginaryRingsGeo, imaginaryRingsMat);
  imaginaryRings.rotation.x = Math.PI / 2;

  obj.add(planet);
  scene.add(imaginaryRings);
  scene.add(obj);
  return [obj, planet];
};

// mercury
const [mercuryObj, mercury] = createPlanet(3.2, 28, mercuryTexture);
// venus
const [venusObj, venus] = createPlanet(5.8, 44, venusTexture);
// earth
const [earthObj, earth] = createPlanet(6, 62, earthTexture);
// mars
const [marsObj, mars] = createPlanet(4, 78, marsTexture);
// jupiter
const [jupiterObj, jupiter] = createPlanet(12, 100, jupiterTexture);
// saturn
const [saturnObj, saturn] = createPlanet(
  10,
  138,
  saturnTexture,
  saturnRingTexture,
  10
);
// uranus
const [uranusObj, uranus] = createPlanet(
  7,
  176,
  uranusTexture,
  uranusRingTexture,
  7
);
// neptune
const [neptuneObj, neptune] = createPlanet(7, 200, neptuneTexture);
// pluto
const [plutoObj, pluto] = createPlanet(2.8, 216, plutoTexture);

let cameraPos = {
  x: 0,
  y: 300,
  z: 0,
};
let isNewPos = true;

const animate = () => {
  requestAnimationFrame(animate);

  // animationg camera
  if (isNewPos) {
    isNewPos = false;
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 3,
      onUpdate: () => {
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        orbitControl.update();
      },
    });
  }

  sun.rotation.y += 0.004;
  // rotating all planets on axis
  mercury.rotation.y += 0.004;
  venus.rotation.y += 0.002;
  earth.rotation.y += 0.02;
  mars.rotation.y += 0.018;
  jupiter.rotation.y += 0.04;
  saturn.rotation.y += 0.038;
  uranus.rotation.y += 0.03;
  neptune.rotation.y += 0.032;
  pluto.rotation.y += 0.008;

  // rotating mercury around sun
  mercuryObj.rotation.y += 0.04;
  venusObj.rotation.y += 0.015;
  earthObj.rotation.y += 0.01;
  marsObj.rotation.y += 0.008;
  jupiterObj.rotation.y += 0.002;
  saturnObj.rotation.y += 0.0009;
  uranusObj.rotation.y += 0.0004;
  neptuneObj.rotation.y += 0.0001;
  plutoObj.rotation.y += 0.00007;

  // rendering scene here
  renderer.render(scene, camera);
};

animate();

// changeing view
for (const button of document.querySelectorAll(".buttons button")) {
  button.addEventListener("click", (e) => {
    if (e.target.id === "front")
      cameraPos = {
        x: 0,
        y: 140,
        z: 300,
      };
    else if (e.target.id === "top")
      cameraPos = {
        x: 0,
        y: 300,
        z: 0,
      };
    else
      cameraPos = {
        x: 300,
        y: 70,
        z: 0,
      };
    isNewPos = true;
  });
}
