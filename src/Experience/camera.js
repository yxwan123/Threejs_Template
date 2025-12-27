import * as THREE from 'three'
import Experience from './experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export default class Camera {
    constructor() {
        const experience = new Experience()
        this.experience = experience
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.setInstance()
        this.setControls()

    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100)
        this.instance.position.set(4, 2, 5)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}