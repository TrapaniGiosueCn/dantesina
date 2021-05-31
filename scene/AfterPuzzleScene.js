import * as PIXI from 'pixi.js'
import {Globals} from '../scripts/Globals'
import {FinishGameCard} from "../scripts/FinishGameCard";
import {SelectPlaceScene} from "./SelectPlaceScene";
import axios from "../axios";

export class AfterPuzzleScene{
    constructor(isParadise) {
        this.container = new PIXI.Container();
        this.createBackground(isParadise);
    }

    createBackground(isParadise) {
        this.bg = new PIXI.Sprite(Globals.resources[isParadise ? "backgroundPuzzleParadiso" : "backgroundPuzzleInferno"].texture);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);

        this.createCard(isParadise)
    }

    createCard(isParadise) {
        const x = window.innerWidth/2 - (window.innerWidth/100 * 40)/2
        const y = window.innerHeight/2 - (window.innerHeight/100 * 30)/2

        const stringInf = 'Hai sbloccato la\ndimensione Purgatorio.\nContinua così.'
        const stringPar = 'Hai finito il\ntuo percorso.\nLa tua avventura\nverrà ricordata.'

        const card = new FinishGameCard( x,y, 'Continua', isParadise ? stringPar : stringInf, 0x21252A, () => {
            if(!isParadise){
                axios.patch('/dimensions/' + Globals.dimId + '/purgatorio.json', {
                    available: true
                })
                    .then(() => {
                        Globals.purAv = true
                        Globals.scene.start(new SelectPlaceScene())
                    })
            }else{
                Globals.scene.start(new SelectPlaceScene())
            }
        })
        this.container.addChild(card.container)
    }
}