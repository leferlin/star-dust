import {
    SCENES,
    ASSETS,
    STRINGS
} from '../constants/index';

//TODO: Change texts with contants
export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENES.PRELOAD
        });
    }

    loadAll() {
        for (let file in ASSETS.SPRITE) {
            this.load.image(ASSETS.SPRITE[file], ASSETS.SPRITE[file]);
        }

        for (let file in ASSETS.AUDIO) {
            this.load.audio(ASSETS.AUDIO[file], ASSETS.AUDIO[file]);
        }
    }

    preload() {
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        });

        this.loadAll();

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        });

        this.load.on("complete", () => {
            console.log("Load Complete.");
        });

        // ! DEBUG
        this.load.on("load", (file) => {
            console.log(`The ${file.src} was loaded.`);
        });
    }

    create() {
        let bg_intro = this.add.image(400, 300, ASSETS.SPRITE.BG_INTRO);
        let logo = this.add.image(400, 150, ASSETS.SPRITE.GAME_TITLE).setScale(0.5);

        this.startButton = this.add.text(180, 400, STRINGS.ENTER_TO_START, {
                font: "bold 35px Courier",
                fill: "#ffffff",
                align: "center"
            })
            .setInteractive()
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState());

        this.startButton.alpha = 0.8;

        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.settingsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    enterButtonHoverState() {
        this.startButton.alpha = 1;
    }

    enterButtonRestState() {
        this.startButton.alpha = 0.8;
    }

    update() {
        if (this.key.isDown) {
            this.sound.play(ASSETS.AUDIO.SFX_POWERUP_1);
            this.scene.start(SCENES.MENU, {
                skinIndex: 0
            });
        }
        if (this.settingsKey.isDown) {
            this.sound.play(ASSETS.AUDIO.SFX_TELEPORT);
            this.scene.start(SCENES.SETTINGS);
        }
    }
}