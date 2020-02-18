// TODO: Integrar
import {
    SCENES,
    ASSETS
} from '../constants';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({
            // Talvez adicionar a key da cena num arquivo de constantes
            key: SCENES.SETTINGS
        });
    }

    preload() {

    }

    create() {
        let tutorial = this.add.image(400, 300, ASSETS.SPRITE.CONTROLS);

        this.startButton = this.add.text(0, 100, "BACK", {
                font: "bold 35px Courier",
                fill: "#ffffff",
                align: "center"
            })
            .setInteractive()
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState());

        this.startButton.alpha = 0.8;

        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Enviando parametros para outra cena
        // Enviando batatinhas para 'outra-scene'
    }

    update() {
        if (this.key.isDown) {
            this.sound.play(ASSETS.AUDIO.SFX_POWERUP_1);
            this.scene.start(SCENES.MENU, {
                skinIndex: 0
            });
        }
    }
}
