import * as PIXI from 'pixi.js'

export class LabelNames extends PIXI.Text {
    constructor(x , y , text, size = 44, anchor = 0, color = "#000000") {
        super();
        this.view = new PIXI.Text()
        this.view.x = x;
        this.view.y = y;
        this.anchor.set(anchor)
        this.view.style = {
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontVariant: "small-caps",
            fontWeight: "bold",
            fontSize: size,
            fill: [color],
        }
        this.renderLabel(text)
    }

    renderLabel(text){
        this.view.text = text + ''
    }
}