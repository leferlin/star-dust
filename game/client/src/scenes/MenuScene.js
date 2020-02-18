import {
    SCENES,
    ASSETS,
    STRINGS,
    PLAYER_SHIPS,
    BIG_SHIPS,
    WEAPONS
} from '../constants/index';

export const DEFAULT_TEXT_CONFIG = {
    font: "20px Courier",
    fill: "#ffffff",
    align: "center",
    style: "bold"
};

export default class MenuScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENES.MENU
        });

        // Inner properties
        this.skinIndex = 0;
        this.restarted = false;
        this.team = STRINGS.NO_TEAM;
        this.bots = STRINGS.BOTS_OFF;
    }

    init(data) {
        this.restarted = data.restarted;
        this.skinIndex = data.skinIndex;
    }

    preload() {
        //SKip
    }

    create() {
        this.texts = this.physics.add.group();
        this.player_ships = Object.values(BIG_SHIPS);

        let background = this.add.image(400, 300, ASSETS.SPRITE.BG_INTRO);
        // let logo = this.add.image(700, 112, ASSETS.SPRITE.BIG_SHIP).setAlpha(0.2);
        var comecarString = this.restarted ? STRINGS.RESTART_GAME : STRINGS.START_GAME;

        this.particleMaker();

        // ? Ships

        var ship = this.add.sprite(700, 70, this.player_ships[this.skinIndex]);
        ship.scaleX = 0.15;
        ship.scaleY = 0.15;
        ship.angle = 270;
        ship.setTint(0x0073a5);

        console.log(this.skinIndex);
        console.log(this.restarted);

        // ? Team Ships
        // team images
        
        var blueTeam = this.add.sprite(250, 360, ASSETS.SPRITE.BLUE_LOGO).setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => this.updateTeam(STRINGS.BLUE_TEAM));

        var redTeam = this.add.sprite(550, 360, ASSETS.SPRITE.RED_LOGO).setScale(0.3)
            .setInteractive()
            .on('pointerdown', () => this.updateTeam(STRINGS.RED_TEAM));

        // ? Labels
        this.teamText = this.add.text(605, 210, STRINGS.TEAM_LABEL + this.team, {
            font: "15px Courier",
            fill: "#ffffff",
            align: "center"
        });

        this.botsText = this.add.text(550, 180, STRINGS.INSERT_BOTS + this.bots, DEFAULT_TEXT_CONFIG)
            .setInteractive()
            .on('pointerdown', () => this.updateBotsText())
            .on('pointerover', () => this.buttonHover(this.botsText))
            .on('pointerout', () => this.buttonRest(this.botsText));


        // ? Buttons
        this.shipChangeButton = this.add.text(570, 120, STRINGS.CHOOSE_SHIP, {
                font: "bold 25px Courier",
                fill: "#c19b00",
                align: "center"
            })
            .setInteractive()
            .on('pointerdown', () => this.changeScene())
            .on('pointerover', () => this.buttonHover(this.shipChangeButton))
            .on('pointerout', () => this.buttonRest(this.shipChangeButton));

        this.startButton = this.add.image(400, 550, ASSETS.SPRITE.BTN_START_GAME)
            .setInteractive()
            .on('pointerdown', () => this.playGame(this.restarted))
            .on('pointerover', () => this.buttonHover(this.startButton))
            .on('pointerout', () => this.buttonRest(this.startButton));


        // this.startButton = this.add.text(280, 430, comecarString, {
        //         font: "bold 40px Courier",
        //         fill: "#c19b00",
        //         align: "center"
        //     })
        //     .setInteractive()
        //     .on('pointerdown', () => this.playGame(this.restarted))
        //     .on('pointerover', () => this.buttonHover(this.startButton))
        //     .on('pointerout', () => this.buttonRest(this.startButton));

        // this.startButton.alpha = 0.8;
    }

    particleMaker() {
        this.particles = this.physics.add.group();

        var emitter;
        var particleYellow = this.add.particles(ASSETS.SPRITE.PART_YELLOW);
        var particleBlue = this.add.particles(ASSETS.SPRITE.PART_BLUE);
        var particleRed = this.add.particles(ASSETS.SPRITE.PART_RED);

        
        emitter = particleYellow.createEmitter({
            x: 670,
            y: 70,
            angle: {
                min: 170,
                max: 190
            },
            speed: 200,
            gravityY: 0,
            lifespan: {
                min: 1000,
                max: 3000
            },
            quantity: 20,
            blendMode: 'ADD',
            scaleX: 0.6,
            scaleY: 0.6,
            //tint: color
        });

        this.shipParticle = particleYellow;
        
        emitter = particleBlue.createEmitter({
            x: 250,
            y: 360,
            blendMode: 'SCREEN',
            scale: {
                start: 0.4,
                end: 0.1
            },
            speed: {
                min: -100,
                max: 100
            },
            quantity: 20,
            scaleX: 0.1,
            scaleY: 0.1,
            //tint: color
        });

        emitter = particleRed.createEmitter({
            x: 550,
            y: 360,
            blendMode: 'SCREEN',
            scale: {
                start: 0.4,
                end: 0.1
            },
            speed: {
                min: -100,
                max: 100
            },
            quantity: 20,
            scaleX: 0.1,
            scaleY: 0.1,
            //tint: color
        });

    }

    // TODO: Create custom buttons
    enterButtonHoverStateColor() {
        this.colorButton.setStyle({
            fill: '#ff0'
        });
    }

    enterButtonRestStateColor() {
        this.colorButton.setStyle({
            fill: '#fff'
        });
    }

    buttonHover(text) {
        text.alpha = 1;
    }

    buttonRest(text) {
        text.alpha = 0.8;
    }

    updateBotsText() {
        this.bots = this.bots == STRINGS.BOTS_OFF ? STRINGS.BOTS_ON : STRINGS.BOTS_OFF;
        this.botsText.setText(STRINGS.INSERT_BOTS + this.bots);
    }

    updateTeam(flag) {
        this.team = flag;
        this.teamText.setText(STRINGS.TEAM_LABEL + this.team);
    }

    changeScene() {
        // this.scene.switch(SCENES.SHIP_CHANGE);
        this.scene.start(SCENES.SHIP_CHANGE, {
            skinIndex: this.skinIndex
        });
    }

    playGame(ress) {
        this.scene.start(SCENES.PLAY, {
            team: this.team,
            bots: this.bots,
            skinIndex: this.skinIndex
        });
    }

}
