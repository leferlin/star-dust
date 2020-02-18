import {
    SCENES,
    ASSETS,
    BIG_SHIPS
} from "../constants";

const backgroundSpeed = 0.01;
var shipSkin;
var emitterSkin;
var iter;

export default class ShipChangeScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENES.SHIP_CHANGE
        });

        this.skinIndex = 0;
    }

    init(data) {
        this.skinIndex = data.skinIndex;
    }

    preload() {

    }

    create() {
        var self = this;

        console.log(this.skinIndex);
        console.log(this.restarted);

        this.big_ships = Object.values(BIG_SHIPS);
        //var background = this.add.image(400, 300, 'background');
        //this.cameras.main.backgroundColor.setTo(5,5,5);
        iter = 0;
        shipSkin = ASSETS.SPRITE.SS_LARGE_SHIP_0;
        this.background = this.add.tileSprite(400, 300, 1024, 1024, ASSETS.SPRITE.BG_SPACE);

        var particle = this.add.particles(ASSETS.SPRITE.PART_SPARK);

        emitterSkin = particle.createEmitter({
            x: 300,
            y: 300,
            angle: {
                min: 170,
                max: 190
            },
            speed: 200,
            gravityY: 0,
            lifespan: {
                min: 1000,
                max: 8000
            },
            blendMode: 'ADD',
            scaleX: 0.8,
            scaleY: 0.8,
            //tint: color
        });

        //emitter.tint(0x123123);

        this.shipSkin = this.add.sprite(400, 300, this.big_ships[this.skinIndex]).setScale(0.6).setAngle(270);

        var upButton = this.add.sprite(400, 130, ASSETS.SPRITE.BTN_ARROW).setScale(0.2).setAngle(180)
            .setInteractive()
            .on('pointerdown', () => this.changeSkin(self, 'up'));

        var downButton = this.add.sprite(400, 470, ASSETS.SPRITE.BTN_ARROW).setScale(0.2).setAngle(0)
            .setInteractive()
            .on('pointerdown', () => this.changeSkin(self, 'down'));

        var acceptButton = this.add.sprite(600, 300, ASSETS.SPRITE.BTN_ACCEPT).setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => this.changeScene());


        // listen to keyboard commands				
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.arrowUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.arrowDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        // background update
        this.background.tilePositionX = Math.fround(iter) * 200;
        iter += backgroundSpeed;

        // treat keyboard inputs
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.changeScene();
        } else if (Phaser.Input.Keyboard.JustDown(this.arrowUp)) {
            this.changeSkin(this, 'up');
        } else if (Phaser.Input.Keyboard.JustDown(this.arrowDown)) {
            this.changeSkin(this, 'down');
        }
    }

    changeSkin(self, key) {
        self.shipSkin.destroy();
        emitterSkin.stop();

        var particle = this.add.particles(ASSETS.SPRITE.PART_SPARK);
        var color = self.randomHexColor();
        self.emitterSkin = particle.createEmitter({
            x: 300,
            y: 300,
            angle: {
                min: 170,
                max: 190
            },
            speed: 200,
            gravityY: 0,
            lifespan: {
                min: 1000,
                max: 8000
            },
            blendMode: 'ADD',
            scaleX: 0.8,
            scaleY: 0.8,
            tint: color
        });

        self.skinIndex = key == 'up' ? (self.skinIndex + 1) % (Math.floor((this.big_ships.length)/2)) : (self.skinIndex - 1) % (Math.floor((this.big_ships.length)/2));

        if (self.skinIndex < 0) self.skinIndex = Math.floor((this.big_ships.length)/2) + self.skinIndex;

        var shipName = this.big_ships[self.skinIndex];
        console.log(shipName);
        console.log(self.skinIndex);
        self.shipSkin = self.add.sprite(400, 300, shipName).setScale(0.6).setAngle(270);
    }

    buttonHover(text) {
        text.alpha = 1;
    }

    buttonRest(text) {
        text.alpha = 0.8;
    }

    randomHexColor() {
        return (Math.random() * 0xFFFFFF << 0);
    }

    changeScene() {
        // this.scene.switch(SCENES.MENU);
        this.scene.start(SCENES.MENU, {
            skinIndex: this.skinIndex
        });
    }
}
