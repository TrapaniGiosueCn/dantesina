import * as PIXI from 'pixi.js'
import {Image} from "../scripts/Image";
import {Background} from "../scripts/Background";
import {LabelNames} from "../scripts/LabelNames";
import {Globals} from "../scripts/Globals";
import {RoadHellScene} from "./RoadHellScene";
import {RoadPurgatorioScene} from "./RoadPurgatorioScene";
import {RoadParadiseScene} from "./RoadParadiseScene";
import axios from "../axios";

export class SelectPlaceScene {
    constructor() {
        this.container = new PIXI.Container()

        this.createBackground()
        this.createTitle()
        this.createImage()
    }

    createBackground() {
        this.bg = new Background("background2", 0.8);
        this.container.addChild(this.bg.container);
    }

    createTitle() {
        const string = "Scegliere la dimensione"
        const length = string.length * 8

        const x = (window.innerWidth / 2) - length*1.9

        const y = window.innerHeight / 100 * 18
        this.title = new LabelNames(x, y, string, 55)
        this.title.view.style
        this.createLabel(this.title)
    }


    createImage() {
        this.image = new Image('infernoStructure', 19, 34, 0, 0, Globals.infAv)
        this.container.addChild(this.image.container)
        this.label = new LabelNames(this.image.x,this.image.y + this.image.height,'Inferno');
        this.createLabel(this.label)
        this.onMouse(this.image, this.label)
        if(Globals.infAv){
            this.image.container.on('mousedown', () => Globals.scene.start(new RoadHellScene()))
        }

        this.image2 = new Image('purgatorioStructure', 9, 34, this.image.width, this.image.x, Globals.purAv)
        this.container.addChild(this.image2.container)
        this.label2 = new LabelNames(this.image2.x, this.image2.y + this.image2.height, 'Purgatorio')
        this.createLabel(this.label2)
        this.onMouse(this.image2, this.label2)
        if(Globals.purAv){
            this.image2.container.on('mousedown', () => Globals.scene.start(new RoadPurgatorioScene()))
        }

        this.image3 = new Image('paradisoStructure', 9, 34, this.image2.width, this.image2.x, Globals.parAv)
        this.container.addChild(this.image3.container)
        this.label3 = new LabelNames(this.image3.x, this.image3.y + this.image3.height, 'Paradiso')
        this.createLabel(this.label3)
        this.onMouse(this.image3, this.label3)
        if(Globals.parAv){
            this.image3.container.on('mousedown', () => Globals.scene.start(new RoadParadiseScene()))
        }
    }

    onMouse(image, label){
        image.container.on("mouseover", () => image.available ? this.updateImageAndLabel(image, label) : image.lockImage())
        image.container.on("mouseout", () => image.available ? this.normalImageAndLabel(image, label) : image.unlockImage())
    }

    updateImageAndLabel(image, label){
        image.updateImage(32)
        label.view.y = label.view.y - (60 - 44)
    }

    normalImageAndLabel(image, label){
        image.returnNormal()
        label.view.y = label.view.y + (60 - 44)
    }

    createLabel(labelText){
        this.container.addChild(labelText.view)
    }
}