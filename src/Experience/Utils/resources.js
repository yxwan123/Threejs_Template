import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {TextureLoader} from 'three/src/loaders/TextureLoader.js'
import {CubeTextureLoader} from 'three/src/loaders/CubeTextureLoader.js'


export default class Resources {
    constructor(sources, callback) {
        this.sources = sources
        this.callback = callback
        this.items = {}
        this.loaded = 0
        this.toLoad = this.sources.length
        console.log('Resources loaded:', this.items)
        this.setLoaders()
        this.load()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.cubeTextureLoader = new CubeTextureLoader()
        this.loaders.textureLoader = new TextureLoader()
        this.loaders.glTFLoader = new GLTFLoader()
    }

    load() {
        for (const source of this.sources) {
            switch (source.type) {
                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load(source.path, (file) => {
                        file.colorSpace = THREE.SRGBColorSpace
                        this.sourceLoaded(source, file)
                    })
                    break
                case 'texture':
                    this.loaders.textureLoader.load(source.path, (file) => {
                        if (source.name.toLowerCase().includes('color') || source.name.toLowerCase().includes('diff')) {
                            file.colorSpace = THREE.SRGBColorSpace
                        }
                        this.sourceLoaded(source, file)
                    })
                    break
                case 'glTFModel':
                    this.loaders.glTFLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++
        if (this.loaded === this.toLoad) {
            console.log('All resources loaded')
            this.callback()
        }
    }
}