export default class Time {
    constructor(callback) {
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.callback = callback

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const now = Date.now()
        this.delta = now - this.current
        this.current = now
        this.elapsed = this.current - this.start
        if (this.callback) {
            this.callback()
        }

        window.requestAnimationFrame(() => {
            try {
                this.tick()
            } catch (error) {
                console.log('Ticking ended')
            }
        })
    }
}

