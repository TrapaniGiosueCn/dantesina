import * as PIXI from "pixi.js";
import { PuzzleGridConfig } from "./PuzzleGridConfig";
import { PuzzlePiece } from "./PuzzlePiece";

export class PuzzleGrid {
    constructor(isParadise = false, solved) {
        this.container = new PIXI.Container();
        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight / 2;
        this.container.sortableChildren = true;
        this.container.interactive = true

        this.indexes = []
        this.createPuzzlePieces(isParadise ,solved);
    }

    createPuzzlePieces(isParadise, solved) {
        this.pieces = [];
        this.pieces2 = []

        let ids = PuzzleGridConfig.map(field => field.id);

        PuzzleGridConfig.forEach(field => {
            const random = Math.floor(Math.random() * ids.length);
            const id = ids[random];
            ids = ids.filter(item => item !== id);

            const piece = new PuzzlePiece(id, field, isParadise);
            piece.on("dragend", () => this.onPieceDragEnd(piece, solved))
            this.container.addChild(piece.sprite);
            this.pieces.push(piece);
            this.pieces2.push({
                fieldId: piece.field.id,
                imageId: id
            })
        });
    }

    onPieceDragEnd(piece, solved) {
        const pieceToReplace = this.pieces.find(item =>
            item !== piece &&
            piece.sprite.x >= item.left &&
            piece.sprite.x <= item.right &&
            piece.sprite.y <= item.bottom &&
            piece.sprite.y >= item.top
        )

        let replacement = this.pieces2

        if(pieceToReplace){
            const replaceField = pieceToReplace.field;
            pieceToReplace.setField(piece.field);
            piece.setField(replaceField)

            const fieldId = piece.field.id
            const iField = fieldId - 1
            const fieldReplaceId = pieceToReplace.field.id
            const iFieldReplace = fieldReplaceId - 1

            let temp = replacement[iField].imageId
            replacement[iField].imageId = replacement[iFieldReplace].imageId
            replacement[iFieldReplace].imageId = temp

            let isOkay = true;
            let i = 9;
            replacement.forEach(el => {
                if(el.imageId !== i){
                    isOkay = false
                }

                i--;
            })

            if (isOkay){
                solved()
            }
        }else{
            piece.reset();
        }
    }
}