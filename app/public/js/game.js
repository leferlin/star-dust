// import SCENES from "../src/constants"
// import PreloadScene from "../src/scenes/PreloadScene"

// General constants
const SOFT_RED = 'ff6c6c';
const LIMIT_TIME_PARTICLES = 100;
const N_SHIP_SKINS = 8;

// Game variables
var bullet_array = [];
var team;
var bots;
var shipX;
var shipY;
var shipRotation;
var t = 0;
var emitter;
var emitterSkin;
var skinIndex = 0;
var shipSkin;
var background;
var iter = 0;
var backgroundSpeed = 0.01;
var shields = [];

class Preload extends Phaser.Scene {

    constructor() {
        super({ key: 'preloader' });
    }

    preload() {
        this.load.image('background', 'assets/background4_3.png');

        //Audios
        this.load.audio("gameStart", 'audio/powerup2.ogg');
    }


    create() {
        var logo = this.add.image(400, 300, 'background');

        this.startButton = this.add.text(180, 400, 'PRESS ENTER TO START', {
            font: "bold 35px Courier",
            fill: "#ffffff",
            align: "center"
        })
            .setInteractive()
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState());

        this.startButton.alpha = 0.8;

        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    enterButtonHoverState() {
        this.startButton.alpha = 1;
    }

    enterButtonRestState() {
        this.startButton.alpha = 0.8;
    }

    update() {
        if (this.key.isDown) {
            this.sound.play("gameStart");
            this.scene.start('menu');
            // this.scene.add(SCENES.PRELOAD, PreloadScene, false);
            // this.scene.start(SCENES.PRELOAD);

        }
    }
}

class Menu extends Phaser.Scene {

    constructor() {
        super({ key: 'menu' });
    }

    preload() {
        this.load.image('background', 'assets/background4_3.png');
        this.load.image('ship', 'assets/spaceShips_001.png');
        this.load.image('shipLarge', 'assets/shipLarge0.png');
        this.load.image('sparkYellow', 'assets/yellow.png');
        this.load.image('sparkBlue', 'assets/blue.png');
        this.load.image('sparkRed', 'assets/red.png');
    }

    create() {
			bots = 'NO';
			team = ''
			this.texts = this.physics.add.group();
			this.particles = this.physics.add.group();

			console.log(this.si);

			var background = this.add.image(400, 300, 'background');

			var particleYellow = this.add.particles('sparkYellow');
			var particleBlue = this.add.particles('sparkBlue');
			var particleRed = this.add.particles('sparkRed');

			//var color = randomHexColor();

			emitter = particleYellow.createEmitter({
				x: 670,
				y: 70,
				angle: { min: 170, max: 190 },
				speed: 200,
				gravityY: 0,
				lifespan: { min: 1000, max: 8000 },
				blendMode: 'ADD',
				scaleX: 0.6,
				scaleY: 0.6,
				//tint: color
			});

			emitter = particleBlue.createEmitter({
				x: 340,
				y: 360,
				blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 50,
				scaleX: 0.1,
				scaleY: 0.1,
				speed: 50
				//tint: color
			});

			emitter = particleRed.createEmitter({
				x: 460,
				y: 360,
				blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 50,
				scaleX: 0.1,
				scaleY: 0.1,
				speed: 50
				//tint: color
			});

			var ship = this.add.sprite(700, 70, 'shipLarge');
			ship.scaleX = 0.05;
			ship.scaleY = 0.05;
			ship.angle = 270;
			ship.setTint(0x0073a5);


			// team images
			var blueTeam = this.add.sprite(340, 360, 'shipLarge').setScale(0.05).setAngle(180)
				.setInteractive()
					.on('pointerdown', () => this.updateTeam('blue'));

			blueTeam.setTint(0x0073a5);

			var redTeam = this.add.sprite(460, 360, 'shipLarge').setScale(0.05).setAngle(180)
				.setInteractive()
					.on('pointerdown', () => this.updateTeam('red'));

			this.teamText = this.add.text(300, 290, "Choose your team: "+team, {
				font: "20px Courier",
				fill: "#ffffff",
				align: "center",
				style: "bold"
			});

			this.botsText = this.add.text(550, 180, 'Insert bots? '+bots, {
				font: "20px Courier",
				fill: "#ffffff",
				align: "center",
				style: "bold"
			})
				.setInteractive()
					.on('pointerdown', () => this.updateBotsText())
					.on('pointerover', () => this.buttonHover(this.botsText))
					.on('pointerout', () => this.buttonRest(this.botsText));

			this.startButton = this.add.text(280, 430, 'START GAME', {
				font: "bold 40px Courier",
				fill: "#c19b00",
				align: "center"
			})
				.setInteractive()
				.on('pointerdown', () => this.scene.start('play', { skinIndex: skinIndex }))
				.on('pointerover', () => this.buttonHover(this.startButton))
				.on('pointerout', () => this.buttonRest(this.startButton));
			this.startButton.alpha = 0.8;

			this.shipChangeButton = this.add.text(570, 120, 'Change ship', {
				font: "bold 25px Courier",
				fill: "#c19b00",
				align: "center"
			})
				.setInteractive()
				.on('pointerdown', () => this.changeScene())
				.on('pointerover', () => this.buttonHover(this.shipChangeButton))
				.on('pointerout', () => this.buttonRest(this.shipChangeButton));
    }

    update () {

    	// nothing here

    }

    buttonHover(text) {
        text.alpha = 1;
    }

    buttonRest(text) {
        text.alpha = 0.8;
    }

    updateBotsText() {
    	if (bots == 'NO') {
    		bots = 'YES';
    		this.botsText.setText('Insert bots? '+bots);
    	} else {
    		bots = 'NO';
    		this.botsText.setText('Insert bots? '+bots);
    	}
    }

    updateTeam(flag) {
    	team = flag;
    	this.teamText.setText('Choose your team: '+team);
   }

    changeScene () {
    	//this.scene.sleep('menu');
    	this.scene.switch('shipChange');
		}
}


class ShipChange extends Phaser.Scene {

    constructor() {
        super({ key: 'shipChange' });
    }

    preload() {
        this.load.image('shipLarge0', 'assets/shipLarge0.png');
       	this.load.image('shipLarge1', 'assets/shipLarge1.png');
       	this.load.image('shipLarge2', 'assets/shipLarge2.png');
       	this.load.image('shipLarge3', 'assets/shipLarge3.png');
       	this.load.image('shipLarge4', 'assets/shipLarge4.png');
       	this.load.image('shipLarge5', 'assets/shipLarge5.png');
       	this.load.image('shipLarge6', 'assets/shipLarge6.png');
       	this.load.image('shipLarge7', 'assets/shipLarge7.png');
        this.load.image('spark', 'assets/white.png');
        this.load.image('arrow', 'assets/arrow.png');
        this.load.image('bg', 'assets/spacebg.png');
        this.load.image('accept', 'assets/accept.png');
    }

		create() {
			var self = this

    	//var background = this.add.image(400, 300, 'background');
    	//this.cameras.main.backgroundColor.setTo(5,5,5);
    	background = this.add.tileSprite(400, 300, 1024, 1024, 'bg')

			var particle = this.add.particles('spark');

			emitterSkin = particle.createEmitter({
				x: 300,
				y: 300,
				angle: { min: 170, max: 190 },
				speed: 200,
				gravityY: 0,
				lifespan: { min: 1000, max: 8000 },
				blendMode: 'ADD',
				scaleX: 0.8,
				scaleY: 0.8,
				//tint: color
			});

			//emitter.tint(0x123123);


			shipSkin = this.add.sprite(400, 300, 'shipLarge0').setScale(0.2).setAngle(270);

			var upButton = this.add.sprite(400, 130, 'arrow').setScale(0.2).setAngle(180)
				.setInteractive()
				.on('pointerdown', () => this.changeSkin(self, 'up'));
			upButton.setTint(0x000000);

			var downButton = this.add.sprite(400, 470, 'arrow').setScale(0.2).setAngle(0)
				.setInteractive()
				.on('pointerdown', () => this.changeSkin(self, 'down'));
			downButton.setTint(0x000000);

			var acceptButton = this.add.sprite(600, 300, 'accept').setScale(0.3	)
				.setInteractive()
				.on('pointerdown', () => this.changeScene());


			// listen to keyboard commands
			this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
			this.arrowUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
			this.arrowDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

		}

    update () {

    	// background update
		  background.tilePositionX = Math.fround(iter) * 200;
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

    changeSkin (self, key) {

    	shipSkin.destroy();
    	emitterSkin.stop();

    	var particle = this.add.particles('spark');
			var color = randomHexColor();
			emitterSkin = particle.createEmitter({
				x: 300,
				y: 300,
				angle: { min: 170, max: 190 },
				speed: 200,
				gravityY: 0,
				lifespan: { min: 1000, max: 8000 },
				blendMode: 'ADD',
				scaleX: 0.8,
				scaleY: 0.8,
				tint: color
			});

  		if (key == 'up')
  			skinIndex = (skinIndex+1)%(N_SHIP_SKINS);
			else
				skinIndex = (skinIndex-1)%(N_SHIP_SKINS);
			if (skinIndex < 0) skinIndex = N_SHIP_SKINS+skinIndex;

			var shipName = 'shipLarge'+skinIndex;
			console.log(shipName);
			shipSkin = self.add.sprite(400, 300, shipName).setScale(0.2).setAngle(270);
    }

    buttonHover(text) {
        text.alpha = 1;
    }

    buttonRest(text) {
        text.alpha = 0.8;
    }

    changeScene () {
    	//this.scene.sleep('shipChange');
    	this.scene.switch('menu');
		}
}


class Play extends Phaser.Scene {

	constructor() {
		super({ key: 'play' });
	}

	init (data) {
		this.skinIndex = data.skinIndex;
	}

	preload() {
		this.load.image('ship0', 'assets/ship0.png');
   	this.load.image('ship1', 'assets/ship1.png');
   	this.load.image('ship2', 'assets/ship2.png');
   	this.load.image('ship3', 'assets/ship3.png');
   	this.load.image('ship4', 'assets/ship4.png');
   	this.load.image('ship5', 'assets/ship5.png');
   	this.load.image('ship6', 'assets/ship6.png');
   	this.load.image('ship7', 'assets/ship7.png');
   	this.load.image('enemieHunter', 'assets/enemieHunter.png');
		this.load.image('otherPlayer', 'assets/enemyBlack5.png');
		this.load.image('hp', 'assets/pill_red.png');
		this.load.image('asteroid', 'assets/asteroid.png');
		this.load.image('speed', 'assets/speed.png');
		this.load.image('star', 'assets/star_gold.png');
		this.load.image('debug_bg', 'assets/debug_bg.png');
		this.load.image('gem', 'assets/gem.png');
		this.load.image('bullet', 'assets/laser.png');
    this.load.image('shieldpowerup', 'assets/powerupGreen_shield.png');
    this.load.image('shieldImage', 'assets/shield1.png');

		// Audio loading
		this.load.audio('collision', 'audio/collision1.ogg');
		this.load.audio('death', 'audio/death1.ogg');
		this.load.audio('powerup1', 'audio/powerup1.ogg');
		this.load.audio('powerup2', 'audio/powerup2.ogg');
		this.load.audio('shot', 'audio/shot1.ogg');
		this.load.audio('teleport', 'audio/teleport1.ogg');
	}

	create() {
		var self = this;
		this.socket = io('', { query: "team="+team + "&bots="+bots + "&skinIndex="+this.skinIndex });
		this.players = this.add.group();
		this.asteroids = this.add.group();
		this.bullets = this.add.group();

		configureDebug(this);

		this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);
		this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);

		this.fuelText = this.add.text(16, 68, '', { fontSize: '32px', fill: '#FFFFFF' }).setScrollFactor(0);
		this.hpText = this.add.text(16, 44, '', { fontSize: '32px', fill: '#FFFFFF' }).setScrollFactor(0);
    this.shieldText = this.add.text(16, 92, '', { fontSize: '32px', fill: '#FFFFFF' }).setScrollFactor(0);

		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id) {
					if (players[id].shipSkinIndex == 'undefined')
						var shipName = 'ship'+'0';
					else
						var shipName = 'ship'+players[id].shipSkinIndex;
					console.log(shipName);
					displayPlayers(self, players[id], shipName);
				} else {
					if (players[id].enemieMode == 'chase')
						displayPlayers(self, players[id], 'enemieHunter');
					else
						displayPlayers(self, players[id], 'otherPlayer');
				}
			});
		});

		this.socket.on('newPlayer', function (playerInfo) {
			displayPlayers(self, playerInfo, 'otherPlayer');
		});

		this.socket.on('disconnect', function (playerId) {
			self.players.getChildren().forEach(function (player) {
				if (playerId === player.playerId) {
					player.destroy();
          for(var j=0; j<shields.length; j++) {
            if(shields[j].data === player.playerId) {
              shields[j].setPosition(-500, -500);
            }
          }
				}
			});
		});

		this.socket.on('playerUpdates', function (players) {
			Object.keys(players).forEach(function (id) {
				self.players.getChildren().forEach(function (player) {
					// Check that we have the correct player from the ones we have and the sent ones
					if (players[id].playerId === player.playerId) {
						player.setRotation(players[id].rotation);
						player.setPosition(players[id].x, players[id].y);

            if(players[id].hasShield) {
              updateShield(self, players[id].shield);
              self.shieldText.setVisible(true);
              for(var j=0; j<shields.length; j++) {
                if(shields[j].data === id) {
                  shields[j].setPosition(players[id].x, players[id].y);
                }
              }
            }
            else if(!players[id].hasShield) {
              for(var j=0; j<shields.length; j++) {
                if(shields[j].data === id) {
                  shields[j].setPosition(-500, -500);
                  self.shieldText.setVisible(false);
                }
              }
            }

						// If it is me
						if (player.playerId === self.socket.id) {
							shipX = players[id].x;
							shipY = players[id].y;
							shipRotation = players[id].rotation;
							updateFuel(self, players[id].fuel);
							updateHP(self, players[id].hp);

							// Make camera follow the player
							self.cameras.main.startFollow(players[id]);
						}
					}
				});
			});
		});

		this.socket.on('asteroidsCreate', function (asteroids) {
			asteroids.forEach(function (asteroid) {
				var physAsteroid = self.add.image(asteroid.x, asteroid.y, 'asteroid').setScale(asteroid.scaleX, asteroid.scaleY);
				physAsteroid.id = asteroid.id;
				self.asteroids.add(physAsteroid);
			});
		});

		this.socket.on('asteroidsUpdates', function (asteroids) {
			asteroids.forEach(function (asteroid) {
				var found = false;
				self.asteroids.getChildren().forEach(function (physAsteroid) {
						if (asteroid.id == physAsteroid.id) {
							physAsteroid.setPosition(asteroid.x, asteroid.y);
							found = true;
						}
				});
				// create new asteroids
				if (found == false) {
					var asteroidSon = self.add.image(asteroid.x, asteroid.y, 'asteroid').setScale(asteroid.scaleX, asteroid.scaleY);
					asteroidSon.id = asteroid.id;
					self.asteroids.add(asteroidSon);
				}
			});
		});

		this.socket.on('updateScore', function (scores) {
			self.blueScoreText.setText('Blue: ' + scores.blue);
			self.redScoreText.setText('Red: ' + scores.red);
		});

		this.socket.on('hpLocation', function (hpLocation) {
			if (!self.hppowerup) {
				self.hppowerup = self.add.image(hpLocation.x, hpLocation.y, 'hp');
			} else {
				self.hppowerup.setPosition(hpLocation.x, hpLocation.y);
			}
		});

		this.socket.on('starLocation', function (starLocation) {
			if (!self.star) {
				self.star = self.add.image(starLocation.x, starLocation.y, 'star');
			} else {
				self.star.setPosition(starLocation.x, starLocation.y);
			}

			// got star(?)
			// self.sound.play("powerup");
		});

    this.socket.on('shieldLocation', function (shieldLocation) {
      if (!self.shieldpowerup) {
        self.shieldpowerup = self.add.image(shieldLocation.x, shieldLocation.y, 'shieldpowerup');
      } else {
        self.shieldpowerup.setPosition(shieldLocation.x, shieldLocation.y);
      }

      // got star(?)
      // self.sound.play("powerup");
    });

		this.socket.on('updateFuel', function (fuel) {
			updateFuel(self, fuel);
		});

		this.socket.on('updateHP', function (hp) {
			updateHP(self, hp);
		});

    this.socket.on('updateShield', function (shield) {
      updateShield(self, shield);
    });

		this.socket.on('refuelingNudge', function () {
			// Change the color of the fuel label to red
			self.fuelText.setFill("#FF0000");
			// Set an asyncronous timeout that fires the function after the given miliseconds
			setTimeout(function () {
				// revert to the original color
				self.fuelText.setFill("#FFFFFF");
			}, 50);
		});

		this.socket.on('collisionFlash', function () {
			// Change the color of the hp label to red
			self.hpText.setFill("#FF0000");
			self.sound.play("collision");
			// Set an asyncronous timeout that fires the function after the given miliseconds
			setTimeout(function () {
				// revert to the original color
				self.hpText.setFill("#FFFFFF");
			}, 50);
		});

		this.socket.on('gotPowerUp', function(pwrUp) {
			self.sound.play(pwrUp);
		});

		this.socket.on('updateHPAst', function (asteroidId, colorRatio) {
			updateHPAst(self, asteroidId, colorRatio);
		});

		this.socket.on('deleteAsteroid', function(asteroidId) {
			self.asteroids.getChildren().forEach(function (asteroid) {
				if (asteroidId === asteroid.id) {
					//self.cameras.main.backgroundColor.setTo(0,0,0);
					asteroid.destroy();
				}
			});
		});

		this.socket.on('removeBullet', function(bulletId) {
			self.bullets.getChildren().forEach(function (bullet) {
				if (bulletId === bullet.id) {
					//self.cameras.main.backgroundColor.setTo(0,0,0);
					bullet.destroy();
				}
			});
		});

		// Listen for bullet update events
		this.socket.on('bulletCreate', function(bullet){
			var physBullet = self.add.image(bullet.x, bullet.y, 'bullet').setScale(0.5);
			physBullet.id = bullet.id;
			self.bullets.add(physBullet);
		});

		// Listen for bullet update events
		this.socket.on('bulletsUpdate', function(bullets){
			updateBullets(self, bullets);
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.leftKeyPressed = false;
		this.rightKeyPressed = false;
		this.upKeyPressed = false;
		this.spaceKeyPressed = false;
  }


	update() {

		const left = this.leftKeyPressed;
		const right = this.rightKeyPressed;
		const up = this.upKeyPressed;
		const space = this.spaceKeyPressed;
				   
		if (this.cursors.space.isDown && !this.deathState && !this.space && Math.random()>0.7) {
			//var speed_x = Math.cos(shipRotation + Math.PI/2) * 20;
			//var speed_y = Math.sin(shipRotation + Math.PI/2) * 20;
			this.spaceKeyPressed = true;
			//this.socket.emit('shoot-bullet',{x:shipX ,y:shipY ,angle:shipRotation, speed_x:speed_x, speed_y:speed_y});
			}
		else {
			this.spaceKeyPressed = false;
		}

		if (this.cursors.left.isDown) {
			this.leftKeyPressed = true;
		} else if (this.cursors.right.isDown) {
			this.rightKeyPressed = true;
		} else {
			this.leftKeyPressed = false;
			this.rightKeyPressed = false;
		}

		if (this.cursors.up.isDown) {
			this.upKeyPressed = true;
		} else {
			this.upKeyPressed = false;
		}

		if ((left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || space !== this.spaceKeyPressed)  && !this.deathState) {
			this.socket.emit('playerInput', {left: this.leftKeyPressed, right: this.rightKeyPressed, up: this.upKeyPressed, space: this.spaceKeyPressed});
		}
	}
}

 class GameOver extends Phaser.Scene {

    constructor() {
        super({ key: 'gameOver' });
    }

    preload() {
        this.load.image('gameover_img', 'assets/gameover.png');
    }


    create() {
        var logo = this.add.image(400, 300, 'gameover_img');

        this.restartButton = this.add.text(170, 450, 'PRESS ENTER TO RESTART', {
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
        this.startButton.alpha = 1;
    }

    enterButtonRestState() {
        this.startButton.alpha = 0.8;
    }

    update() {
        if (this.key.isDown) {
            this.scene.start('menu');
        }
    }
}

/* function */

var displayPlayers = function (self, playerInfo, sprite) {
	const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  const shield = self.add.sprite(-500, -500, 'shieldImage').setOrigin(0.5, 0.5).setDisplaySize(80, 60);
  shield.data = playerInfo.playerId;
	if (playerInfo.team === 'blue') {
    player.setTint(0x0000ff);
    shield.setTint(0x0000ff);
  }

	else if (playerInfo.team === 'red') {
		player.setTint(0xff0000);
    shield.setTint(0xff0000);
  }

	// enemies
	else if (playerInfo.enemieMode == 'running')
		player.setTint(0x4d4d4d);
	player.playerId = playerInfo.playerId;
  shields.push(shield);
	self.players.add(player);

};

var updateFuel = function (self, fuel) {
	self.fuelText.setText('Fuel: ' + Math.floor(fuel));
};

var updateHP = function (self, hp) {
	self.hpText.setText('HP: ' + Math.floor(hp));
};

var updateShield = function (self, shield) {
  self.shieldText.setText('Shield: ' + Math.floor(shield));
}

var updateHPAst = function (self, asteroidId, colorRatio) {
	self.asteroids.getChildren().forEach(function (asteroid) {
		if (asteroid.id === asteroidId) {
			var darkenAmount = (-1)*(100 - (Math.floor(colorRatio*100)));
			if (darkenAmount == -100) {
				asteroid.setTint(0x7228b3);
			} else {
			color = LightenDarkenColor('ffafaf', darkenAmount);
			asteroid.setTint('0x'+color);
			}
		}
	});
};

var updateBullets = function (self, bullets) {
	bullets.forEach(function (bullet) {
		self.bullets.getChildren().forEach(function (physBullet) {
			if (bullet.id == physBullet.id) {
			  physBullet.setPosition(bullet.x, bullet.y);
			}
		});
	});
};

var LightenDarkenColor = function (col, amt) {
	var usePound = false;

	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}

	var num = parseInt(col,16);
	var r = (num >> 16) + amt;

	if (r > 255) r = 255;
	else if  (r < 0) r = 0;

	var b = ((num >> 8) & 0x00FF) + amt;
	if (b > 255) b = 255;
	else if  (b < 0) b = 0;

	var g = (num & 0x0000FF) + amt;
	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
};

var randomHexColor = function () {
	return (Math.random()*0xFFFFFF<<0);
}


var config = {
	type: Phaser.AUTO,
	parent: 'phaser-example',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 }
		}
	},
	scale:{
		mode: Phaser.Scale.FIT,
		autocenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [Preload, Menu, ShipChange, Play]
	// Remove AA
	// render: {
	//     pixelArt: true
	// }
}

var game = new Phaser.Game(config);

function configureDebug(context){
	// Add debug background
	context.add.image(0, 0, 'debug_bg').setOrigin(0).setAlpha(0.2);

	// var gui = new dat.GUI();

	// //  Our image is 1920 x 989.
	// //  Our game canvas is 800 x 600.
	// this.add.image(0, 0, 'gem').setOrigin(0);

	// // camera1 = this.cameras.main;
	// var camera1 = context.cameras.add(0, 0, 400, 300).setZoom(0.5);

	// gui.addFolder('Camera 1');
	// gui.add(camera1, 'x');
	// gui.add(camera1, 'y');
	// gui.add(camera1, 'width');
	// gui.add(camera1, 'height');
	// gui.add(camera1, 'centerToSize');
	// gui.add(camera1, 'scrollX', -1920, 1920);
	// gui.add(camera1, 'scrollY', -989, 989);
	// gui.add(camera1, 'zoom', 0.1, 2).step(0.1);
	// gui.add(camera1, 'rotation').step(0.01);
	// gui.addColor(camera1, 'backgroundColor').onChange(function (value) {
	//     value.a = 255;
	//     camera1.setBackgroundColor(value);
	// });
}
