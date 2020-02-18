import {
    SCENES,
    ASSETS,
    QUERY,
    PLAYER_SHIPS,
    BOTS,
    STRINGS, 
    WEAPONS,
    COLORS
} from '../constants/index';

var slotFrame;
var slot1;
var slot2;
var slot3;

export default class PlayScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENES.PLAY
        });
    }

    init(data) {
        this.team = data.team == STRINGS.NO_TEAM ? ((Math.random() * 2) > 1 ? STRINGS.RED_TEAM : STRINGS.BLUE_TEAM) : data.team;
        this.bots = data.bots;
        this.skinIndex = data.skinIndex;
    }

    // TODO: Add sprite atlas
    preload() {
        // Resources already loaded
        this.load.image('asteroid1', 'assets/asteroid1.png');
        this.load.image('asteroid2', 'assets/asteroid2.png');
        this.load.image('asteroid3', 'assets/asteroid3.png');
        this.load.image('asteroid4', 'assets/asteroid4.png');
        this.load.image('asteroid5', 'assets/asteroid5.png');
        this.load.image('asteroid6', 'assets/asteroid6.png');
        this.load.image('asteroid7', 'assets/asteroid7.png');
        this.load.image('asteroid8', 'assets/asteroid8.png');
        this.load.image('asteroid9', 'assets/asteroid9.png');
    }

    create() {
        var self = this;
        this.add.tileSprite(4000,3000,8000,6000,ASSETS.SPRITE.BG_FINAL).setScrollFactor(1);
        this.player_ships = Object.values(PLAYER_SHIPS);
        this.add.image(3875, 531, ASSETS.SPRITE.SUN).setOrigin(0);
        this.add.image(512, 680, ASSETS.SPRITE.BLUEPLANET).setOrigin(0);
        this.add.image(2833, 1246, ASSETS.SPRITE.BROWNPLANET).setOrigin(0);
        this.add.image(908, 3922, ASSETS.SPRITE.PURPLEPLANET).setOrigin(0);
        this.add.image(6052, 4280, ASSETS.SPRITE.GASGIANT).setOrigin(0);

        // TODO: Incoming Changes
        var bullet_array = [];
        var shipRotation;
        var deltaX;
        var deltaY;
        
        this.grayscalePipeline = this.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.game));

        // TODO: Declutter incoming values
        this.socket = io('', {
            query: QUERY.TEAM + this.team + QUERY.BOTS + this.bots + QUERY.SKIN_INDEX + this.skinIndex
        });

        this.players = this.add.group();
        this.asteroids = this.add.group();
        this.bullets = this.add.group();
        this.weapons = this.add.group();
        this.guns = this.add.group();
        this.shields = [];
        this.alive = true;

        console.log(this.players);
        //configureDebug(this);

        // TODO: Create a Text Factory function
        this.blueScoreText = this.add.text(16, 16, '', {
            fontSize: '32px',
            fill: COLORS.BLUE_TEAM_1
        }).setScrollFactor(0);
        this.redScoreText = this.add.text(584, 16, '', {
            fontSize: '32px',
            fill: COLORS.RED_TEAM_1
        }).setScrollFactor(0);

        this.fuelText = this.add.text(16, 68, '', {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setScrollFactor(0);
        this.hpText = this.add.text(16, 44, '', {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setScrollFactor(0);

         this.restartButton = this.add.image(400, 80, ASSETS.SPRITE.BTN_RESTART_GAME);

        // self score
        this.selfScoreText = this.add.text(16, 116, 'Score: ', {
            fontSize: '32px',
            fill: '#0000FF'
        }).setScrollFactor(0);

        this.restartButton.setScrollFactor(0);
        this.restartButton.setVisible(false);
        
        this.currentPlayerScore = this.add.text(292, 16, '', {
            fontSize: '32px',
            fill: '#FFFFFF'
        }).setScrollFactor(0);
        
		this.shieldText = this.add.text(16, 92, '', {
			fontSize: '32px',
			fill: '#FFFFFF'
		}).setScrollFactor(0);

        
        // Slots and frame representation 
        slotFrame = this.add.image(300, 45, ASSETS.SPRITE.WEAPON_FRAME).setScale(0.4).setScrollFactor(0);
		slotFrame.alpha = 0;  
		
		slot1 = this.add.image(300, 45, ASSETS.SPRITE.GUN_1).setScrollFactor(0);
		slot1.setTint(0x4d4d4d);
   		slot1.setScale(0.8);
		slot1.alpha = 0;
		
		slot2 = this.add.image(370, 45, ASSETS.SPRITE.GUN_1).setScrollFactor(0);
		slot2.setTint(0x4d4d4d);
   		slot2.setScale(0.8);
		slot2.alpha = 0;
		
		slot3 = this.add.image(440, 45, ASSETS.SPRITE.GUN_1).setScrollFactor(0);
		slot3.setTint(0x4d4d4d);
   		slot3.setScale(0.8);
		slot3.alpha = 0; 

        // Player
        this.socket.on('currentPlayers', function (players, guns) {
            Object.keys(players).forEach(function (id) {
                if (players[id].team != STRINGS.ENEMIE_TEAM) {
                    var index = players[id].shipSkinIndex != null ? players[id].shipSkinIndex : 0;
                    var shipSprite = self.player_ships[index];
                    displayPlayers(self, players[id], shipSprite);
                } else {
                    if (players[id].enemieMode == BOTS.CHASE_MODE)
                        displayPlayers(self, players[id], ASSETS.SPRITE.SHIP_ENEMY_HUNTER);
                    else
                        displayPlayers(self, players[id], ASSETS.SPRITE.SHIP_ENEMY_1);
                }
                
                // Renderize gun 
		        Object.keys(guns).forEach(function (gunId) {
		        	if (guns[gunId].owner == id) {
		        		// create new gun
						var gunRotation = players[id].rotation;
						var gunX = players[id].x + WEAPONS.DIST_TO_PLAYER*Math.cos(Math.PI/2+gunRotation);
						var gunY = players[id].y + WEAPONS.DIST_TO_PLAYER*Math.sin(Math.PI/2+gunRotation);
						
						switch (guns[gunId].gunType) {
							case 0:
							case '0':
								// nothin to be done
								break;
							case 1:
							case '1':
								var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_1).setScale(0.6);
								break;
							case 2:
							case '2':
								var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_2).setScale(0.6);
								break;
							case 3:
							case '3':
								var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_3).setScale(0.6);
								break;
							case 4:
							case '4':
								var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_4).setScale(0.6);
								break;			
						}		
						physGun.gunId = gunId;
						physGun.owner = guns[gunId].owner;
						physGun.setTint(0x4d4d4d);
						self.guns.add(physGun);                     		
		        	}                        
		        });	
            });
        });

        // TODO: Add custom ship sprites to other players
        this.socket.on('newPlayer', function (playerInfo) {
    		if (playerInfo.team != STRINGS.ENEMIE_TEAM) {
                var index = playerInfo.shipSkinIndex != null ? playerInfo.shipSkinIndex : 0;
                var shipSprite = self.player_ships[index];
                displayPlayers(self, playerInfo, shipSprite);
            } else {
                if (playerInfo.enemieMode == BOTS.CHASE_MODE)
                    displayPlayers(self, playerInfo, ASSETS.SPRITE.SHIP_ENEMY_HUNTER);
                else
                    displayPlayers(self, playerInfo, ASSETS.SPRITE.SHIP_ENEMY_1);
            }
        });

        this.socket.on('disconnect', function (playerId) {
            self.players.getChildren().forEach(function (player) {
                if (playerId === player.playerId) {
                    console.log(player);
                    player.destroy();
                    self.shields.forEach((shield) => {
                        if (shield.playerData == playerId) {
                            shield.setPosition(-500, -500);
                        }
                    });
                }
            });
            
            // destroy player gun
            self.guns.getChildren().forEach(function (physGun) {
            	if (physGun.owner == playerId)
            		physGun.destroy();
            });
        });

        this.socket.on('playerUpdates', function (players, guns) {
            Object.keys(players).forEach(function (id) {
                self.players.getChildren().forEach(function (player) {
                    // Check that we have the correct player from the ones we have and the sent ones
                    if (players[id].playerId === player.playerId) {                 
                        player.setRotation(players[id].rotation);
                        player.setPosition(players[id].x, players[id].y);
						
				
                        // Renderize gun 
                        Object.keys(guns).forEach(function (gunId) {
                        	if (guns[gunId].owner == id) {
                        		self.guns.getChildren().forEach(function (physGun) {
                        			if (physGun.gunId == gunId) {
                        				var gunRotation = players[id].rotation;
                        				var gunX = players[id].x + WEAPONS.DIST_TO_PLAYER*Math.cos(Math.PI/2+gunRotation);
                        				var gunY = players[id].y + WEAPONS.DIST_TO_PLAYER*Math.sin(Math.PI/2+gunRotation);
                        				physGun.setRotation(gunRotation);
                        				physGun.setPosition(gunX, gunY);
                        			}
                        		});                        		
                        	}                        
                        });							                       

                        // ! Shield Updates
                        if (players[id].hasShield) {
                            updateShield(self, players[id].shield);
                            self.shieldText.setVisible(true);
                            self.shields.forEach((shield) => {
                                if (shield.playerData === id) {
                                    shield.setPosition(players[id].x, players[id].y);
                                }
                            });
                        } else if (!players[id].hasShield) {
                            self.shields.forEach((shield) => {
                                if (shield.playerData === id) {
                                    shield.setPosition(-500, -500);
                                    self.shieldText.setVisible(false);
                                }
                            });
                        }

                        // If it is me
                        if (player.playerId === self.socket.id) {
                            // TODO: INcoming Changes
                            var shipX = players[id].x;
							var shipY = players[id].y;
							shipRotation = players[id].rotation;					
                                           
                            updateFuel(self, players[id].fuel);
                            updateHP(self, players[id].hp);

                            // Make camera follow the player
                            // TODO: Verify if need to be called everytime
                            // TODO: maybe change when at map borders
                            self.cameras.main.startFollow(players[id]);
                            
                            renderizeSlots(self, players[player.playerId]);
                        }
                    }
                });
            });
        });

        //Asteroids
        this.socket.on('asteroidsCreate', function (asteroids) {
            asteroids.forEach(function (asteroid) {
                console.log('asteroid' + asteroid.numero);
                var physAsteroid = self.add.image(asteroid.x, asteroid.y, 'asteroid'+asteroid.numero).setScale(asteroid.scaleX, asteroid.scaleY);
                physAsteroid.setAngle(asteroid.rotacao);
                physAsteroid.id = asteroid.id;
                self.asteroids.add(physAsteroid);
            });
        });
        
        
        // Weapons
        this.socket.on('weaponsCreate', function (weapons) {
            Object.keys(weapons).forEach(function (id) {
            	if (weapons[id].active == true) {
		            var physWeapon;
		            
		            switch (weapons[id].type) {
		            	case 1:
		            		physWeapon = self.add.image(weapons[id].x, weapons[id].y, ASSETS.SPRITE.GUN_1);
		            		break;
		            	case 2:
		            		physWeapon = self.add.image(weapons[id].x, weapons[id].y, ASSETS.SPRITE.GUN_2);
		            		break;
		            	case 3:
		            		physWeapon = self.add.image(weapons[id].x, weapons[id].y, ASSETS.SPRITE.GUN_3);
		            		break;
		            	case 4:
		            		physWeapon = self.add.image(weapons[id].x, weapons[id].y, ASSETS.SPRITE.GUN_4);
		            		break;
		            }
		            
		            physWeapon.setTint(randomHexColor());
                    physWeapon.weaponId = id;
                    physWeapon.weaponType = weapons[id].type;
                    self.weapons.add(physWeapon);
                    
                    var blueParticles = self.add.particles(ASSETS.SPRITE.PART_BLUE)
                    
                    // random hex color
                    var color = randomHexColor();
                    
                    physWeapon.emitter = blueParticles.createEmitter({
                        x: weapons[id].x,
                        y: weapons[id].y,
                        blendMode: 'SCREEN',
                        scale: { start: 0.2, end: 0 },
                        speed: { min: -40, max: 40 },
                        quantity: 20, 
                        tint: color,
                        scaleX: 0.8,
            			scaleY: 0.8,
                    });
                
                    var emitZones = [];
                
                    emitZones.push({
                        source: new Phaser.Geom.Circle(0, 0, 10),
                        type: 'edge',
                        quantity: 20
                    });
                    emitZones.push({
                        source: new Phaser.Geom.Ellipse(0, 0, 40, 10),
                        type: 'edge',
                        quantity: 20
                    });
                    emitZones.push({
                        source: new Phaser.Geom.Rectangle(-15, -15, 30, 30),
                        type: 'edge',
                        quantity: 20
                    });
                    emitZones.push({
                        source: new Phaser.Geom.Line(-15, -15, 15, 15),
                        type: 'edge',
                        quantity: 20
                    });
                    emitZones.push({
                        source: new Phaser.Geom.Triangle(0, -20, 20, 20, -20, 20),
                        type: 'edge',
                        quantity: 20
                    });
                
                    var emitZoneIndex = 0;
                    
                    physWeapon.setDepth(1);
                    physWeapon.emitter.setEmitZone(emitZones[emitZoneIndex]);
		    	}
            });
        });
        
        this.socket.on('playerGotWeapon', function (weaponId) {
        	self.weapons.getChildren().forEach(function (weapon) {
                if (weaponId == weapon.weaponId) {
                    weapon.emitter.explode();
                	weapon.destroy();
                }
            });       	       
        });
        
        // Gun create
        this.socket.on('gunCreate', function (gun, players) {
            // first destroy previous gun
            self.guns.getChildren().forEach(function (physGun) {
            	if (physGun.owner == gun.owner) {
            		physGun.destroy();
            	}            
            });
            
            // create new gun
            var gunRotation = players[gun.owner].rotation;
			var gunX = players[gun.owner].x + WEAPONS.DIST_TO_PLAYER*Math.cos(gunRotation);
			var gunY = players[gun.owner].y + WEAPONS.DIST_TO_PLAYER*Math.sin(gunRotation);
			
			switch (gun.gunType) {
				case 0:
				case '0':
					// nothin to be done
					break;
				case 1:
				case '1':
					var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_1).setScale(0.8);
					break;
				case 2:
				case '2':
					var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_2).setScale(0.8);
					break;
				case 3:
				case '3':
					var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_3).setScale(0.8);
					break;
				case 4:
				case '4':
					var physGun = self.add.image(gunX, gunY, ASSETS.SPRITE.GUN_4).setScale(0.8);
					break;			
			}		
            physGun.gunId = gun.id;
            physGun.owner = gun.owner;
            physGun.setTint(0x4d4d4d);
            self.guns.add(physGun);           
            
        });

        this.socket.on('asteroidsUpdates', function (asteroids) {
            if (typeof self.asteroids === undefined) {
                console.log("No Asteroid Data");
            } else if (typeof asteroids != undefined) {
                // console.log(asteroids);
                asteroids.forEach(function (asteroid) {
                    var found = false;
                    if (typeof asteroid != undefined) {
                        self.asteroids.getChildren().forEach(function (physAsteroid) {
                            if (asteroid.id == physAsteroid.id) {
                                physAsteroid.setPosition(asteroid.x, asteroid.y);
                                found = true;
                            }
                        });
                        // create new asteroids
                        if (found == false) {
                            var asteroidSon = self.add.image(asteroid.x, asteroid.y, 'asteroid' + asteroid.numero).setScale(asteroid.scaleX, asteroid.scaleY);
                            asteroidSon.angle = asteroid.rotacao;
                            asteroidSon.id = asteroid.id;
                            self.asteroids.add(asteroidSon);
                        }
                    } else {
                        console.log("Late Callback");
                    }
                });
            }
        });

        this.socket.on('deleteAsteroid', function (asteroidId) {
            self.asteroids.getChildren().forEach(function (asteroid) {
                if (asteroidId === asteroid.id) {
                    //self.cameras.main.backgroundColor.setTo(0,0,0);
                    asteroid.destroy();
                }
            });
        });

        this.socket.on('updateScore', function (scores) {
            self.blueScoreText.setText('AETHER: ' + scores.blue);
            self.redScoreText.setText('SIRIUS: ' + scores.red);
        });
        
        this.socket.on('updateSelfScore', function (score) {
            self.selfScoreText.setText('Score: ' + score);
        });

        // ! PowerUp location changing
        this.socket.on('hpLocation', function (hpLocation) {
            if (!self.hppowerup) {
                self.hppowerup = self.add.image(hpLocation.x, hpLocation.y, ASSETS.SPRITE.POWERUP_HP).setScale(0.3);
            } else {
                self.hppowerup.setPosition(hpLocation.x, hpLocation.y);
            }
        });

        this.socket.on('starLocation', function (starLocation) {
            if (!self.star) {
                self.star = self.add.image(starLocation.x, starLocation.y, ASSETS.SPRITE.POWERUP_STAR);
            } else {
                self.star.setPosition(starLocation.x, starLocation.y);
            }
        });

        this.socket.on('shieldLocation', function (shieldLocation) {
            if (!self.shieldpowerup) {
                self.shieldpowerup = self.add.image(shieldLocation.x, shieldLocation.y, ASSETS.SPRITE.POWERUP_SHIELD);
            } else {
                self.shieldpowerup.setPosition(shieldLocation.x, shieldLocation.y);
            }
        });
        
        this.socket.on('updateShield', function (shield) {
            updateShield(self, shield);
        });

        this.socket.on('updateFuel', function (fuel) {
            updateFuel(self, fuel);
        });

        this.socket.on('updateHP', function (hp) {
            updateHP(self, hp);
        });

        this.socket.on('refuelingNudge', function () {
            // Change the color of the fuel label to red
            self.fuelText.setFill("#FF0000");
            // Set an asyncronous timeout that fires the function after the given miliseconds
            setTimeout(function () {
                // revert to the original color
                if (typeof self.fuelText !== undefined) {
                    self.fuelText.setFill("#FFFFFF");
                }
            }, 50);
        });

        this.socket.on('collisionFlash', function () {
            // Change the color of the hp label to red
            self.hpText.setFill("#FF0000");
            self.sound.play(ASSETS.AUDIO.SFX_COLLISION);
            // Set an asyncronous timeout that fires the function after the given miliseconds
            setTimeout(function () {
                // revert to the original color
                if (typeof self.hpText !== undefined) {
                    self.hpText.setFill("#FFFFFF");
                }
            }, 50);
        });

        this.socket.on('gotPowerUp', function (pwrUp) {
            // self.sound.play(pwrUp);// !Remove
            console.log("Sound " + pwrUp);
        });

        this.socket.on('updateHPAst', function (asteroidId, colorRatio) {
            updateHPAst(self, asteroidId, colorRatio);
        });


        // TODO: Remove game over(?)
        this.socket.on('gameOver', () => {
            // self.scene.stop('play');
            // Local Scene Restart
            // showRestart(self);
            self.sound.play(ASSETS.AUDIO.SFX_DEATH_1);
            self.scene.start(SCENES.GAMEOVER);
   
            this.socket.close();
            // A cena de play na próxima vez vai conservar os objetos antigos
            //self.alive = false;
            // TODO: arrumar isso
            // self.scene.remove('play');
        });
       
        // Laser Events
        this.socket.on('removeBullet', function (bulletId) {
            self.bullets.getChildren().forEach(function (bullet) {
                if (bulletId === bullet.id) {
                    //self.cameras.main.backgroundColor.setTo(0,0,0);
                    bullet.destroy();
                }
            });
        });
        
        

        // Listen for bullet update events
        this.socket.on('bulletCreate', function (bullet) {
            console.log(bullet.shooterWeapon);
            if (bullet.shooterWeapon != 'enemieWeapon') {
                switch (bullet.shooterWeapon) {
                    case 0:
                    case '0':
                        var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_0).setScale(0.2);
                        physBullet.setTint(WEAPONS.COLORS[physBullet.id-1]);
                        break;
                    case 1:
                    case '1':
                        var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_1).setScale(0.5);
                        physBullet.setTint(WEAPONS.COLORS[physBullet.id-1]);
                        break;
                    case 2:
                    case '2':
                        var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_2).setScale(0.6);
                        physBullet.setTint(WEAPONS.COLORS[physBullet.id-1]);
                        break;
                    case 3:
                    case '3':
                        var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_3).setScale(0.7);
                        physBullet.setTint(WEAPONS.COLORS[physBullet.id-1]);
                        break;
                    case 4:
                    case '4':
                        var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_4).setScale(0.3);
                        physBullet.setTint(WEAPONS.COLORS[physBullet.id-1]);
                        break; 
                    default:
                        console.log('Error on creating bullet');
                }
            } else {
                var physBullet = self.add.image(bullet.x, bullet.y, ASSETS.SPRITE.PJ_LASER_0).setScale(0.2);            
            }
            physBullet.id = bullet.id;
            physBullet.setAngle(bullet.rotation);
            console.log('*********** '+WEAPONS.COLORS[physBullet.id-1]);            
            self.bullets.add(physBullet);
        });

        // Listen for bullet update events
        this.socket.on('bulletsUpdate', function (bullets) {
            updateBullets(self, bullets);
        });
        
        // Turn off slot visualization on dropping weapon
        this.socket.on('turnOffSlot', function (slot) {
            switch (slot) {
            	case 1:
            		slot1.alpha = 0;
            		break;
            	case 2:
            		slot2.alpha = 0;
            		break;
            	case 3: 
            		slot3.alpha = 0;
            		break;            
            }
            slotFrame.setPosition(300, 45);
            slotFrame.alpha = 1;
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.slot1Key = this.input.keyboard.addKey('Z');
        this.slot2Key = this.input.keyboard.addKey('X');
        this.slot3Key = this.input.keyboard.addKey('C');
        this.dropKey = this.input.keyboard.addKey('D');
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
        this.spaceKeyPressed = false;
        this.slot1KeyPressed = false;
        this.slot2KeyPressed = false;
        this.slot3KeyPressed = false;
        this.dropKeyPressed = false;
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        
        this.socket.on('playerLockState', function(state) {
            // self.scene.stop('play');
            // Local Scene Restart
            // showRestart(self);
            // self.sound.play(ASSETS.AUDIO.SFX_DEATH_1);

            // Adicao de efeitos de estado de lock
            self.cameras.main.shake(200);  
            

            // Adicao de efeitos de estado de lock
            self.cameras.main.shake(200);  
            // self.cameras.main.setAlpha(0.5);
            // self.cameras.main.flash(100);
            self.cameras.main.setRenderToTexture(self.grayscalePipeline);

			   
            
            // Funcionalidade de retry apos death state
            
            self.restartButton.setVisible(true);
            self.restartButton.setInteractive()
									.on('pointerover', () => self.restartButtonHoverState())
									.on('pointerdown', () => self.restartButtonPress())
									.on('pointerout', () => self.restartButtonRestState());
																					
                       
            // this.socket.close();
            // A cena de play na próxima vez vai conservar os objetos antigos
            //self.alive = false;
            // TODO: arrumar isso
            // self.scene.remove('play');
        });
        
        // ----- Funcionalidade de score do jogador --------
        //	this.socket.on('playerScored', function(score) {			
		//	self.currentPlayerScore.setText('Score: ' + score);
		//	});

    }
    
	restartButtonPress() {
		this.restartButton.setVisible(false);		
		this.socket.emit('playerStateUpdate');
        // this.cameras.main.setAlpha(1);
        this.cameras.main.clearRenderToTexture();
		
	}
    
    
	restartButtonHoverState() {
		this.restartButton.alpha = 1;
	}

	restartButtonRestState () {
		this.restartButton.alpha = 0.8;
	}
	
    update() {
        const left = this.leftKeyPressed;
        const right = this.rightKeyPressed;
        const up = this.upKeyPressed;
        const enter = this.restartKey;
        const space = this.spaceKeyPressed;
        const slot1 = this.slot1KeyPressed;
        const slot2 = this.slot2KeyPressed;
        const slot3 = this.slot3KeyPressed;
        const drop = this.dropKeyPressed;

        // TODO: Explain this
        if (this.cursors.space.isDown && !this.space && Math.random() > 0.7) {
            //var speed_x = Math.cos(shipRotation + Math.PI/2) * 20;
            //var speed_y = Math.sin(shipRotation + Math.PI/2) * 20;
            this.spaceKeyPressed = true;
            //this.socket.emit('shoot-bullet',{x:shipX ,y:shipY ,angle:shipRotation, speed_x:speed_x, speed_y:speed_y});
        } else {
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
        
        // Slots changing
        if (Phaser.Input.Keyboard.JustDown(this.slot1Key)) {
            this.slot1KeyPressed = true;
            slotFrame.setPosition(300, 45);
            slotFrame.alpha = 1;
        } else {
            this.slot1KeyPressed = false;
        }
        if (Phaser.Input.Keyboard.JustDown(this.slot2Key)) {
            this.slot2KeyPressed = true;
            slotFrame.setPosition(370, 45);
            slotFrame.alpha = 1;
        } else {
            this.slot2KeyPressed = false;
        }
        if (Phaser.Input.Keyboard.JustDown(this.slot3Key)) {
            this.slot3KeyPressed = true;
            slotFrame.setPosition(440, 45);
            slotFrame.alpha = 1;
        } else {
            this.slot3KeyPressed = false;
        }
        
        // Drop weapon
        if (Phaser.Input.Keyboard.JustDown(this.dropKey, 200)) {
            this.dropKeyPressed = true;
        } else {
            this.dropKeyPressed = false;
        }

        // Incoming Input
        if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || 
        	up !== this.upKeyPressed || space !== this.spaceKeyPressed ||
        	slot1 !== this.slot1KeyPressed || slot2 !== this.slot2KeyPressed ||
        	slot3 !== this.slot3KeyPressed || drop !== this.dropKeyPressed) {
            this.socket.emit('playerInput', {
                left: this.leftKeyPressed,
                right: this.rightKeyPressed,
                up: this.upKeyPressed,
                space: this.spaceKeyPressed,
                slot1: this.slot1KeyPressed,
                slot2: this.slot2KeyPressed,
                slot3: this.slot3KeyPressed,
                drop: this.dropKeyPressed
            });
        }      

        // Local Scene GameOver
        // TODO: Change to the scoreScene
        // if(!this.alive && enter.isDown){
        //     this.sound.play("teleport");
        //     this.scene.start('menu', {restarted: true});
        // }

        // Apart Scene GameOver
    }
}

// TODO: Review the var/function approach

var updateBullets = function (self, bullets) {
    bullets.forEach(function (bullet) {
        self.bullets.getChildren().forEach(function (physBullet) {
            if (bullet.id == physBullet.id) {
                physBullet.setPosition(bullet.x, bullet.y);
                if (bullet.shooterWeapon == 4) {
                    physBullet.setRotation(bullet.rotation);
                }
            }
        });
    });
};


var displayPlayers = function (self, playerInfo, sprite) {
    const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5).setScale(1);
    var shield = self.add.sprite(-500, -500, ASSETS.SPRITE.FX_SHIELD).setOrigin(0.5, 0.5).setDisplaySize(80, 60);
    
    if (playerInfo.team == 'enemies')
    	player.setScale(0.5);

    // Nunca usar .data para outra coisa que não seja no init
    shield.playerData = playerInfo.playerId;
    var base_tint;

	if (playerInfo.enemieMode != STRINGS.CHASE_ENEMIE) {
		switch (playerInfo.team) {
		    case STRINGS.BLUE_TEAM:
		        base_tint = 0x2de2e6;
		        break;
		    case STRINGS.RED_TEAM:
		        base_tint = 0xf6019d;
		        break;
		    default:
		        base_tint = 0x4d4d4d;
		}
	}

	if (playerInfo.team != STRINGS.BLUE_TEAM)
    	player.setTint(base_tint);
    shield.setTint(base_tint);

    player.playerId = playerInfo.playerId;
    self.shields.push(shield);
    self.players.add(player);
};

// ! UI UPDATES
var updateFuel = function (self, fuel) {
    self.fuelText.setText('Fuel: ' + Math.floor(fuel));
};

var updateHP = function (self, hp) {
    self.hpText.setText('HP: ' + Math.floor(hp));
};

var updateShield = function (self, shield) {
    self.shieldText.setText('Shield: ' + Math.floor(shield));
};

var updateHPAst = function (self, asteroidId, colorRatio) {
    self.asteroids.getChildren().forEach(function (asteroid) {
        if (asteroid.id === asteroidId) {
            var darkenAmount = (-1) * (100 - (Math.floor(colorRatio * 100)));
            if (darkenAmount == -100) {
                asteroid.setTint(0x7228b3);
            } else {
                var color = LightenDarkenColor('ffafaf', darkenAmount);
                asteroid.setTint('0x' + color);
            }
        }
    });
};

var renderizeSlots = function (self, playerInfo) {
	// slot 1
	if (playerInfo.slot1 != 'empty') {
		if (playerInfo.slot2 == 'empty') {
			slotFrame.setPosition(300, 45);
			slotFrame.alpha = 1;
		}
		
		var weaponActive = playerInfo.slot1;
		switch (weaponActive) {
			case 0:
			case '0':
				// nothing to do
				break;
			case 1:
			case '1':
				slot1.setTexture(ASSETS.SPRITE.GUN_1);
				slot1.alpha = 1;
				break;
			case 2:
			case '2':
				slot1.setTexture(ASSETS.SPRITE.GUN_2);
				slot1.alpha = 1;
				break;
			case 3:
			case '3':
				slot1.setTexture(ASSETS.SPRITE.GUN_3);
				slot1.alpha = 1;
				break;
			case 4:
			case '4':
				slot1.setTexture(ASSETS.SPRITE.GUN_4);
				slot1.alpha = 1;
				break;		
		}
	}
	// slot 2
	if (playerInfo.slot2 != 'empty') {
		
		var weaponActive = playerInfo.slot2;
		switch (weaponActive) {
			case 0:
			case '0':
				// nothing to do
				break;
			case 1:
			case '1':
				slot2.setTexture(ASSETS.SPRITE.GUN_1);
				slot2.alpha = 1;
				break;
			case 2:
			case '2':
				slot2.setTexture(ASSETS.SPRITE.GUN_2);
				slot2.alpha = 1;
				break;
			case 3:
			case '3':
				slot2.setTexture(ASSETS.SPRITE.GUN_3);
				slot2.alpha = 1;
				break;
			case 4:
			case '4':
				slot2.setTexture(ASSETS.SPRITE.GUN_4);
				slot2.alpha = 1;
				break;		
		}		
	}
	// slot 3
	if (playerInfo.slot3 != 'empty') {
		
		var weaponActive = playerInfo.slot3;
		switch (weaponActive) {
			case 0:
			case '0':
				// nothing to do
				break;
			case 1:
			case '1':
				slot3.setTexture(ASSETS.SPRITE.GUN_1);
				slot3.alpha = 1;
				break;
			case 2:
			case '2':
				slot3.setTexture(ASSETS.SPRITE.GUN_2);
				slot3.alpha = 1;
				break;
			case 3:
			case '3':
				slot3.setTexture(ASSETS.SPRITE.GUN_3);
				slot3.alpha = 1;
				break;
			case 4:
			case '4':
				slot3.setTexture(ASSETS.SPRITE.GUN_4);
				slot3.alpha = 1;
				break;		
		}
	}
};

var LightenDarkenColor = function (col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

var randomHexColor = function() {
        return (Math.random() * 0xFFFFFF << 0);
};

/* function configureDebug(context) {
    // Add debug background
    context.add.image(0, 0, ASSETS.SPRITE.BG_DEBUG).setOrigin(0).setAlpha(0.2);
    context.sound.play(ASSETS.AUDIO.SFX_TELEPORT);
}
*/	
var GrayscalePipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function GrayscalePipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(vec3(gray), 1.0);
                }`
        });
    } 
});