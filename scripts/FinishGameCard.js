import * as PIXI from 'pixi.js'
import {LabelNames} from "./LabelNames";
import {Button} from "./Button";

export class FinishGameCard extends PIXI.Graphics{
    constructor(x, y, buttonText, text, colorButton, submit) {
        super();
        this.container = new PIXI.Container()

        this.container.width = window.innerWidth/100 * 40
        this.container.height = window.innerHeight/100 * 20
        this.container.x = x
        this.container.y = y

        this.createUI(buttonText, text, colorButton, submit)
    }

    createUI(buttonText, text, colorButton, submit) {
        this.createBackground()
        this.createCard(buttonText, text, colorButton, submit)
    }

    createBackground() {
        const background = new PIXI.Graphics()
        background.beginFill(0x2b2b2b, 0.7)
        background.drawRect(0, 0, window.innerWidth/100 * 40, window.innerHeight/100 * 30)
        background.endFill()
        this.container.addChild(background)
    }

    createCard(buttonText, text, colorButton, submit) {
        const string = 'Complimenti!!!'
        const length = string.length * 8

        const labelTitle = new LabelNames((window.innerWidth/100 * 40)/2 - length*1.4, (window.innerHeight/100 * 30)/20, string, 40, 0, '#ffffff')
        this.container.addChild(labelTitle.view)

        const string2 = text.split('\n')
        this.y = (window.innerHeight/100 * 30)/20 + 50
        string2.map(str => {
            const len = str.length
            const labelDescription = new LabelNames( (window.innerWidth/100 * 40)/2 - len*8.5, this.y, str, 30, 0, '#ffffff')
            this.y += 25
            this.container.addChild(labelDescription.view)
        })

        this.createButton(buttonText, text, colorButton, submit)
    }

    createButton(buttonText, text, colorButton, submit) {
        const buttonCancel2 = new Button('game', this.y + 25, (window.innerWidth/100 * 40)/19, colorButton, {}, buttonText)
        this.container.addChild(buttonCancel2.container)
        buttonCancel2.container.on('mousedown', () => submit())
    }
}