import * as PIXI from 'pixi.js'
import {Globals} from "./scripts/Globals";
import {SceneManager} from "./scene/SceneManager";
import {Loader} from "./scripts/Loader";
import {UsernameScene} from "./scene/UsernameScene";
import {FirstScene} from "./scene/FirstScene";

const mouseIcon = "url('sprites/mouse/danteface.png'),auto"

export class App {
    run(){
        this.app = new PIXI.Application({resizeTo: window});
        document.body.appendChild(this.app.view)
        this.app.renderer.plugins.interaction.cursorStyles.myMouse = mouseIcon
        this.app.renderer.plugins.interaction.setCursorMode('myMouse')

        Globals.scene = new SceneManager()
        this.app.stage.addChild(Globals.scene.container)
        this.app.ticker.add(dt => Globals.scene.update(dt))

        this.loader = new Loader(this.app.loader)
        this.loader.preload().then(() => Globals.scene.start(new FirstScene(this.app)))
    }
}