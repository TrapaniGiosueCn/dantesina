import * as PIXI from  'pixi.js'
import {RectangleBackground} from "../scripts/RectangleBackground";
import {LabelNames} from "../scripts/LabelNames";
import {Globals} from "../scripts/Globals";
import Inferno from './../jsons/inferno.json'
import {HellTriangle} from "../scripts/HellTriangle";
import {ScrollableContainer} from "../scripts/ScrollableContainer";
import {CardManager} from "../scripts/CardManager";
import {Hero} from "../scripts/Hero";
import {SelectPlaceScene} from "./SelectPlaceScene";
import {PuzzleScene} from "./PuzzleScene";
import axios from "../axios";

export class RoadHellScene {
    constructor() {
        this.container = new PIXI.Container()
        this.inferno = Object.keys(Inferno.Inferno).map(key => [key, Inferno.Inferno[key]]);

        this.getData((inf) => {
            this.createBackground()
            this.createUI()
            this.createInferno()
            this.createInfernoStructure(inf)
        })
    }

    getData(cb){
        axios.get('/inferno/' + Globals.infId + '.json')
            .then(response => {
                let infernoAxios = response.data.level
                cb(infernoAxios)
            })
    }

    createBackground() {
        this.background = new RectangleBackground(0x990000, 2, 3, 1.2, 0xFFEBAF)
        this.container.addChild(this.background.container)
    }

    createUI() {
        this.createLabel()
        this.createIcons()
    }

    createLabel() {
        const string = "Inferno"
        const length = string.length * 8

        const x = (window.innerWidth / 2) - length*1.9
        const y = window.innerHeight / 100 * 8

        this.title = new LabelNames(x, y, string, 55)
        this.title.view.style

        this.container.addChild(this.title.view)
    }

    createIcons() {
        this.createHeroIcon()
        this.createHellIcon()
    }

    createHeroIcon() {
        const sizes = this.getXAndY(true)

        const heroIcon = new Hero()
        heroIcon.createIcon('dante', sizes.x, sizes.y)

        this.container.addChild(heroIcon.sprite)
    }

    createHellIcon() {
        const sizes = this.getXAndY()

        this.sprite = new PIXI.Sprite(Globals.resources['inferno'].texture)
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

    createInferno() {
        const sizes = this.getXAndY(true)
        const height = window.innerHeight/100 * 65
        const width = window.innerWidth/100 * 40

        this.hellTriangle = new HellTriangle(sizes.x/2, sizes.y * 2.9, height, width)
        this.container.addChild(this.hellTriangle.container)
    }

    createInfernoStructure(infernoAxios) {
        const sizes = this.getXAndY(true)
        this.y = 0
        const scrollable = new ScrollableContainer(window.innerHeight/100 * 65,window.innerWidth/100 * 40, sizes.x * 3.35, sizes.y * 2.9)
        this.inferno.map(value => {
            const string = value[0]

            const isTrue = this.inferno.indexOf(value) < infernoAxios
            const label = new LabelNames(0, this.y, string, 30, 0, isTrue ? "#990000" : "#000000")
            const sprite = new PIXI.Sprite()

            sprite.addChild(label.view)
            sprite.interactive = isTrue
            sprite.buttonMode = isTrue

            sprite.on('mousedown', () => {
                this.manageClick(value, sizes.x * 3.35, sizes.y * 2.9, true, infernoAxios, this.inferno.indexOf(value))
            })

            this.y += 45
            scrollable.push(sprite)
        })

        this.addScrollable(scrollable)
    }

    addScrollable(scrollable) {
        this.container.addChild(scrollable.container)
    }

    manageClick(value, x, y, card, infernoAxios, actualInferno) {
        const manager = new CardManager(value, x, y, card, 0x990000, () => this.onCancel(infernoAxios), () => this.onSubmit(value, infernoAxios, actualInferno))
        this.container.children[5].destroy()
        this.container.addChild(manager.container)
    }

    onCancel(infernoAxios){
        this.container.children[5].destroy()
        this.createInfernoStructure(infernoAxios)
    }

    onSubmit(value, infernoAxios, actualInferno){
        if(value[1].what.type === 'video'){
            this.container.children[5].destroy()
            window.open(value[1].what.res, '_blank');

            if(actualInferno - infernoAxios === -1){
                axios.patch('/inferno/' + Globals.infId + '.json', {
                    level: infernoAxios + 1
                })
                    .then(r => this.getData((inf) => {
                        this.createInfernoStructure(inf)
                    }))
            }else {
                this.getData((inf) => {
                    this.createInfernoStructure(inf)
                })
            }

        }else{
            if(value[1].what.res === 'puzzle'){
                Globals.scene.start(new PuzzleScene())
            }
        }
    }
}