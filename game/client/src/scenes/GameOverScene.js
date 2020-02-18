import {
    SCENES,
    ASSETS,
    STRINGS
} from "../constants";

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENES.GAMEOVER
        });
    }

    init(data){
        this.skinIndex = data.skinIndex;
    }

    preload() {
        // SKIP
    }

    create() {
        var logo = this.add.image(400, 300, ASSETS.SPRITE.BG_GAMEOVER);

        this.restartButton = this.add.text(170, 450, STRINGS.ENTER_TO_RESTART, {
                font: "bold 35px Courier",
                fill: "#ffffff",
                align: "center"
            })
            .setInteractive()
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState());

        this.restartButton.alpha = 0.8;

        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    enterButtonHoverState() {
        this.restartButton.alpha = 1;
    }

    enterButtonRestState() {
        this.restartButton.alpha = 0.8;
    }

    update() {
        if (this.key.isDown) {
            this.scene.start(SCENES.MENU, {
                restarted: true,
                skinIndex: this.skinIndex
            });
        }
    }
}
