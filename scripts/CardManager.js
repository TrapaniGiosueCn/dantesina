import * as PIXI from 'pixi.js'
import {Card} from "./Card";

export class CardManager {
    constructor(sprite, x, y, card, color, cancel, submit) {
        if(card){
            this.container = new PIXI.Container()
            this.container.x = x
            this.container.y = y
            this.container.width = window.innerWidth/100 * 50
            this.container.height = window.innerHeight/100 * 40

            this.createCard(sprite, x, y, color, cancel, submit)
        }
    }

    createCard(sprite, x, y, color, cancel, submit) {
        this.card = new Card(x, y, {
            content: sprite,
            onCancel: cancel,
            onSubmit: submit
        }, color)

        this.container.addChild(this.card.container)
    }
}