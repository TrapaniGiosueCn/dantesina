import * as PIXI from 'pixi.js'
import {Globals} from '../scripts/Globals'
import {Background} from '../scripts/Background'
import {LabelScore} from "../scripts/LabelScore";
import {CorsaScene} from "./CorsaScene";
import {FinishGameCard} from "../scripts/FinishGameCard";
import {SelectPlaceScene} from "./SelectPlaceScene";
import axios from "../axios";

export class AfterRunScene{
    constructor(amount, isWin = false) {
        this.container = new PIXI.Container()
        this.createBackground()

        if(isWin){
            this.createButton()
        }else{
            this.createPopup()
            this.crateLabelScore(amount)
            this.createText()
            this.container.interactive = true
            this.container.once("pointerdown", () => {
                Globals.scene.start(new CorsaScene())
            })
        }
    }

    createBackground() {
        this.bg = new Background('backgroundCorsaPurgatorio')
        this.container.addChild(this.bg.container)
    }

    createPopup(){
        this.popup = new PIXI.Graphics();
        const width = 600;
        const height = 400;
        const x = window.innerWidth / 2 - width / 2
        const y = window.innerHeight / 2 - height / 2

        this.popup.beginFill(0x000000, 0.5)
        this.popup.drawRect(x, y, width, height)
        this.container.addChild(this.popup)
    }

    crateLabelScore(amount) {
        this.labelScore = new LabelScore(window.innerWidth / 2 - 95, window.innerHeight / 2 - 100, 0.5)
        this.labelScore.render(amount)
        this.container.addChild(this.labelScore.view)
    }

    createText() {
        const text = new PIXI.Text();
        text.anchor.set(0.5);
        text.x = window.innerWidth / 2;
        text.y = window.innerHeight / 2 + 100;
        text.style = {
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontVariant: "small-caps",
            fontWeight: "normal",
            fontSize: 34,
            fill: ["#FFFFFF"]
        }

        text.text = "Tap to Restart";
        this.popup.addChild(text)
    }

    createButton() {
        const x = window.innerWidth/2 - (window.innerWidth/100 * 40)/2
        const y = window.innerHeight/2 - (window.innerHeight/100 * 30)/2

        const card = new FinishGameCard( x,y, 'Continua', 'Hai sbloccato la\ndimensione Paradiso.\nContinua così', 0x21252A, () => {
            axios.patch('/dimensions/' + Globals.dimId + '/paradiso.json', {
                available: true
            })
                .then(() => {
                    Globals.parAv = true
                    Globals.scene.start(new SelectPlaceScene())
                })
        })
        this.container.addChild(card.container)
    }
}