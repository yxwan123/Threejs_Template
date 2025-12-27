import * as THREE from 'three'
import Experience from '../experience.js'
export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.setSunlight()
        this.setEnvMap()
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment')
            this.debugFolder.add(this.envMap, 'intensity').name('envMapIntensity').min(0).max(4).step(0.001).onFinishChange(() => {
                this.setEnvMap.updateMaterials()
            })
            this.debugFolder.add(this.sunLight, 'intensity').name('sunLightIntensity').min(0).max(10).step(0.001)
        }
    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.position.set(3, 6, 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.scene.add(this.sunLight)

        // Ambient light
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        this.scene.add(this.ambientLight)
    }

    setEnvMap() {
        this.envMap = {}
        this.envMap.intensity = 0.4
        this.envMap.texture = this.experience.resources.items.environmentMapTexture
        this.scene.environment = this.envMap.texture
        this.setEnvMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.envMap.texture
                    child.material.envMapIntensity = this.envMap.intensity
                    child.material.needsUpdate = true
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })
        }
        this.setEnvMap.updateMaterials()
    }

    
}