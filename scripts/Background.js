import * as PIXI from "pixi.js";
import { Globals } from "./Globals";

export class Background {
    constructor(name, alpha = 1) {
        this.container = new PIXI.Container();
        this.createSprites(name, alpha);
    }

    createSprites(name, alpha) {
        this.sprites = [];

        for (let i = 0; i < 3; i++) {
            this.createSprite(i, name, alpha);
        }
    }

    createSprite(i, name, alpha) {
        const sprite = new PIXI.Sprite(Globals.resources[name].texture);
        sprite.height = window.innerHeight;
        sprite.width = window.innerWidth
        sprite.x = sprite.width * i;
        sprite.y = 0;
        sprite.alpha = alpha
        this.container.addChild(sprite);
        this.sprites.push(sprite);
    }
}