import * as PIXI from 'pixi.js'
import {Globals} from "./Globals";

export class ParadiseTriangle{
    constructor(x, y, height, width) {
        this.container = new PIXI.Container()

        this.createTriangle(x, y, height, width)
    }

    createTriangle(x, y, height, width) {
        const sprite = new PIXI.Sprite(Globals.resources['paradisoStructure'].texture);
        sprite.height = height;
        sprite.width = width
        sprite.x = x;
        sprite.y = y;

        this.container.addChild(sprite)
    }
}