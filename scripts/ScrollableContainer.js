import * as PIXI from 'pixi.js'
import {Scrollbox} from "pixi-scrollbox";

export class ScrollableContainer{
    constructor(height, width, x, y) {
        this.container = new PIXI.Container()
        this.scrollbox = new Scrollbox({ boxWidth: width, boxHeight: height})
        this.container.x = x
        this.container.y = y
    }

    push(label) {
        this.scrollbox.content.addChild(label)
        this.container.addChild(this.scrollbox)
        this.scrollbox.update()
    }
}
