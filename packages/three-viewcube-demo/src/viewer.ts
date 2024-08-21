import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  Axes2dHelper,
  FaceNames,
  ViewCube,
  ViewCubeHelper
} from '@mlightcad/three-viewcube'

export class Viewer {
  private _scene: THREE.Scene
  private _camera: THREE.PerspectiveCamera
  private _renderer: THREE.WebGLRenderer
  private _cameraControls: OrbitControls
  private _viewCubeHelper: ViewCubeHelper
  private _axes2dHelper: Axes2dHelper
  private _bbox: THREE.Box3

  constructor() {
    this._bbox = new THREE.Box3()
    this._scene = this.createScene()
    this._camera = this.createCamera()
    this._renderer = this.creatRenderer()
    this._cameraControls = this.createCameraControls()
    this._viewCubeHelper = this.createViewCubeHelper()
    this._axes2dHelper = this.createAxes2dHelper()
    this.createLights()
    this.createObjects()
  }

  get camera() {
    return this._camera
  }

  get scene() {
    return this._scene
  }

  get renderer() {
    return this._renderer
  }

  get cameraControls() {
    return this._cameraControls
  }

  get bbox() {
    return this._bbox
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    this._viewCubeHelper.render()
    this._axes2dHelper.render()
  }

  private createScene() {
    const scene = new THREE.Scene()
    return scene
  }

  private createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    camera.lookAt(0, 0, 0)
    camera.position.set(0, 0, 3)
    this.scene.add(camera)
    return camera
  }

  private creatRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    return renderer
  }

  private createLights() {
    const ambientLight = new THREE.AmbientLight('white', 0.4)
    const pointLight = new THREE.PointLight('white', 20, 100)
    pointLight.position.set(-2, 2, 2)
    pointLight.castShadow = true
    pointLight.shadow.radius = 4
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 4000
    pointLight.shadow.mapSize.width = 2048
    pointLight.shadow.mapSize.height = 2048
    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  private createCameraControls() {
    const cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    cameraControls.enableDamping = true
    cameraControls.autoRotate = false
    cameraControls.update()
    return cameraControls
  }

  private createObjects() {
    const planeGeometry = new THREE.PlaneGeometry(3, 3)
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 'gray',
      emissive: 'teal',
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    const faceNames: FaceNames = {
      top: '顶',
      front: '前',
      right: '右',
      back: '后',
      left: '左',
      bottom: '底'
    }
    const cube = new ViewCube(1, 0.1, true, 0xcccccc, 0x999999, faceNames)
    this.scene.add(cube)
    this.scene.add(plane)
    const axes = new THREE.AxesHelper(2)
    this.scene.add(axes)

    // Calculate bounding box
    if (plane.geometry.boundingBox) this._bbox.union(plane.geometry.boundingBox)
    if (axes.geometry.boundingBox) this._bbox.union(axes.geometry.boundingBox)
  }

  private createViewCubeHelper() {
    const viewCubeHelper = new ViewCubeHelper(this.camera, this.renderer)
    viewCubeHelper.setControls(this.cameraControls)
    return viewCubeHelper
  }

  private createAxes2dHelper() {
    const axes2dHelper = new Axes2dHelper(this.camera, this.renderer)
    axes2dHelper.setTextColor(new THREE.Color(0x00ff00))
    return axes2dHelper
  }
}
