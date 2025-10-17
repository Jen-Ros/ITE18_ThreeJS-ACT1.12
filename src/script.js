import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typefaceFont from
'three/examples/fonts/gentilis_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Object

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

scene.add(cube) */

/**
* Fonts
*/
const fontLoader = new FontLoader()
const font = fontLoader.parse(typefaceFont);

const textGeometry = new TextGeometry('Obsidian Dimention', {
    font: font,
    size: 0.5,
    height: 0.5,
    curveSegments: 9,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 8
    
});

textGeometry.computeBoundingBox()
console.log(textGeometry.boundingBox)

textGeometry.translate(
/*- textGeometry.boundingBox.max.x * 0.5,
- textGeometry.boundingBox.max.y * 0.5,
- textGeometry.boundingBox.max.z * 0.5*/
    - (textGeometry.boundingBox.max.x - 0.02) * 0.5, 
    - (textGeometry.boundingBox.max.y - 0.02) * 0.5, 
    - (textGeometry.boundingBox.max.z - 0.03) * 0.5
)
textGeometry.center()

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const text = new THREE.Mesh(textGeometry, material);
scene.add(text);

const diamondGeometry = new THREE.OctahedronGeometry(0.3)
//const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

for (let i = 0; i < 100; i++) {
    const diamond = new THREE.Mesh(diamondGeometry, material)

    diamond.position.x = (Math.random() - 0.5) * 7
    diamond.position.y = (Math.random() - 0.5) * 25
    diamond.position.z = (Math.random() - 0.5) * 20

    diamond.rotation.x = Math.random() * Math.PI
    diamond.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    diamond.scale.set(scale, scale, scale)

    scene.add(diamond)
}

//ADDED for aesthetic
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(3, 5, 2)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0x99ffff, 1.5)
pointLight.position.set(-5, -3, 5)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Gentle floating rotation for the text
    text.rotation.y = Math.sin(elapsedTime * 0.2) * 0.3
    text.rotation.x = Math.cos(elapsedTime * 0.15) * 0.1
    text.position.y = Math.sin(elapsedTime * 0.5) * 0.05 // soft floating motion

    // Elegant spinning & drifting for torus knots
    scene.traverse((object) => {
    if (object.geometry instanceof THREE.OctahedronGeometry) {
        object.rotation.x += 0.002
        object.rotation.y += 0.003
        object.position.y += Math.sin(elapsedTime * 0.3 + object.position.x) * 0.0005
    }
})

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Next frame
    window.requestAnimationFrame(tick)
}

tick()
