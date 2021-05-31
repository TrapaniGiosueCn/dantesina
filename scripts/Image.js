import * as PIXI from 'pixi.js'
import {Globals} from "./Globals";

export class Image{
    constructor(image, x, y, prevImageWidth, prevImageX, available) {
        this.width = window.innerWidth / 100 * 15
        this.height = window.innerHeight / 100 * 40
        this.image = image
        this.x = (window.innerWidth / 100 * x) + prevImageWidth + prevImageX
        this.y = window.innerHeight / 100 * y
        this.available = available

        this.container = new PIXI.Container()
        this.container.interactive = true
        if(this.available){
            this.container.buttonMode=true
        }

        this.setImage()

    }

    setImage(){
        this.layer = new PIXI.Sprite(Globals.resources[this.image].texture);
        this.layer.width = this.width
        this.layer.height = this.height
        this.layer.x = this.x
        this.layer.y = this.y;
        this.container.height = this.height;

        this.container.addChild(this.layer)
    }

    updateImage(y){
        this.layer.y = window.innerHeight / 100 * y
    }

    lockImage(){
        this.layer.alpha = 0.7
        this.layer2 = new PIXI.Sprite(Globals.resources["lock"].texture)
        this.layer2.width = this.width
        this.layer2.height = this.height
        this.layer2.x = this.x
        this.layer2.y = this.y;

        this.container.addChild(this.layer2)
    }

    returnNormal(){
        this.layer.y = this.y
    }

    unlockImage(){
        this.layer.alpha = 1
        this.layer2.destroy()
    }
}