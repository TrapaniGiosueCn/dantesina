import * as PIXI from "pixi.js";
import { Globals } from "../scripts/Globals";
import {Platforms} from "../scripts/Platforms";
import {Hero} from "../scripts/Hero";
import {LabelScore} from "../scripts/LabelScore";
import {AfterRunScene} from "./AfterRunScene";
import {AnimatedBackground} from "../scripts/AnimatedBackground";

export class CorsaScene {
    constructor() {
        this.container = new PIXI.Container();
        this.createBackground();
        this.createPlatforms();
        this.createHero()
        this.createUI()
    }

    createUI(){
        this.labelScore = new LabelScore()
        this.container.addChild(this.labelScore.view)
        this.hero.sprite.on("score", () => {
            this.labelScore.render(this.hero.score)
        })

        this.hero.sprite.on("win", () => {
            Globals.scene.start(new AfterRunScene(this.hero.score, true))
        })
    }

    createBackground() {
        this.bg = new AnimatedBackground('backgroundCorsaPurgatorio');
        this.container.addChild(this.bg.container);
    }

    createPlatforms(){
        this.platforms = new Platforms()
        this.container.addChild(this.platforms.container)
    }

    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);

        this.container.interactive = true
        this.container.on("pointerdown", () => {
            this.hero.startJump()
        })
        this.hero.sprite.once("die", () => {
            Globals.scene.start(new AfterRunScene(this.hero.score))
        })
    }

    update(dt){
        this.bg.update(dt);
        this.platforms.checkCollisions(this.hero)
        this.platforms.update(dt)
        this.hero.update()
    }
}