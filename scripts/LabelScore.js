import * as PIXI from 'pixi.js'

export class LabelScore extends PIXI.Text {
    constructor(x = 10, y = 10, anchor = 0) {
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
            fontSize: 44,
            fill: ["#FF7F50"]
        }
        this.render()
    }

    render(score = 0){
        this.view.text = 'Score: ' + score
    }
}