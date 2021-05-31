import * as PIXI from 'pixi.js'
import TextInput from 'pixi-text-input'
import {FinishGameCard} from "../scripts/FinishGameCard";
import {Globals} from "../scripts/Globals";
import {SelectPlaceScene} from "./SelectPlaceScene";
import {Background} from "../scripts/Background";
import {Button} from "../scripts/Button";
import {LabelNames} from "../scripts/LabelNames";
import axios from "../axios";

export class UsernameScene{
    constructor() {
        this.container = new PIXI.Container()
        this.createBackground()
        this.createInputBox()
        this.createButtonConfirm()
        //this.createButton()
    }

    createBackground() {
        this.bg = new Background("background2", 0.8);
        this.container.addChild(this.bg.container);
    }

    createInputBox() {
        this.input = new TextInput({
            input: {
                fontSize: '36px',
                padding: '12px',
                width: '400px',
                color: '#26272E'
            },
            box: {
                default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
                focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
                disabled: {fill: 0xDBDBDB, rounded: 12}
            }
        })

        this.input.placeholder = 'Inserisci username...'
        this.input.x = (window.innerWidth/100 * 40)
        this.input.y = 300
        this.input.pivot.x = this.input.width/2
        this.input.pivot.y = this.input.height/2

        this.container.addChild(this.input)
    }

    createButtonConfirm() {
        const x = (window.innerWidth/100 * 40)/4
        const buttonCancel2 = new Button('game', 280,  x, 0x712A1B, {}, 'Cerca')
        this.container.addChild(buttonCancel2.container)
        buttonCancel2.container.on('mousedown', () => this.checkUser(this.input.children[3]._text))
    }

    checkUser(uname) {
        let exist = false
        let uId = ''
        axios.get('/users.json')
            .then(response => {
                const data = response.data ? Object.values(response.data) : []
                data.map(val => {
                    if(val.username === uname){
                        exist = true
                        uId = val.mySelfId
                    }
                })

                const text = exist ? "Questo username è associato a un profilo\nContinua la tua avventura!" : "Questo username è nuovo\nInizia la tua avventura!"
                this.createDescription(uname, text, exist, uId)
            })
            .catch(error => console.log(error))
    }

    createDescription(uname, textToDisplay, exist, uId) {
        if(this.label){
            this.label.view.destroy()
            this.container.children[4].destroy()
            this.container.children[3].destroy()
        }
        const text = textToDisplay

        const length = uname.length * 8
        this.label = new LabelNames((window.innerWidth/2)-length, 350, uname)
        this.container.addChild(this.label.view)

        const string2 = text.split('\n')
        this.y = 350 + 40
        string2.map(str => {
            const len = str.length * 8
            const labelDescription = new LabelNames( (window.innerWidth/2) - len, this.y, str, 30, 0, '#000000')
            this.y += 25
            this.container.addChild(labelDescription.view)
        })

        this.createButton(uname, exist, uId)
    }

    createButton(uname, exist, uId) {
        const x = (window.innerWidth/100 * 40)/5.5
        const buttonCancel2 = new Button('game', this.y + 50,  x, 0x712A1B, {}, exist ? "Continua" : "Inizia")
        this.container.addChild(buttonCancel2.container)
        buttonCancel2.container.on('mousedown', () => this.postOrContinue(uname, exist, uId))
    }

    postOrContinue(uname, exist, uId) {
        if(exist){
            axios.get('/users/' + uId + '.json')
                .then(response => {
                    Globals.uId = uId
                    Globals.dimId = response.data.dimensionId

                    axios.get('/dimensions/' + response.data.dimensionId + '.json')
                        .then(respo => {

                            Globals.infId = respo.data.inferno.referId
                            Globals.purId = respo.data.purgatorio.referId
                            Globals.parId = respo.data.paradiso.referId

                            Globals.infAv = respo.data.inferno.available
                            Globals.purAv = respo.data.purgatorio.available
                            Globals.parAv = respo.data.paradiso.available

                            Globals.scene.start(new SelectPlaceScene())
                        })
                })
        }else{
            axios.post('/users.json', {
                username: uname
            })
                .then(response => {
                    axios.post('/inferno.json', {
                        userId: response.data.name,
                        username: uname,
                        level: 1
                    })
                        .then(respo => {
                            axios.post('/purgatorio.json', {
                                userId: response.data.name,
                                username: uname,
                                level: 1
                            })
                                .then(res => {
                                    axios.post('/paradiso.json', {
                                        userId: response.data.name,
                                        username: uname,
                                        level: 1
                                    })
                                        .then(r => {
                                            axios.post('/dimensions.json', {
                                                paradiso: {
                                                    referId: r.data.name,
                                                    available: false
                                                },
                                                purgatorio: {
                                                    referId: res.data.name,
                                                    available: false
                                                },
                                                inferno: {
                                                    referId: respo.data.name,
                                                    available: true
                                                }
                                            })
                                                .then(dim => {
                                                    axios.patch('/users/' + response.data.name + '.json', {
                                                        mySelfId: response.data.name,
                                                        dimensionId: dim.data.name
                                                    })

                                                    Globals.uId = response.data.name
                                                    Globals.dimId = dim.data.name

                                                    Globals.infId = respo.data.name
                                                    Globals.purId = res.data.name
                                                    Globals.parId = r.data.name


                                                    Globals.infAv = true
                                                    Globals.purAv = false
                                                    Globals.parAv = false
                                                    Globals.scene.start(new SelectPlaceScene())
                                                })
                                        })
                                })
                        })
                })
        }
    }
}