import * as PIXI from  'pixi.js'
import {RectangleBackground} from "../scripts/RectangleBackground";
import {LabelNames} from "../scripts/LabelNames";
import {Globals} from "../scripts/Globals";
import Purgatorio from './../jsons/purgatorio.json'
import {ScrollableContainer} from "../scripts/ScrollableContainer";
import {CardManager} from "../scripts/CardManager";
import {Hero} from "../scripts/Hero";
import {SelectPlaceScene} from "./SelectPlaceScene";
import {PurgatorioTriangle} from "../scripts/PurgatorioTriangle";
import {CorsaScene} from "./CorsaScene";
import axios from "../axios";

export class RoadPurgatorioScene {
    constructor() {
        this.container = new PIXI.Container()
        this.purgatorio = Object.keys(Purgatorio.Purgatorio).map(key => [key, Purgatorio.Purgatorio[key]]);

        this.getData((pur) => {
            this.createBackground()
            this.createUI()
            this.createPurgatorio()
            this.createPurgatorioStructure(pur)
        })
    }

    getData(cb){
        axios.get('/purgatorio/' + Globals.purId + '.json')
            .then(response => {
                let purgatorioAxios = response.data.level
                cb(purgatorioAxios)
            })
    }

    createBackground() {
        this.background = new RectangleBackground(0x6a5744, 2, 3, 1.2, 0xFFEBAF)
        this.container.addChild(this.background.container)
    }

    createUI() {
        this.createLabel()
        this.createIcons()
    }

    createLabel() {
        const string = "Purgatorio"
        const length = string.length * 8

        const x = (window.innerWidth / 2) - length*1.9
        const y = window.innerHeight / 100 * 8

        this.title = new LabelNames(x, y, string, 55)
        this.title.view.style

        this.container.addChild(this.title.view)
    }

    createIcons() {
        this.createHeroIcon()
        this.createPurgatorioIcon()
    }

    createHeroIcon() {
        const sizes = this.getXAndY(true)

        const heroIcon = new Hero()
        heroIcon.createIcon('dante', sizes.x, sizes.y)

        this.container.addChild(heroIcon.sprite)
    }

    createPurgatorioIcon() {
        const sizes = this.getXAndY()

        this.sprite = new PIXI.Sprite(Globals.resources['purgatorio'].texture)
        this.sprite.width = window.innerWidth/100 * 5
        this.sprite.height = window.innerHeight/100 * 9
        this.sprite.interactive = true
        this.sprite.buttonMode = true

        this.sprite.x = sizes.x - this.sprite.width
        this.sprite.y = sizes.y

        this.container.addChild(this.sprite)

        this.sprite.on('mousedown', () => Globals.scene.start(new SelectPlaceScene()))
    }

    getXAndY(hero = false){
        const pointX = (window.innerWidth / 100) * 2 + (window.innerWidth / 100) * 1.2
        const pointY = window.innerHeight / 100 * 8
        let widthX = window.innerWidth - (pointX * 2)

        if(hero){
            widthX = pointX * 5
        }

        return {
            x: widthX,
            y: pointY
        }
    }

    createPurgatorio() {
        const sizes = this.getXAndY(true)
        const height = window.innerHeight/100 * 65
        const width = window.innerWidth/100 * 40

        this.purgatorioTriangle = new PurgatorioTriangle(sizes.x/2, sizes.y * 2.9, height, width)
        this.container.addChild(this.purgatorioTriangle.container)
    }

    createPurgatorioStructure(purgatorioAxios) {
        const sizes = this.getXAndY(true)
        this.y = 0
        const scrollable = new ScrollableContainer(window.innerHeight/100 * 65,window.innerWidth/100 * 40, sizes.x * 3.35, sizes.y * 2.9)
        this.purgatorio.map(value => {
            const string = value[0]

            const isTrue = this.purgatorio.indexOf(value) < purgatorioAxios
            const label = new LabelNames(0, this.y, string, 30, 0, isTrue ? "#6a5744" : "#000000")
            const sprite = new PIXI.Sprite()

            sprite.addChild(label.view)
            sprite.interactive = isTrue
            sprite.buttonMode = isTrue

            sprite.on('mousedown', () => {
                this.manageClick(value, sizes.x * 3.35, sizes.y * 2.9, true, purgatorioAxios, this.purgatorio.indexOf(value))
            })

            this.y += 45
            scrollable.push(sprite)
        })

        this.addScrollable(scrollable)
    }

    addScrollable(scrollable) {
        this.container.addChild(scrollable.container)
    }

    manageClick(value, x, y, card, purgatorioAxios, actualPurgatorio) {
        const manager = new CardManager(value, x, y, card, 0x990000, () => this.onCancel(purgatorioAxios), () => this.onSubmit(value, purgatorioAxios, actualPurgatorio))
        this.container.children[5].destroy()
        this.container.addChild(manager.container)
    }

    onCancel(purgatorioAxios){
        this.container.children[5].destroy()
        this.createPurgatorioStructure(purgatorioAxios)
    }

    onSubmit(value, purgatorioAxios, actualPurgatorio){
        if(value[1].what.type === 'video'){
            this.container.children[5].destroy()
            window.open(value[1].what.res, '_blank');

            if(actualPurgatorio - purgatorioAxios === -1){
                axios.patch('/purgatorio/' + Globals.purId + '.json', {
                    level: purgatorioAxios + 1
                })
                    .then(r => this.getData((pur) => {
                        this.createPurgatorioStructure(pur)
                    }))
            }else {
                this.getData((pur) => {
                    this.createPurgatorioStructure(pur)
                })
            }
        }else{
            if(value[1].what.res === 'run'){
                Globals.scene.start(new CorsaScene())
            }
        }
    }
}