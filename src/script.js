import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
    AdditiveAnimationBlendMode,
    AdditiveBlending,
    RingGeometry,
    StaticCopyUsage,
} from 'three'

const canvas = document.querySelector('canvas.webgl')

// SCENE
const scene = new THREE.Scene()

// SIZES
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// RENDER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //renderer.render(scene, camera)
})

// CAMERA

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(3, 3, 3)
const center = new THREE.Vector3(0)
camera.lookAt(center)
scene.add(camera)

// Orbit Control
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true })
// const mesh = new THREE.Mesh(geometry, material)

// scene.add(mesh)

// Texture

const textureLoader = new THREE.TextureLoader()

// Saturn

const saturnGeo = new THREE.SphereGeometry(1)
const staurnMat = new THREE.MeshBasicMaterial({ color: 'lightgreen' })
staurnMat.map = textureLoader.load('./Lava_004_SD/Lava_004_NORM.jpg')
const saturn = new THREE.Mesh(saturnGeo, staurnMat)

scene.add(saturn)

// Moon

const moonGeo = new THREE.SphereGeometry(0.2)
const moonMat = new THREE.MeshBasicMaterial({ color: 'blue' })
const moon = new THREE.Mesh(moonGeo, moonMat)
moon.position.x = 2
scene.add(moon)

// Rings

const ringGeo = new THREE.BufferGeometry()
const particleNr = 100
const ringPositions = new Float32Array(particleNr * 3)
const ringColors = new Float32Array(particleNr * 3)

for (let i = 0; i < particleNr; i++) {
    const i3 = i * 3
    const radius = 2 + Math.random()
    const randAngle = Math.random() * (Math.PI * 2)

    ringPositions[i3] = Math.cos(randAngle) * radius
    ringPositions[i3 + 1] = (Math.random() - 0.5) * 0.1
    ringPositions[i3 + 2] = Math.sin(randAngle) * radius

    ringColors[i3] = Math.random()
    ringColors[i3 + 1] = Math.random()
    ringColors[i3 + 2] = Math.random()
}

ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))

const ringMat = new THREE.PointsMaterial({
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    size: 0.05,
})
const ring = new THREE.Points(ringGeo, ringMat)

scene.add(ring)

// ANIMATION
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // console.log(elapsedTime)
    // mesh.rotation.y = elapsedTime * Math.PI
    // mesh.position.y = Math.sin(elapsedTime * 2)
    // mesh.position.x = Math.cos(elapsedTime * 2)
    // mesh.rotation.x = 0.5 * elapsedTime

    moon.position.x = Math.cos(elapsedTime) * 3
    moon.position.z = Math.sin(elapsedTime) * 3

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
