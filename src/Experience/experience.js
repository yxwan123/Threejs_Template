import * as THREE from 'three'
import Sizes from './Utils/sizes.js'
import Time from './Utils/time.js'
import Camera from './camera.js'
import Renderer from './renderer.js'
import { World, Fox } from './World/world.js'
import Resources from './Utils/resources.js'
import sources from './sources.js'
import Debug from './Utils/debug.js'

// Singleton class
let instance = null
export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this
    window.experience = this
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.debug = new Debug()
    this.resources = new Resources(sources, () => {
      this.world = new World()
      this.sizes = new Sizes(this.onResize.bind(this))
      this.time = new Time(this.onTick.bind(this))
      this.camera = new Camera()
      this.renderer = new Renderer()

    })


  }

  onResize() {
    this.camera.resize()
    this.renderer.resize()
  }

  onTick() {
    this.camera.update()
    this.renderer.update()
    this.world.fox.update()
  }

  destroy() {
    this.sizes = null
    this.time = null
    for (const child of this.scene.children) {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    }
    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if (this.debug.active) {
      this.debug.ui.destroy()
    }
    
  }
}