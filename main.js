import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import bluePlanetUrl from './textures/blue_planet.jpeg';
import redPlanetUrl from './textures/red_planet.jpeg';
import greenPlanetUrl from './textures/green_planet.png';
import purplePlanetUrl from './textures/purple_planet.png';
import sunUrl from './textures/sun.jpeg';

const spaceImageUrl = 'https://i.imgur.com/gLGNnkp.jpeg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([spaceImageUrl, spaceImageUrl, spaceImageUrl, spaceImageUrl, spaceImageUrl ,spaceImageUrl]);
const textureLoader = new THREE.TextureLoader();

const ambientLight = new THREE.AmbientLight(0xadadad);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2);
scene.add(pointLight);

const sunGeometry = new THREE.SphereGeometry();
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0ed54,
    name: 'sun',
    map: textureLoader.load(sunUrl)
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const sunObject = new THREE.Object3D();
sunObject.add(sunMesh);
scene.add(sunObject);

const personalInfoGeometry = new THREE.SphereGeometry(0.5);
const personalInfoMaterial = new THREE.MeshStandardMaterial({
    color: 0xf54e42,
    name: 'personal_info',
    map: textureLoader.load(redPlanetUrl)
});
const personalInfoMesh = new THREE.Mesh(personalInfoGeometry, personalInfoMaterial);
const personalInfoObject = new THREE.Object3D();
personalInfoObject.add(personalInfoMesh);
personalInfoMesh.position.x = 3;
scene.add(personalInfoObject);

const educationGeometry = new THREE.SphereGeometry(0.6);
const educationMaterial = new THREE.MeshStandardMaterial({
    color: 0x4287f5,
    name: 'education',
    map: textureLoader.load(bluePlanetUrl)
});
const educationMesh = new THREE.Mesh(educationGeometry, educationMaterial);
const educationObject = new THREE.Object3D();
educationObject.add(educationMesh);
educationMesh.position.x = -6;
scene.add(educationObject);

const experienceGeometry = new THREE.SphereGeometry(0.6);
const experienceMaterial = new THREE.MeshStandardMaterial({
    color: 0x43ba41,
    name: 'experience',
    map: textureLoader.load(greenPlanetUrl)
});
const experienceMesh = new THREE.Mesh(experienceGeometry, experienceMaterial);
const experienceObject = new THREE.Object3D();
experienceObject.add(experienceMesh);
experienceMesh.position.z = 8;
scene.add(experienceObject);

const techSkillsGeometry = new THREE.SphereGeometry(0.7);
const techSkillsMaterial = new THREE.MeshStandardMaterial({
    color: 0x8224b5,
    name: 'skills',
    map: textureLoader.load(purplePlanetUrl)
});
const techSkillsMesh = new THREE.Mesh(techSkillsGeometry, techSkillsMaterial);
const techSkillsObject = new THREE.Object3D();
techSkillsObject.add(techSkillsMesh);
techSkillsMesh.position.z = -10;
scene.add(techSkillsObject);

camera.position.set(10, 7, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const name = intersects[0].object.material.name;
        const element = document.querySelector('#' + name);
        element?.classList.add('is-active');
    }
}, false);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.65;
bloomPass.strength = 2;
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const close = document.querySelectorAll('.delete');
close.forEach((element) => element.addEventListener('click', () => {
    const modal = document.querySelector('.is-active');
    modal?.classList.remove('is-active');
}));

document.body.appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

const getMesh = (object) => object.children.find((c) => c.type === 'Mesh');

renderer.setAnimationLoop(() => {
    sunObject.rotateY(0.005);
    getMesh(personalInfoObject).rotateY(0.01);
    getMesh(educationObject).rotateY(0.02);
    getMesh(experienceObject).rotateY(0.01);
    getMesh(techSkillsObject).rotateY(0.01);

    personalInfoObject.rotateY(0.005);
    educationObject.rotateY(0.003);
    experienceObject.rotateY(0.002);
    techSkillsObject.rotateY(0.001);

    renderer.render(scene, camera);
    bloomComposer.render();
});

