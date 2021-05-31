import * as PIXI from 'pixi.js'
import {LabelNames} from "./LabelNames";

export class Button extends PIXI.Graphics{
    constructor(type, y, x, color, options, buttonName = 'Continua') {
        super();
        this.container = new PIXI.Container()
        this.container.interactive = true
        this.container.buttonMode = true

        this.createButton(type, y, x, color, options, buttonName)
    }

    createButton(type, y, x, color, options, buttonName) {
        if(type==='cancel'){
            const graphics = new PIXI.Graphics()
            graphics.beginFill(0xa1a1a1, 1)
            graphics.drawRect(x - 38, y, window.innerWidth/100 * 15, window.innerHeight/100 * 5)
            graphics.endFill()

            const string = 'Cancella'
            const length = string.length * 8
            const cancelLabel = new LabelNames((x-38 + (window.innerWidth/100 * 15)/2) - length, y + 3, string, 25, 0, '#ffffff')

            graphics.addChild(cancelLabel.view)
            this.container.addChild(graphics)
        }else {
            const graphics = new PIXI.Graphics()
            graphics.beginFill(color, 1)
            graphics.drawRect(x*6, y, window.innerWidth/100 * 15, window.innerHeight/100 * 5)
            graphics.endFill()

            const string = buttonName
            const length = string.length * 8
            const label = new LabelNames((x*6 + (window.innerWidth/100 * 15)/2) - length, y + 3, string, 25, 0, '#ffffff')

            graphics.addChild(label.view)
            this.container.addChild(graphics)
        }
    }
}