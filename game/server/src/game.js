// This is the old auth_server/game.js

// General variables
// These hold more information that is not stored (yet) on the physics objects
// TODO: FIX THIS
const players = {};
const asteroids = {};
const weapons = {};
const guns = {};
const sockets = [];

// Map additions
const MAP_SIZE_X = 8000;
const MAP_SIZE_Y = 6000;

// Game constants
const WHEIGHT = 700;
const WWIDTH = 500;

// Player constants
const MAXFUEL = 200;
const FUELCOST = 0.1;
const FUELGAIN = 0.25;
const ASTEROID_DESTRUCTION_SCORE = 2;
const HUNTER_DESTRUCTION_SCORE = 10;
const PLAYER_DESTRUCTION_SCORE = 20;
const ENEMIE_DESTRUCTION_SCORE = 5;

const FUELPOWERUP = 0.5 * MAXFUEL;

const MAXHP = 60;
const HPDAMAGECOLLISION = 2;
const HPPOWERUP = 30;
const DEATHTHRESHOLD = 0;

const MAXSPEED = 200;

// Asteriods constants
const ASTEROIDNUM = 100;
const MAXHP_AST = 60;
const HPDAMAGECOLLISION_AST = 2;
const MIN_SIZE_AST = 0.38;

// Enemies constants
const N_ENEMIES = 20;
const CHASE_ENEMIE_PROPORTION = 0.38;

// Bullets Const
const SHOT_SPEED = 2000;
const SHOT_MISSILE_SPEED = 300;
const BULLET_LIMIT = 1000;

// Shield Const
const MAXSHIELD = 100;
const SHIELD_DMG = 10;

// Weapons constants
const WEAPONS_TYPE = 4;
const N_WEAPONS = 20;
const DAMAGE_RATIOS = [1, 2, 4, 6, 10];

var IGNORE_NEW_BOTS = false;

const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    width: MAP_SIZE_X,
    height: MAP_SIZE_Y,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoFocus: false
};

function preload() {
    // Image loading
    this.load.image('ship0', 'assets/ship0.png');
    this.load.image('ship1', 'assets/ship1.png');
    this.load.image('ship2', 'assets/ship2.png');
    this.load.image('ship3', 'assets/ship3.png');
    this.load.image('ship4', 'assets/ship4.png');
    this.load.image('ship5', 'assets/ship5.png');
    this.load.image('ship6', 'assets/ship6.png');
    this.load.image('ship7', 'assets/ship7.png');
    this.load.image('shieldpowerup', 'assets/powerupGreen_shield.png');
    this.load.image('enemieHunter', 'assets/enemieHunter.png');
    this.load.image('ship', 'assets/spaceShips_001.png');
    this.load.image('hp', 'assets/heart.png');
    this.load.image('asteroid1', 'assets/asteroid1.png');
    this.load.image('asteroid2', 'assets/asteroid2.png');
    this.load.image('asteroid3', 'assets/asteroid3.png');
    this.load.image('asteroid4', 'assets/asteroid4.png');
    this.load.image('asteroid5', 'assets/asteroid5.png');
    this.load.image('asteroid6', 'assets/asteroid6.png');
    this.load.image('asteroid7', 'assets/asteroid7.png');
    this.load.image('asteroid8', 'assets/asteroid8.png');
    this.load.image('asteroid9', 'assets/asteroid9.png');
    this.load.image('speed', 'assets/speed.png');
    this.load.image('star', 'assets/star_gold.png');
    this.load.image('debug_bg', 'assets/debug_bg.png');
    this.load.image('weapon1', 'assets/weapon1.png');
    this.load.image('weapon2', 'assets/weapon2.png');
    this.load.image('weapon3', 'assets/weapon3.png');
    this.load.image('weapon4', 'assets/weapon4.png');
    this.load.image('bullet_0', 'assets/laser.png');
	this.load.image('bullet_1', 'assets/laserGreen13.png');
	this.load.image('bullet_2', 'assets/laserGreen05.png');
	this.load.image('bullet_3', 'assets/laserGreen04.png');
	this.load.image('bullet_4', 'assets/laserGreen10.png');
	
	
    // Audio loading
    this.load.audio('collision', 'audio/collision1.ogg');
    this.load.audio('death', 'audio/death1.ogg');
    this.load.audio('powerup', 'audio/powerup1.ogg');
    this.load.audio('shot', 'audio/shot1.ogg');
    this.load.audio('teleport', 'audio/teleport1.ogg');
}

function create() {
    // reference to phaser scene
    // note that in nodejs 'this' has different meanings on different places :(
    const self = this;
    var context = this;
    this.players = this.physics.add.group();
    this.asteroids = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.weapons = this.physics.add.group();
    this.scores = {
        blue: 0,
        red: 0,
    };

    // ! PowerUps
      this.hppowerup = this.physics.add.image(randomPosition(MAP_SIZE_X*3), randomPosition(MAP_SIZE_Y*3), 'hp').setScale(0.3);
      this.star = this.physics.add.image(randomPosition(MAP_SIZE_X*3), randomPosition(MAP_SIZE_Y*3), 'star');
      this.shieldpowerup = this.physics.add.image(randomPosition(MAP_SIZE_X*3), randomPosition(MAP_SIZE_Y*3), 'shieldpowerup').setScale(1.1);
    
    // Create weapons 
    for (var k=0; k<N_WEAPONS; k++) {
        for (var i=1; i<=WEAPONS_TYPE; i++) {
            var weaponType = i;
            createWeapon(self, weaponType);
        }
    }
    
    // Allows players to collide with eachother, with no damage taken
    this.physics.add.collider(this.players);

    // When a player overlaps with a HP powerup object he gains a HP boost
    this.physics.add.overlap(this.players, this.hppowerup, function (hp, player) {
        updateHP(self, player);
    });

    // When a player overlaps with a star object he gains score points
    this.physics.add.overlap(this.players, this.star, function (star, player) {
        pickStar(self, player);
    });

    this.physics.add.overlap(this.players, this.shieldpowerup, function (shield, player) {
        updateShield(self, player);
    });
    
    // A player gets a weapon by overlapping it
    this.physics.add.overlap(this.players, this.weapons, function (player, weapon) {
        getWeapon(self, weapon, player);
    });

    // ! Asteroids

    // Creates asteroids
    for (var i = 0; i < ASTEROIDNUM; i++) {
        var asteroidSize = getRandomArbitrary(0.1,0.2);
        var k = Math.floor(Math.random()*9 + 1);
        var astId = 'asteroid' + k;
        var angulo = getRandomArbitrary(0,180);
        // TODO: Change 'astoroid' plain string
        var asteroid = this.physics.add.image(randomPosition(MAP_SIZE_X), randomPosition(MAP_SIZE_Y), astId);
        asteroid.setScale(asteroidSize).setBounce(1);
        asteroid.setAngle(angulo);
        asteroid.id = i;
        this.asteroids.add(asteroid);
        asteroids[asteroid.id] = {
            id: i,
            hp: MAXHP_AST,
            size: asteroidSize,
            collidedRecently: false,
            formato: astId,
            numero: k,
            rotacao: angulo,
        };
    }

    // After creation, lets set all the properties
    this.asteroids.getChildren().forEach(function (asteroid) {
        asteroid.body.setVelocity(randomSign() * (Math.random() * 300 + 50), randomSign() * (Math.random() * 300 + 50));
        asteroid.setDrag(0);
    });

    // Allows asteroids to collide with eachother
    this.physics.add.collider(this.asteroids, this.asteroids);

    // When the player collides with an asteroid he loses HPDAMAGECOLLISION to his HP
    this.physics.add.collider(this.players, this.asteroids, function (player, asteroid) {
        if (players[player.playerId].team != 'enemies') {
            // TODO: Review flag parameter
            collisionDamage(self, player, flag = 'ship');
            collisionDamageAsteroid(self, asteroid, flag = 'ship');
        }
    });

	// Make players to be shot by other players
    this.physics.add.overlap(this.players, this.bullets, (player, bullet) => {
    	if (players[player.playerId] == 'enemie') return;
		// bullet cannot hit the shooter
		if (player.playerId != bullet.owner) {
		    collisionDamage(self, player, flag = 'bullet', bullet.damageRatio, bullet.owner);
		    io.emit('removeBullet', bullet.id);
		    bullet.destroy();
		}
    });

    this.physics.add.overlap(this.asteroids, this.bullets, (asteroid, bullet) => {
        collisionDamageAsteroid(self, asteroid, flag = 'bullet', bullet.owner);
        io.emit('removeBullet', bullet.id);
        //bullet.destroy();
    });

    // ! Parse Connection
    io.on('connection', function (socket) {
        console.log('a user connected');
        console.log(socket.handshake.query.team);


        if (socket.handshake.query.bots != "OFF" && !IGNORE_NEW_BOTS) {
            console.log("ADDING BOTS BROOS");
            IGNORE_NEW_BOTS = true;
            for (let i = 0; i < N_ENEMIES; i++) {
                enemieId = 'enemie' + i;
                players[enemieId] = {
                    rotation: 0,
                    x: Math.floor(Math.random() * MAP_SIZE_X) + 50,
                    y: Math.floor(Math.random() * MAP_SIZE_Y) + 50,
                    playerId: 'enemie' + i,
                    team: 'enemies',
                    input: {
                        left: false,
                        right: false,
                        up: false
                    },
                    fuel: MAXFUEL,
                    refueling: false,
                    hp: MAXHP,
                    collidedRecently: false,
                    enemieAction: 'nothing',
                    actionIterations: -1,
                    enemieMode: chooseEnemieMode(),
                    modeIterations: -1,
                    preyId: '',
                    hasShield: false,
                    shield: 0
                };
                addPlayer(self, players[enemieId]);
            }
        }

        // create a new player and add it to our players object
        players[socket.id] = {
            rotation: 0,
            x: Math.floor(Math.random() * MAP_SIZE_X) + 50,
            y: Math.floor(Math.random() * MAP_SIZE_Y) + 50,
            playerId: socket.id,
            team: socket.handshake.query.team.toString(),
            input: {
                left: false,
                right: false,
                up: false, 
                space: false, 
                slot1: false,
                slot2: false, 
                slot3: false, 
                drop: false
            },
            fuel: MAXFUEL,
            refueling: false,
            deathState: false,
            playerScore: 0,
            hp: MAXHP,
            collidedRecently: false,
            shipSkinIndex: socket.handshake.query.skinIndex,
            hasShield: false,
			shield: 0,
            slot1: 'empty',
            slot2: 'empty',
            slot3: 'empty', 
            activeSlot: 0
        };

        // save the socket for later
        sockets[socket.id] = socket;

        // add player to server
        addPlayer(self, players[socket.id]);
        // send the players object to the new player
        socket.emit('currentPlayers', players, guns);
        // update all other players of the new player
        socket.broadcast.emit('newPlayer', players[socket.id]);
        // send the star object to the new player
        socket.emit('starLocation', {
            x: self.star.x,
            y: self.star.y
        });
        // send the star object to the new player
        socket.emit('hpLocation', {
            x: self.hppowerup.x,
            y: self.hppowerup.y
        });
        // send the shield power up object to the new player
        socket.emit('shieldLocation', {
            x: self.shieldpowerup.x,
            y: self.shieldpowerup.y
        });
        // send the current scores
        socket.emit('updateScore', self.scores);
        
        // send the current player score ----- Funcionalidade de score do jogador -----
        // socket.emit('playerScored', players[socket.id].playerScore);
        // send the asteroids to the new players
        
        socket.emit('asteroidsCreate', asteroidsData(self.asteroids, asteroids));
        
        // send the weapons to the new players
        socket.emit('weaponsCreate', weapons);

        socket.on('disconnect', function () {
            console.log('user disconnected');
            // remove player from server
            removePlayer(self, socket.id);
            // remove this player from our players object
            delete players[socket.id];
            // delete sockets[socket.id];
            // emit a message to all players to remove this player
            io.emit('disconnect', socket.id);
        });

        // when a player moves, update the player data
        socket.on('playerInput', function (inputData) {
            handlePlayerInput(self, socket.id, inputData);
        });
        
        // when a player issues a restart, update the player state
        socket.on('playerStateUpdate', function () {          
            players[socket.id].deathState = false;
            
            // Reset player stats
            
            players[socket.id].hp = MAXHP;
            players[socket.id].fuel = MAXFUEL;
            
            // Reset player position
            
                      
        });
    });
}

function update() {
    this.players.getChildren().forEach((physPlayer) => {
        self = this;
        // remember that in javascript the variable holds a reference to the element on the array
        var player = players[physPlayer.playerId];
        const input = player.input;
        
        if ((player.team != 'enemies') && !player.deathState) {
            if (input.left) {
                physPlayer.setAngularVelocity(-300);
            } else if (input.right) {
                physPlayer.setAngularVelocity(300);
            } else {
                physPlayer.setAngularVelocity(0);
            }

            // Only move front if
            // we are pressing up, and
            // we are not refueling
            // TODO: Remove Magic Numbers
            // TODO: this.physics.velocityFromRotation(physPlayer.rotation + 1.5, 500, physPlayer.body.acceleration);
            if (input.up && !player.refueling) {
                this.physics.velocityFromRotation(physPlayer.rotation + 1.5, 200, physPlayer.body.acceleration);
                // if we are moving up, remove one point of fuel
                player.fuel -= FUELCOST;
                if (player.fuel <= 0) {
                    player.refueling = true;
                    player.fuel = 0;
                }
            } else {
                // Consider the player to be refueling if its fuel is below 25%
                // That way, we stop it from moving if it is on this state
                if (player.fuel > 0.25 * MAXFUEL)
                    player.refueling = false;
                else
                    player.refueling = true;

                physPlayer.setAcceleration(0);
                // if we stoped, start gaining fuel, up to MAXFUEL
                player.fuel = Math.min(MAXFUEL, player.fuel + FUELGAIN);

                // if we have no fuel, but the player is trying to move, nudge him with color
                if (player.refueling && input.up)
                    sockets[player.playerId].emit('refuelingNudge');
            }

            // TODO: Review formulas and magic numbers
            if (input.space) {
            	
            	var activeSlot = players[physPlayer.playerId].activeSlot;
                switch (activeSlot) {
                	case 0:
                		var shooterWeapon = 0;
                		break;
                	case 1:
                		var shooterWeapon = players[physPlayer.playerId].slot1;
                		break;
                	case 2:
                		var shooterWeapon = players[physPlayer.playerId].slot2;
                		break;
                	case 3:
                		var shooterWeapon = players[physPlayer.playerId].slot3;
                		break;
                	default:
                		// nothing to be done
                }
                           
                var x = physPlayer.x;
                var y = physPlayer.y;
                                           
                var angle = physPlayer.rotation;
                var speed_x = Math.cos(angle + Math.PI / 2) * SHOT_SPEED;
                var speed_y = Math.sin(angle + Math.PI / 2) * SHOT_SPEED;
                var bulletName = 'bullet_'+players[physPlayer.playerId].activeSlot;

                var bullet = this.physics.add.image(x, y, bulletName).setScale(0.5);
                this.bullets.add(bullet);
                bullet.id = generateKey();
                bullet.originX = physPlayer.x;
                bullet.originY = physPlayer.y;
                bullet.owner = physPlayer.playerId;  
                
                           
                if (shooterWeapon == 4) {
                    /*
                	var speedMissile_x = Math.cos(angle + Math.PI / 2) * SHOT_MISSILE_SPEED;
                	var speedMissile_y = Math.sin(angle + Math.PI / 2) * SHOT_MISSILE_SPEED;
                	bullet.body.setVelocity(speedMissile_x, speedMissile_y);
                    */
                    bullet.prey = closerOpponent (this, physPlayer.playerId);
                    var angle = this.physics.accelerateToObject(bullet, bullet.prey, SHOT_MISSILE_SPEED);
					bullet.setRotation(angle + 3*Math.PI/2);
					
                	bullet.setScale(0.5);
                } else 
                    bullet.body.setVelocity(speed_x, speed_y);
                
                bullet.damageRatio = DAMAGE_RATIOS[shooterWeapon];
                
                io.emit('bulletCreate', {
                    x: physPlayer.x,
                    y: physPlayer.y,
                    rotation: physPlayer.body.rotation,
                    id: bullet.id, 
                    damageRatio: DAMAGE_RATIOS[shooterWeapon],
                    shooterWeapon: shooterWeapon
                });
            }
            
            if ((input.slot1) && (players[physPlayer.playerId].slot1 != 'empty')) {
            	console.log('Changing to slot 1');
            	players[physPlayer.playerId].activeSlot = 1;
            	updatePlayerGun(physPlayer.playerId);
            }
			if ((input.slot2) && (players[physPlayer.playerId].slot2 != 'empty')) {
				console.log('Changing to slot 2');
				players[physPlayer.playerId].activeSlot = 2;
				updatePlayerGun(physPlayer.playerId);
            }
			if ((input.slot3) && (players[physPlayer.playerId].slot3 != 'empty')) {
				console.log('Changing to slot 3');
				players[physPlayer.playerId].activeSlot = 3;
				updatePlayerGun(physPlayer.playerId);
            }
            if (input.drop) {
            	switch (players[physPlayer.playerId].activeSlot) {
            		case 1:
            		case '1':
            			if (players[physPlayer.playerId].slot2 == 'empty')
            				break;
            			players[physPlayer.playerId].slot1 = players[physPlayer.playerId].slot2,
            			players[physPlayer.playerId].slot2 = players[physPlayer.playerId].slot3,
            			players[physPlayer.playerId].slot3 = 'empty'; 
            			sockets[physPlayer.playerId].emit('turnOffSlot', slot=3);
            			
            			if (players[physPlayer.playerId].slot2 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=2);
            			if (players[physPlayer.playerId].slot1 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=1);
            			players[physPlayer.playerId].activeSlot = 1;
            			updatePlayerGun(physPlayer.playerId);
            			break;
            		case 2:
            		case '2':
            			players[physPlayer.playerId].slot2 = players[physPlayer.playerId].slot3,
            			players[physPlayer.playerId].slot3 = 'empty'; 
            			sockets[physPlayer.playerId].emit('turnOffSlot', slot=3);
            			
            			if (players[physPlayer.playerId].slot2 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=2);
            			if (players[physPlayer.playerId].slot1 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=1);
            			players[physPlayer.playerId].activeSlot = 1;
            			updatePlayerGun(physPlayer.playerId);
            			break;
            		case 3:
            		case '3':
            			players[physPlayer.playerId].slot3 = 'empty'; 
            			sockets[physPlayer.playerId].emit('turnOffSlot', slot=3);
            			
            			if (players[physPlayer.playerId].slot2 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=2);
            			if (players[physPlayer.playerId].slot1 == 'empty')
            				sockets[physPlayer.playerId].emit('turnOffSlot', slot=1);
            			players[physPlayer.playerId].activeSlot = 1;
            			updatePlayerGun(physPlayer.playerId);
            			break;           	
            	}
				console.log('Dropping weapon');
            }

        // Bots only
        } else {
            context = this;
            updateBehavior(context, physPlayer, player);
        }

        // Update global object with local from function
        player.x = physPlayer.x;
        player.y = physPlayer.y;
        player.rotation = physPlayer.rotation;
        player.enemieAction = physPlayer.enemieAction;
        player.actionIterations = physPlayer.actionIterations;
       
    });
    
    // update team scores
    var redScore = 0;
    var blueScore = 0;
    Object.keys(players).forEach(function (id) {
    	if (players[id].team == 'SIRIUS Team') {
    		redScore += players[id].playerScore;
    	} else if (players[id].team == 'AETHER Team') {
    		blueScore += players[id].playerScore;
    	}
    });
    this.scores.red = redScore;
    this.scores.blue = blueScore;
    io.emit('updateScore', this.scores);    

    missileUpdate(this, this.bullets);

    // Update bullets
    removeLostBullets(this.bullets);

    this.physics.world.wrap(this.players, 5);
    this.physics.world.wrap(this.asteroids, 5);
    io.emit('playerUpdates', players, guns);
    io.emit('asteroidsUpdates', asteroidsData(this.asteroids, asteroids));
    io.emit('bulletsUpdate', bulletsData(this.bullets));
}


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Function generate a random string with length passed by parameter 
function generateKey(length = 5) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function randomPosition(max) {
    return Math.floor(Math.random() * max) + 50;
}

function randomSign() {
    return Math.pow(-1, Math.round(Math.random()));
}

function handlePlayerInput(self, playerId, input) {
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {
            players[player.playerId].input = input;
        }
    });
}

function addPlayer(self, playerInfo) {
    let shipName = 'ship0';
    if (playerInfo.shipSkinIndex !== undefined)
        shipName = 'ship' + playerInfo.shipSkinIndex;

    const player = self.physics.add.image(playerInfo.x, playerInfo.y, shipName).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setMaxVelocity(MAXSPEED);
    // We need to copy the extra info from our player into the phaser's player object
    // We have duplicate information here, the players object holds some infor, and the players physical objetcs also hold similar information.
    // Factoring this information out will help a lot
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}

function removePlayer(self, playerId) {
    self.players.getChildren().forEach((player) => {
        if (playerId === player.playerId) {

            // delete our global references to the player
            if (players[playerId].team != 'enemies')     
                delete sockets[player.playerId];
            delete players[player.playerId];
            // also the reference in the phase engine
            player.destroy();
        }
    }); 
}

// The collider is a function of the player and the star, but we don't need the star for our purposes
function updateHP(self, player) {
    if ((players[player.playerId].team != 'enemies') && !players[player.playerId].deathState) {
        if ((players[player.playerId].hp + HPPOWERUP) < MAXHP) {
            players[player.playerId].hp = players[player.playerId].hp + HPPOWERUP;
        } else {
            players[player.playerId].hp = MAXHP;
        }


        self.hppowerup.setPosition(randomPosition(MAP_SIZE_X), randomPosition(MAP_SIZE_Y));

        sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);
        sockets[player.playerId].emit('updateHP', players[player.playerId].hp);
        //sockets[player.playerId].emit('updateScore', self.scores);
        sockets[player.playerId].emit('hpLocation', {
            x: self.hppowerup.x,
            y: self.hppowerup.y
        });

        // ? New hp powerup place
        io.emit('hpLocation', {
            x: self.hppowerup.x,
            y: self.hppowerup.y
        });

        // ! REWORK
        sockets[player.playerId].emit("gotPowerUp", "powerup2");
    } else {
        // Update enemy HP
    }
}

// The collider is a function of the player and the star, but we don't need the star for our purposes
function pickStar(self, player) {
    if ((players[player.playerId].team != 'enemies') && !players[player.playerId].deathState) {
        if (players[player.playerId].team === 'SIRIUS Team') {
            players[player.playerId].playerScore += 10;           
        } else {
            players[player.playerId].playerScore += 10;
        }

        players[player.playerId].fuel = Math.min(MAXFUEL, players[player.playerId].fuel + FUELPOWERUP);

        self.star.setPosition(randomPosition(MAP_SIZE_X), randomPosition(MAP_SIZE_Y));

        sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);

        // ------ Funcionalidade de score do jogador ---------
        //sockets[player.playerId].emit('playerScored', players[player.playerId].playerScore);
        sockets[player.playerId].emit('starLocation', { x: self.star.x, y: self.star.y });

        // ? New star powerup place
        io.emit('starLocation', {
            x: self.star.x,
            y: self.star.y
        });

        // ! REWORK
        sockets[player.playerId].emit("gotPowerUp", "powerup1");
    }
}

// Shield Update Parser
function updateShield(self, player) {
    if (players[player.playerId].team != 'enemies') {
        if (!players[player.playerId].hasShield) {
            players[player.playerId].hasShield = true;
            players[player.playerId].shield = 100;

            self.shieldpowerup.setPosition(randomPosition(MAP_SIZE_X), randomPosition(MAP_SIZE_Y));

            sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);
            sockets[player.playerId].emit('shieldLocation', {
                x: self.shieldpowerup.x,
                y: self.shieldpowerup.y
            });

            // ? New shield powerup place
            io.emit('shieldLocation', {
                x: self.shieldpowerup.x,
                y: self.shieldpowerup.y
            });

            // ! REWORK
            sockets[player.playerId].emit("gotPowerUp", "powerup2");
        }
        setTimeout(function() {
        	players[player.playerId].hasShield = false;
        	players[player.playerId].shield = 0;
		}, 10000);
    }
}

function collisionDamage(self, player, flag, damageRatio=1, bulletOwner=undefined) {
    if ((bulletOwner != undefined) && (player.playerId == bulletOwner))
        return;

    
    if (players[player.playerId].team != 'enemies') {
        if (players[player.playerId].collidedRecently == false) {

            if (players[player.playerId].hp > 0) {
                if (players[player.playerId].shield > 0 && players[player.playerId].hasShield) {
                    players[player.playerId].shield = players[player.playerId].shield - damageRatio*SHIELD_DMG;
                } else if (players[player.playerId].shield <= 0) {
                    players[player.playerId].hasShield = false;
                    players[player.playerId].hp = players[player.playerId].hp - damageRatio*HPDAMAGECOLLISION;
                    sockets[player.playerId].emit('updateHP', players[player.playerId].hp);
                }
            }
            players[player.playerId].collidedRecently = true;
        }
    // player is a bot
    } else {
        players[player.playerId].hp = players[player.playerId].hp - damageRatio*HPDAMAGECOLLISION;
    }

    // Efeito de flash de HP
    setTimeout(function () {
        // Workaround
        if (sockets[player.playerId] != undefined) {
            sockets[player.playerId].emit('collisionFlash');
        } else {
            console.log("(timeoutFlash) Player [" + player.playerId + "] inst there.");
        }
    }, 50);


    // Previne perdas de HP muito consecutivas
    setTimeout(function () {
        // Workaround
        if (sockets[player.playerId] != undefined) {
            players[player.playerId].input.up = false;
            players[player.playerId].collidedRecently = false;
        } else {
            console.log("(timeoutHP) Player [" + player.playerId + "] inst there.");
        }
    }, 300);

    if (players[player.playerId].hp <= 0) {
		if (players[player.playerId].team != 'enemies') {
		   // ---- Remocao do jogador com disconexao e mudanca de cena---------
		   		
		   //     console.log('Game Over for [' + player.playerId + ']');
		   //     sockets[player.playerId].emit('gameOver');
		   //    sockets[player.playerId].emit('disconnect', player.playerId);
		   //    io.emit('disconnect', player.playerId);	
		   //    removePlayer(self, player.playerId);
		   
		   // ---- Player Lock State ----------------
			players[player.playerId].deathState = true;
			sockets[player.playerId].emit('playerLockState', players[player.playerId].deathState);
			
		   // ---- Armazena ultima pontuacao --------
			var lstScore = players[player.playerId].playerScore;
				
		   // ---- Zerar Atributos ------------------  
				
			players[player.playerId].hp = 0;
			players[player.playerId].fuel = 0;
			players[player.playerId].playerScore = 0;
			io.emit('playerUpdates', players);
			io.emit('updateScore', self.scores);
			
			//----- Funcionalidade de score do jogador -------
			//io.emit('playerScored', players[player.playerId].playerScore);
			//io.emit('updateScore', self.scores);
			
			// update shooter score
			if (flag == 'bullet') { 
				players[bulletOwner].playerScore += PLAYER_DESTRUCTION_SCORE;
                // send the current scores
                if (sockets[bulletOwner] != undefined)
				    sockets[bulletOwner].emit('updateSelfScore', players[bulletOwner].playerScore);
			}	
        // player is a bot
        // when killed, a new bot is born
        } else {
        	var enemieMode = players[player.playerId].enemieMode;
            removePlayer(self, player.playerId);
            io.emit('disconnect', player.playerId);
            var enemieId = player.playerId;
            players[enemieId] = {
                rotation: 0,
                x: Math.floor(Math.random() * MAP_SIZE_X) + 50,
                y: Math.floor(Math.random() * MAP_SIZE_Y) + 50,
                playerId: enemieId,
                team: 'enemies',
                input: {
                    left: false,
                    right: false,
                    up: false
                },
                fuel: MAXFUEL,
                refueling: false,
                hp: MAXHP,
                collidedRecently: false,
                enemieAction: 'nothing',
                actionIterations: -1,
                enemieMode: chooseEnemieMode(),
                modeIterations: -1,
                preyId: '',
                hasShield: false,
                shield: 0
            };
            addPlayer(self, players[enemieId]);
            io.emit('currentPlayers', players, guns);
            
            // update shooter score
            if (flag == 'bullet') {
                if (enemieMode == 'chase') {
                    players[bulletOwner].playerScore += HUNTER_DESTRUCTION_SCORE;
                    // send the current scores
                    if (sockets[bulletOwner] != undefined)
                        sockets[bulletOwner].emit('updateSelfScore', players[bulletOwner].playerScore);
                } else {
                    players[bulletOwner].playerScore += ENEMIE_DESTRUCTION_SCORE;
                    // send the current scores
                    sockets[bulletOwner].emit('updateSelfScore', players[bulletOwner].playerScore);
                }
            }    
        }
    }
}

function collisionDamageAsteroid(self, asteroid, flag, bulletOwner=undefined) {
    if ((bulletOwner != undefined) && (players[bulletOwner].team == 'enemies'))
        return;

    if (asteroids[asteroid.id].collidedRecently == false) {

        if (asteroids[asteroid.id].hp > 0) {
            asteroids[asteroid.id].hp = asteroids[asteroid.id].hp - HPDAMAGECOLLISION_AST;
            var colorRatio = asteroids[asteroid.id].hp / MAXHP_AST;
            if (asteroids[asteroid.id].hp > 0)
                io.emit('updateHPAst', asteroid.id, colorRatio);
        }
        asteroids[asteroid.id].collidedRecently = true;

    }

    // Previne perdas de HP muito consecutivas
    setTimeout(function () {
        asteroids[asteroid.id].collidedRecently = false;
    }, 300);

    if (asteroids[asteroid.id].hp === 0) {
    	// update shooter score
		if (flag == 'bullet') { 
			players[bulletOwner].playerScore += ASTEROID_DESTRUCTION_SCORE;
			// send the current scores
			sockets[bulletOwner].emit('updateSelfScore', players[bulletOwner].playerScore);
		}	
    
        if (asteroids[asteroid.id].size >= MIN_SIZE_AST) {
            for (var i = 0; i < 3; i++) {
                var asteroidSize = asteroids[asteroid.id].size / 3;
                var asteroidSon = self.physics.add.image(asteroid.x, asteroid.y, asteroid.formato).setScale(asteroidSize).setBounce(1);
                asteroidSon.angle(asteroid.rotacao);
                asteroidSon.id = asteroid.id + '_' + i;
                self.asteroids.add(asteroidSon);
                asteroids[asteroid.id + '_' + i] = {
                    id: asteroid.id + '_' + i,
                    hp: MAXHP_AST,
                    size: asteroidSize,
                    collidedRecently: false,
                    rotacao: asteroid.rotacao,
                    numero: asteroid.numero,
                    formato: asteroid.formato,
                };
                // angle each new asteroid will move
                //var angle = 0.523599*(i-1);
                //asteroidSon.body.setVelocityX(asteroid.body.velocity.x);
                //asteroidSon.body.setVelocityY(asteroid.body.velocity.y);
                //self.physics.velocityFromRotation(asteroidSon.rotation + angle, asteroid.speed, asteroidSon.body.velocity);
                asteroidSon.body.setVelocity(randomSign() * (Math.random() * 300 + 50), randomSign() * (Math.random() * 300 + 50));
                asteroidSon.setDrag(0);
            }
            // asteroid is smaller than min size, create a new one
        } else {
            // TODO: Check var names
            var asteroidSize = getRandomArbitrary(0.1,0.2);
            var asteroidSon = self.physics.add.image(randomPosition(MAP_SIZE_X), randomPosition(MAP_SIZE_Y), asteroid.formato).setScale(asteroidSize).setBounce(1);
            asteroidSon.id = asteroid.id + '_' + i;
            self.asteroids.add(asteroidSon);
            asteroids[asteroid.id + '_' + i] = {
                id: asteroid.id + '_' + i,
                hp: MAXHP_AST,
                size: asteroidSize,
                collidedRecently: false,
                formato: asteroid.formato,
                numero: asteroid.numero,
                rotacao: asteroid.rotacao,
            };
            asteroidSon.body.setVelocity(randomSign() * (Math.random() * 300 + 50), randomSign() * (Math.random() * 300 + 50));
            asteroidSon.setDrag(0);
            console.log("New ast created, size: " + asteroidSize);
        }


        // destroy father asteroid
        // remove asteroid from server
        removeAsteroid(self, asteroid.id);
        // remove this player from our players object
        delete self.asteroids[asteroid.id];
        // emit a message to all players to remove this player
        io.emit('deleteAsteroid', asteroid.id);
    }
}

function removeAsteroid(self, asteroidId) {
    self.asteroids.getChildren().forEach((asteroid) => {
        if (asteroidId === asteroid.id) {
            // also the reference in the phase engine
            asteroid.destroy();
        }
    });
}

function createWeapon (self, weaponType, x=randomPosition(MAP_SIZE_X), y=randomPosition(MAP_SIZE_Y)) {	
	var weapon = self.physics.add.image(x, y, 'weapon'+weaponType);
    weapon.weaponId = generateKey();
    weapon.weaponType = weaponType;
	self.weapons.add(weapon);
	weapons[weapon.weaponId] = {
		x: weapon.x,
		y: weapon.y,
        id: weapon.weaponId,
        type: weaponType,
		owner: 'none', 
		active: true
	};
}

function getWeapon (self, weapon, player) {

	if (players[player.playerId].team == 'enemies') return;
	
	if (players[player.playerId].slot1 == 'empty') {
		players[player.playerId].slot1 = weapon.weaponType;
		players[player.playerId].activeSlot = 1;
		updatePlayerGun(player.playerId);
	} else if (players[player.playerId].slot2 == 'empty') {
		players[player.playerId].slot2 = players[player.playerId].slot1;
		players[player.playerId].slot1 = weapon.weaponType;
		players[player.playerId].activeSlot = 1;
		updatePlayerGun(player.playerId);
	} else if (players[player.playerId].slot3 == 'empty') {
		players[player.playerId].slot3 = players[player.playerId].slot2;
		players[player.playerId].slot2 = players[player.playerId].slot1;
		players[player.playerId].slot1 = weapon.weaponType;
		players[player.playerId].activeSlot = 1;
		updatePlayerGun(player.playerId);
	} else {
		// append new weapon
		players[player.playerId].slot3 = players[player.playerId].slot2;
		players[player.playerId].slot2 = players[player.playerId].slot1;
		players[player.playerId].slot1 = weapon.weaponType;
		players[player.playerId].activeSlot = 1;
		updatePlayerGun(player.playerId);
	}	
	weapons[weapon.weaponId].owner = player.playerId;
	weapons[weapon.weaponId].active = false;
	weapon.destroy();
	io.emit('playerGotWeapon', weapon.weaponId);
}

function updatePlayerGun (playerId) {
	// first delete previous player's gun
	Object.keys(guns).forEach(function (id) {
		if (guns[id].owner == playerId) {
			delete guns[id];
		}
	});
	
	// create new gun
	var gunId = generateKey();
	var activeSlot = players[playerId].activeSlot;
	switch (activeSlot) {
    	case 0:
    		var activeWeapon = 0;
    		break;
    	case 1:
    		var activeWeapon = players[playerId].slot1;
    		break;
    	case 2:
    		var activeWeapon = players[playerId].slot2;
    		break;
    	case 3:
    		var activeWeapon = players[playerId].slot3;
    		break;
    	default:
    		// nothing to be done
    }
	
	guns[gunId] = {
		id: gunId,
		owner: playerId,
		gunType: activeWeapon
	};
	io.emit('gunCreate', guns[gunId], players);
}

// Convert the full physic objects into its constant (position, scale, and ID) to easily send it between server and client
function asteroidsData(asteroids, asteroidsInfo) {
    var asteroidsData = [];
    asteroids.getChildren().forEach(function (asteroid) {
        asteroidsData.push({
            x: asteroid.x,
            y: asteroid.y,
            scaleX: asteroid.scaleX,
            scaleY: asteroid.scaleY,
            id: asteroidsInfo[asteroid.id].id,
            hp: asteroidsInfo[asteroid.id].hp,
            size: asteroidsInfo[asteroid.id].size,
            formato: asteroidsInfo[asteroid.id].formato,
            numero: asteroidsInfo[asteroid.id].numero,
            rotacao: asteroidsInfo[asteroid.id].rotacao,
        });
    });
    return asteroidsData;
}

function bulletsData(bullets) {
    var bulletsData = [];
    bullets.getChildren().forEach(function (bullet) {
        bulletsData.push({
            x: bullet.x,
            y: bullet.y,
            id: bullet.id,
        });
    });
    return bulletsData;
}

function removeLostBullets(bullets) {
    bullets.getChildren().forEach(function (bullet) {
        deltaX = Math.abs(bullet.x - bullet.originX);
        deltaY = Math.abs(bullet.y - bullet.originY);

        // Remove if it goes too far off screen
        if (deltaX > BULLET_LIMIT || deltaY > BULLET_LIMIT) {
            io.emit('removeBullet', bullet.id);
            bullet.destroy();
        }
    });
}

function chooseEnemieMode() {
    var prob = Math.random();

    if (prob < CHASE_ENEMIE_PROPORTION)
        return 'chase';
    else
        return 'running';
}

function closerOpponent (self, playerId) {
	var team = players[playerId].team;
	var x = players[playerId].x;
	var y = players[playerId].y;
	var smallerDist = Infinity;
	var closerId = undefined;
	var closerPlayer;

	Object.keys(players).forEach(function (id) {
		if ((players[id].team != team)) {
			var playerX = players[id].x;
			var playerY = players[id].y;
			
			var dist = Math.pow((x - playerX), 2) + Math.pow((y - playerY), 2);
			if (dist <= smallerDist) {
				smallerDist = dist;
				closerId = id;
			}		
		}	
	});
	
	if (closerId == undefined) {
		closerPlayer = {x:0, y:0};
	} else {
		self.players.getChildren().forEach(function (physPlayer) {
			if (physPlayer.playerId == closerId) {
				closerPlayer = physPlayer;
			}			
		});
	}
	
	return closerPlayer;
}

function missileUpdate (self, bullets) {
    bullets.getChildren().forEach(function (bullet) {
        if (bullet.type == 4) {
            var angle = self.physics.accelerateToObject(bullet, bullet.prey, SHOT_MISSILE_SPEED);
            bullet.setRotation(angle + 3*Math.PI/2);
        }
    });
}


const game = new Phaser.Game(config);

// Send JSDOM info that the game loaded
window.gameLoaded();

