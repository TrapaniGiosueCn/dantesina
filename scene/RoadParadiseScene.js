import * as PIXI from  'pixi.js'
import {RectangleBackground} from "../scripts/RectangleBackground";
import {LabelNames} from "../scripts/LabelNames";
import {Globals} from "../scripts/Globals";
import Paradise from './../jsons/paradise.json'
import {ScrollableContainer} from "../scripts/ScrollableContainer";
import {CardManager} from "../scripts/CardManager";
import {Hero} from "../scripts/Hero";
import {SelectPlaceScene} from "./SelectPlaceScene";
import {ParadiseTriangle} from "../scripts/ParadiseTriangle";
import {PuzzleScene} from "./PuzzleScene";
import axios from "../axios";

export class RoadParadiseScene {
    constructor() {
        this.container = new PIXI.Container()
        this.paradise = Object.keys(Paradise.Paradise).map(key => [key, Paradise.Paradise[key]]);

        this.getData((par) => {
            this.createBackground()
            this.createUI()
            this.createParadise()
            this.createParadiseStructure(par)
        })
    }

    getData(cb) {
        axios.get('/paradiso/' + Globals.parId + '.json')
            .then(response => {
                let infernoAxios = response.data.level
                cb(infernoAxios)
            })
    }

    createBackground() {
        this.background = new RectangleBackground(0x3c57a4, 2, 3, 1.2, 0xFFEBAF)
        this.container.addChild(this.background.container)
    }

    createUI() {
        this.createLabel()
        this.createIcons()
    }

    createLabel() {
        const string = "Paradiso"
        const length = string.length * 8

        const x = (window.innerWidth / 2) - length*1.9
        const y = window.innerHeight / 100 * 8

        this.title = new LabelNames(x, y, string, 55)
        this.title.view.style

        this.container.addChild(this.title.view)
    }

    createIcons() {
        this.createHeroIcon()
        this.createParadiseIcon()
    }

    createHeroIcon() {
        const sizes = this.getXAndY(true)

        const heroIcon = new Hero()
        heroIcon.createIcon('dante', sizes.x, sizes.y)

        this.container.addChild(heroIcon.sprite)
    }

    createParadiseIcon() {
        const sizes = this.getXAndY()

        this.sprite = new PIXI.Sprite(Globals.resources['paradiso'].texture)
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

    createParadise() {
        const sizes = this.getXAndY(true)
        const height = window.innerHeight/100 * 65
        const width = window.innerWidth/100 * 40

        this.paradiseTriangle = new ParadiseTriangle(sizes.x/2, sizes.y * 2.9, height, width)
        this.container.addChild(this.paradiseTriangle.container)
    }

    createParadiseStructure(paradiseAxios) {
        const sizes = this.getXAndY(true)
        this.y = 0
        const scrollable = new ScrollableContainer(window.innerHeight/100 * 65,window.innerWidth/100 * 40, sizes.x * 3.35, sizes.y * 2.9)
        this.paradise.map(value => {
            const string = value[0]

            const isTrue = this.paradise.indexOf(value) < paradiseAxios
            const label = new LabelNames(0, this.y, string, 30, 0, isTrue ? "#3c57a4" : "#000000")
            const sprite = new PIXI.Sprite()

            sprite.addChild(label.view)
            sprite.interactive = isTrue
            sprite.buttonMode = isTrue

            sprite.on('mousedown', () => {
                this.manageClick(value, sizes.x * 3.35, sizes.y * 2.9, true, paradiseAxios, this.paradise.indexOf(value))
            })

            this.y += 45
            scrollable.push(sprite)
        })

        this.addScrollable(scrollable)
    }

    addScrollable(scrollable) {
        this.container.addChild(scrollable.container)
    }

    manageClick(value, x, y, card, paradiseAxios, actualParadise) {
        const manager = new CardManager(value, x, y, card, 0x3c57a4, () => this.onCancel(paradiseAxios), () => this.onSubmit(value, paradiseAxios, actualParadise))
        this.container.children[5].destroy()
        this.container.addChild(manager.container)
    }

    onCancel(paradiseAxios){
        this.container.children[5].destroy()
        this.createParadiseStructure(paradiseAxios)
    }

    onSubmit(value, paradiseAxios, actualParadise){
        if(value[1].what.type === 'video'){
            this.container.children[5].destroy()
            window.open(value[1].what.res, '_blank');

            if(actualParadise - paradiseAxios === -1){
                axios.patch('/paradiso/' + Globals.parId + '.json', {
                    level: paradiseAxios + 1
                })
                    .then(r => this.getData((par) => {
                        this.createParadiseStructure(par)
                    }))
            }else {
                this.getData((par) => {
                    this.createParadiseStructure(par)
                })
            }
        }else{
            if(value[1].what.res === 'puzzle'){
                Globals.scene.start(new PuzzleScene(true))
            }
        }
    }
}