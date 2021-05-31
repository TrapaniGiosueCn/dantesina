import * as PIXI from 'pixi.js'
import {Globals} from "../scripts/Globals";
import {LabelNames} from "../scripts/LabelNames";
import {SelectPlaceScene} from "./SelectPlaceScene";
import {UsernameScene} from "./UsernameScene";

export class FirstScene{
    constructor(app) {
        this.app = app

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.percentage = 0;

        this.container = new PIXI.Container()
        this.container.interactive = true;
        this.dragging = false

        this.brush = new PIXI.Graphics()
        this.brush.beginFill(0xffffff);
        this.brush.drawCircle(0, 0, 150);
        this.brush.endFill();

        this.renderTexture = PIXI.RenderTexture.create({width: this.width, height: this.height})
        this.renderTextureSprite = new PIXI.Sprite(this.renderTexture)

        this.setup()
        this.createLabel()

        this.container.on('pointerdown', (event) => this.pointerDown(event))
        this.container.on('pointerup', (event) => this.pointerUp(event))
        this.container.on('pointermove', (event) => this.pointerMove(event))
    }

    setup() {
        this.background = new PIXI.Sprite(Globals.resources["background"].texture)
        this.container.addChild(this.background)
        this.background.width = this.width
        this.background.height = this.height

        this.background2 = new PIXI.Sprite(Globals.resources["background2"].texture)
        this.container.addChild(this.background2)
        this.background2.width = this.width
        this.background2.height = this.height

        this.container.addChild(this.renderTextureSprite)
        this.background2.mask = this.renderTextureSprite
    }

    pointerMove(event) {
        if (this.dragging){
            this.brush.position.copyFrom(event.data.global)
            this.app.renderer.render(this.brush, {
                renderTexture: this.renderTexture,
                clear: false,
                transform: null,
                skipUpdateTransform: false
            })
        }
    }

    pointerDown(event) {
        this.dragging = true
        this.pointerMove(event)
    }

    pointerUp(event) {
        this.dragging = false
        let imageData = this.app.renderer.plugins.extract.pixels(this.renderTexture);

        const totPixels = imageData.length
        let pixelsDiscovered = 0;
        if(!imageData.includes(0)){
            Globals.scene.start(new UsernameScene())
        }else {
            for(let i = 0; i < totPixels; i++){
                if (imageData[i] === 255){
                    pixelsDiscovered++;
                }
            }

            this.percentage = ((pixelsDiscovered / totPixels) * 100).toString()
            const decimals = this.percentage.split('.')[1]
            let newDecimals = ''
            if(decimals.length > 2){
                for(let i = 0; i < decimals.length; i++){
                    if(i <= 1){
                        newDecimals += decimals[i]
                    }
                }
            }

            this.percentage = this.percentage.split('.')[0] + '.' + newDecimals
            this.container.emit('newPercentage')
        }
    }

    createLabel() {
        this.labelScore = new LabelNames(window.innerWidth/2, window.innerHeight/2, this.percentage + '%', 60)
        this.container.addChild(this.labelScore.view)
        this.container.on("newPercentage", () => {
            this.labelScore.renderLabel(this.percentage + '%')
        })
    }
}