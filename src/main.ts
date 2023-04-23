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
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.IcosahedronGeometry(0.25, 3)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

const AMOUNT = 1000
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  AMOUNT * 3 ** 3
)

const quaternion = new THREE.Quaternion()
const scale = new THREE.Vector3(1, 1, 1)

let count = 0
for (let i = 0; i < AMOUNT; i++) {
  const position = new THREE.Vector3(
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  )
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        instancedMesh.setMatrixAt(
          count++,
          new THREE.Matrix4().compose(
            new THREE.Vector3(
              position.x + x * 100,
              position.y + y * 100,
              position.z + z * 100
            ),
            quaternion,
            scale
          )
        )
      }
    }
  }
}
scene.add(instancedMesh)

const keysDown = new Map<string, boolean>()
window.onkeydown = (e) => {
  keysDown.set(e.key, true)
  if (e.key === " ") autoPilot = !autoPilot
}
window.onkeyup = (e) => keysDown.set(e.key, false)

// fixing behavior for negative numbers
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

let lastTime = performance.now()
let autoPilot = false
function animate() {
  const delta = performance.now() - lastTime
  lastTime = performance.now()

  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  const TURN_SPEED = 0.001
  if (keysDown.get("w") || keysDown.get("ArrowUp"))
    camera.rotateX(-TURN_SPEED * delta)
  if (keysDown.get("s") || keysDown.get("ArrowDown"))
    camera.rotateX(TURN_SPEED * delta)
  if (keysDown.get("a") || keysDown.get("ArrowLeft"))
    camera.rotateZ(TURN_SPEED * delta)
  if (keysDown.get("d") || keysDown.get("ArrowRight"))
    camera.rotateZ(-TURN_SPEED * delta)

  if (autoPilot) {
    camera.rotateX(
      (TURN_SPEED / 2) * Math.sin(performance.now() / 5000) * delta
    )
    camera.rotateZ(
      (TURN_SPEED / 2) * Math.cos(performance.now() / 5000) * delta
    )
  }

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
