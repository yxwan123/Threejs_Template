import Experience from "../experience"
import * as THREE from 'three'
import Environment from "./env.js"
import Debug from "../Utils/debug.js"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.addFloor()
        this.addFox()

        this.env = new Environment()
        console.log("World initialized")

    }

    addFloor(){
        const geometry = new THREE.CircleGeometry(10, 64)

        const colorTexture = this.experience.resources.items.grassColorTexture
        const normalTexture = this.experience.resources.items.grassNormalTexture

        for(let texture of [colorTexture, normalTexture]){
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(1.5, 1.5)
        }

        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture
        })
        this.floor = new THREE.Mesh(geometry, material)
        this.floor.rotation.x = - Math.PI * 0.5
        this.floor.position.y = - 0.5
        this.floor.receiveShadow = true
        this.scene.add(this.floor)
    }

    addFox(){
        this.fox = new Fox()
        this.scene.add(this.fox.model.scene)
    }
}


class Fox {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.model = this.experience.resources.items.foxModel
        this.model.scene.scale.set(0.02, 0.02, 0.02)
        this.model.scene.position.y = -0.5
        this.debug = this.experience.debug
        this.setAnimation()
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.model.scene)
        this.animations = {}
        this.animations.idle = this.mixer.clipAction(this.model.animations[0])
        this.animations.walk = this.mixer.clipAction(this.model.animations[1])
        this.animations.run = this.mixer.clipAction(this.model.animations[2])

        this.animations.current = this.animations.idle
        this.animations.current.play()
        this.animations.play = (name) => {
            const newAnimation = this.animations[name]
            const oldAnimation = this.animations.current

            newAnimation.reset()
            newAnimation.play()
            newAnimation.crossFadeFrom(oldAnimation, 1)
            this.animations.current = newAnimation
        }
        if (this.debug.active) {
            const folder = this.debug.ui.addFolder('fox')
            const debugObj = {
                playIdle: () => {
                    this.animations.play('idle')
                },
                playWalk: () => {
                    this.animations.play('walk')
                },
                playRun: () => {
                    this.animations.play('run')
                }
            }
            folder.add(debugObj, 'playIdle')
            folder.add(debugObj, 'playWalk')
            folder.add(debugObj, 'playRun')
        }
    }

    update() {
        this.mixer.update(this.experience.time.delta * 0.001)
    }
}

export { World, Fox }