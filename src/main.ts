import * as THREE from "three"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
)
camera.position.set(0, 0, 100)
camera.lookAt(0, 0, 0)

scene.fog = new THREE.Fog(0x000000, 0, 100)

const renderer = new THREE.WebGLRenderer()
// renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.IcosahedronGeometry(0.1, 3)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
function addSphere() {
  const position = new THREE.Vector3(
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  )

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(
          position.x + x * 100,
          position.y + y * 100,
          position.z + z * 100
        )
        scene.add(mesh)
      }
    }
  }
}

for (let i = 0; i < 1000; i++) {
  addSphere()
}

const keysDown = new Map<string, boolean>()
window.onkeydown = (e) => keysDown.set(e.key, true)
window.onkeyup = (e) => keysDown.set(e.key, false)

// fixing behavior for negative numbers
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

let lastTime = performance.now()
function animate() {
  const delta = performance.now() - lastTime
  lastTime = performance.now()

  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  const TURN_SPEED = 0.001
  if (keysDown.get("w")) camera.rotateX(-TURN_SPEED * delta)
  if (keysDown.get("s")) camera.rotateX(TURN_SPEED * delta)
  if (keysDown.get("a")) camera.rotateZ(TURN_SPEED * delta)
  if (keysDown.get("d")) camera.rotateZ(-TURN_SPEED * delta)

  const FORWARD_SPEED = 0.01
  camera.translateZ(-delta * FORWARD_SPEED)

  camera.position.z = mod(camera.position.z, 100)
  camera.position.x = mod(camera.position.x, 100)
  camera.position.y = mod(camera.position.y, 100)
}
animate()

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
