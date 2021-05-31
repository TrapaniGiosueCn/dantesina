import * as PIXI from "pixi.js";
import { Globals } from "../scripts/Globals";
import { PuzzleGrid } from "../scripts/PuzzleGrid";
import {AfterPuzzleScene} from "./AfterPuzzleScene";

export class PuzzleScene {
    constructor(isParadise = false) {
        this.container = new PIXI.Container();
        this.createBackground(isParadise);
        this.createPuzzleGrid(isParadise);
    }

    createBackground(isParadise) {
        this.bg = new PIXI.Sprite(Globals.resources[isParadise ? "backgroundPuzzleParadiso" : "backgroundPuzzleInferno"].texture);
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    createPuzzleGrid(isParadise) {
        const grid = new PuzzleGrid(isParadise,() => {
            Globals.scene.start(new AfterPuzzleScene(isParadise))
        });
        this.container.addChild(grid.container);
    }
}