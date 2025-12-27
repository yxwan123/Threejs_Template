export default class Sizes {
    constructor(callback) {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.callback = callback

        window.addEventListener('resize', () => {
            // Update sizes
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            if (this.callback) {
                this.callback()
            }
        })
    }
}