import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";

export class PuzzlePiece extends PIXI.utils.EventEmitter {
    constructor(id, field, isParadise) {
        super();
        this.sprite = new PIXI.Sprite(Globals.resources[isParadise ? `paraPuzzle${id}` : `puzzle${id}`].texture);
        this.field = field;
        this.reset();
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.setInteractive();
    }

    setInteractive() {
        this.sprite.interactive = true;
        this.sprite.on("pointerdown", this.onTouchStart, this);
        this.sprite.on("pointermove", this.onTouchMove, this);
        this.sprite.on("pointerup", this.onTouchEnd, this);
    }

    onTouchStart(event) {
        // 1. save the position of the mouse cursor
        this.touchPosition = {x: event.data.global.x, y: event.data.global.y};

        // 2. set the dragging state for this sprite
        this.dragging = true;
        this.sprite.zIndex = 1;
    }

    onTouchMove(event) {
        if (!this.dragging) {
            return;
        }

        // 1. get the coordinates of the cursor
        const currentPosition = {x: event.data.global.x, y: event.data.global.y};

        // 2. calculate the offset
        const offsetX = currentPosition.x - this.touchPosition.x;
        const offsetY = currentPosition.y - this.touchPosition.y;

        // 3. apply the resulting offset
        this.sprite.x = this.field.x + offsetX;
        this.sprite.y = this.field.y + offsetY;
    }

    onTouchEnd() {
        this.dragging = false;
        this.sprite.zIndex = 0;

        this.emit("dragend")
    }

    reset() {
        const tween = new TWEEN.Tween(this.sprite)
        tween.to({x: this.field.x, y: this.field.y}, 300)
        tween.onStart(() => {
            this.sprite.zIndex = 1;
        })
        tween.onComplete(() => {
            this.sprite.zIndex = 0;
        })
        tween.easing(TWEEN.Easing.Back.Out)

        tween.start()
    }

    get left(){
        return this.sprite.x - this.sprite.width / 2
    }

    get right(){
        return this.sprite.x + this.sprite.width / 2
    }

    get top(){
        return this.sprite.y - this.sprite.height / 2
    }

    get bottom(){
        return this.sprite.y + this.sprite.height / 2
    }

    setField(field){
        this.field = field
        this.reset()
    }
}