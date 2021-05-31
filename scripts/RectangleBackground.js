import * as PIXI from 'pixi.js'

export class RectangleBackground extends PIXI.Graphics{
    constructor(color, x, y, size, bg) {
        super();

        this.container = new PIXI.Container()
        this.graphics = new PIXI.Graphics()

        this.setupBackground(bg)
        this.setupRectangle(color, x, y)
        this.setupInnerRectangle(bg, size, x, y)
    }

    setupRectangle(color, x, y) {
        const pointX = (window.innerWidth / 100) * x
        const pointY = (window.innerHeight / 100) * y

        this.graphics.beginFill(color)
        this.graphics.drawRect(pointX, pointY, window.innerWidth - (pointX * 2), window.innerHeight - (pointY * 2))
        this.graphics.endFill()

        this.container.addChild(this.graphics)
    }

    setupBackground(bg) {
        this.graphics.beginFill(bg)
        this.graphics.drawRect(0, 0, window.innerWidth, window.innerHeight)
        this.graphics.endFill()

        this.container.addChild(this.graphics)
    }

    setupInnerRectangle(bg, size, x, y) {
        const pointX = (window.innerWidth / 100) * x + (window.innerWidth / 100) * size
        const pointY = (window.innerHeight / 100) * y + (window.innerWidth / 100) * size

        this.graphics.beginFill(bg)
        this.graphics.drawRect(pointX, pointY, window.innerWidth - (pointX * 2), window.innerHeight - (pointY * 2))
        this.graphics.endFill()

        this.container.addChild(this.graphics)
    }
}