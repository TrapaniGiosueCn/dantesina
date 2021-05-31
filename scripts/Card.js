import * as PIXI from 'pixi.js'
import {LabelNames} from "./LabelNames";
import {Button} from "./Button";

export class Card extends PIXI.Graphics{
    constructor(x, y, options, color) {
        super();
        this.container = new PIXI.Container()
        this.content = options.content

        this.container.width = window.innerWidth/100 * 40
        this.container.height = window.innerHeight/100 * 65

        this.createUI(options, color, options.onCancel, options.onSubmit)
    }

    createUI(options, color, cancel, submit) {
        this.createBackground()
        this.createCard(options, color, cancel, submit)
    }

    createBackground() {
        const background = new PIXI.Graphics()
        background.beginFill(0x2b2b2b, 0.7)
        background.drawRect(0, 0, window.innerWidth/100 * 40, window.innerHeight/100 * 65)
        background.endFill()
        this.container.addChild(background)
    }

    createCard(options, color, cancel, submit) {
        const string = options.content[0]
        const length = string.length * 8

        const labelTitle = new LabelNames((window.innerWidth/100 * 40)/2 - length*1.4, (window.innerHeight/100 * 65)/20, string, 40, 0, '#ffffff')
        this.container.addChild(labelTitle.view)

        const string2 = options.content[1].who.split('\n')
        this.y = (window.innerHeight/100 * 65)/20 + 50
        string2.map(str => {
            const len = str.length
            const labelDescription = new LabelNames( (window.innerWidth/100 * 40)/2 - len*8.5, this.y, str, 30, 0, '#ffffff')
            this.y += 25
            this.container.addChild(labelDescription.view)
        })

        this.createButtons(color, options.content[1], cancel, submit)
    }

    createButtons(color, options, cancel, submit) {
        const buttonCancel = new Button('cancel', this.y + 20, (window.innerWidth/100 * 40)/10, color, options)
        this.container.addChild(buttonCancel.container)
        buttonCancel.container.on('mousedown', () => cancel())

        const buttonCancel2 = new Button('video', this.y + 20, (window.innerWidth/100 * 40)/10, color, options)
        this.container.addChild(buttonCancel2.container)
        buttonCancel2.container.on('mousedown', () => submit())
    }
}