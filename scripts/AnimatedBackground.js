import * as PIXI from "pixi.js";
import { Globals } from "./Globals";

export class AnimatedBackground {
    constructor(name) {
        this.speed = 1;
        this.container = new PIXI.Container();
        this.createSprites(name);
    }

    createSprites(name) {
        this.sprites = [];

        for (let i = 0; i < 3; i++) {
            this.createSprite(i, name);
        }
    }

    createSprite(i, name) {
        const sprite = new PIXI.Sprite(Globals.resources[name].texture);
        sprite.x = sprite.width * i;
        sprite.y = 0;
        this.container.addChild(sprite);
        this.sprites.push(sprite);
    }

    move(sprite, offset){
        const spriteRightX = sprite.x + sprite.width;

        const screenLeftX = 0;

        if(spriteRightX <= screenLeftX){
            sprite.x += sprite.width * this.sprites.length;
        }

        sprite.x -= offset;
    }

    update(dt){
        const offset = this.speed * dt;

        this.sprites.forEach(sprite => {
            this.move(sprite, offset)
        })
    }
}