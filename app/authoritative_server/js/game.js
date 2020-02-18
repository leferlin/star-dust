// General variables
// These hold more information that is not stored (yet) on the physics objects
const players = {};
const asteroids = {};
const sockets = [];

// Game constants
const WHEIGHT = 800;
const WWIDTH = 600;

// Player constants
const MAXFUEL = 200;
const FUELCOST = 0;
const FUELGAIN = 0.25;

const FUELPOWERUP = .5 * MAXFUEL;

const MAXHP = 10;
const HPDAMAGECOLLISION = 2;
const HPPOWERUP = 30;
const DEATHTHRESHOLD = 0;

const MAXSPEED = 200;

// Asteriods constants
const ASTEROIDNUM = 2;
const MAXHP_AST = 30;
const HPDAMAGECOLLISION_AST = 2;
const MIN_SIZE_AST = 0.5;

// Enemies constants
const N_ENEMIES = 5;
const CHASE_ENEMIE_PROPORTION = 0.5;

// Bullets constants
const SHOT_SPEED = 2000;
const BULLET_LIMIT = 1000;

const MAXSHIELD = 10;
const SHIELD_DMG = 10;

const config = {
	type: Phaser.HEADLESS,
	parent: 'phaser-example',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		  debug: true,
		  gravity: { x: 0, y: 0 }
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
 	this.load.image('enemieHunter', 'assets/enemieHunter.png');
	this.load.image('hp', 'assets/pill_red.png');
	this.load.image('asteroid', 'assets/asteroid.png');
	this.load.image('speed', 'assets/speed.png');
	this.load.image('star', 'assets/star_gold.png');
	this.load.image('debug_bg', 'assets/debug_bg.png');
	this.load.image('shieldpowerup', 'assets/powerupGreen_shield.png');

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
	this.players = this.physics.add.group();
	this.asteroids = this.physics.add.group();
	this.bullets = this.physics.add.group();
	this.scores = {
		blue: 0,
		red: 0
	};

	this.hppowerup = this.physics.add.image(randomPosition(WHEIGHT), randomPosition(WWIDTH), 'hp');
	this.star = this.physics.add.image(randomPosition(WHEIGHT), randomPosition(WWIDTH), 'star');
	this.shieldpowerup = this.physics.add.image(randomPosition(WHEIGHT), randomPosition(WWIDTH), 'shieldpowerup');

	// Allows players to collide with eachother, with no damage taken
	this.physics.add.collider(this.players);

	// When a player overlaps with a HP powerup object he gains a HP boost
	this.physics.add.overlap(this.players, this.hppowerup, function (hp, player) {
		//pickStar(self, player);
		updateHP(self, player);
	});

	// When a player overlaps with a star object he gains score points
	this.physics.add.overlap(this.players, this.star, function (star, player) {
		//pickStar(self, player);
		pickStar(self, player);
	});

	// When a player overlaps with a star object he gains score points
	this.physics.add.overlap(this.players, this.shieldpowerup, function (shield, player) {
		//pickStar(self, player);
		updateShield(self, player);
	});

	// Creates asteroids
	for (var i = 0; i < ASTEROIDNUM; i++) {
		var asteroidSize = Math.random() + 0.3;
		var asteroid = this.physics.add.image(randomPosition(WHEIGHT), randomPosition(WWIDTH), 'asteroid');
		asteroid.setScale(asteroidSize).setBounce(1);
		asteroid.id = i;
		this.asteroids.add(asteroid);
		asteroids[asteroid.id] = {
			id: i,
			hp: MAXHP_AST,
			size: asteroidSize,
			collidedRecently: false,
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
			collisionDamage(self, player, flag ='ship');
			collisionDamageAsteroid(self, asteroid, flag='ship');
		}
	});

	// Allows bullets to hit ships
	this.physics.add.overlap(this.players, this.bullets, function (player, bullet) {

		// Do not hit the player itself

	});

	// When a bullet hit a asteroid, this loses HP
	this.physics.add.overlap(this.asteroids, this.bullets, function (asteroid, bullet) {
		collisionDamageAsteroid(self, asteroid, flag='bullet');
		io.emit('removeBullet', bullet.id);
    bullet.destroy();
	});

	io.on('connection', function (socket) {
		console.log('a user connected');
		console.log(socket.handshake.query.team);

		if (socket.handshake.query.bots == 'YES') {
			for(let i = 0; i<N_ENEMIES; i++) {
				enemieId = 'enemie'+i;
				players[enemieId] = {
					rotation: 0,
					x: Math.floor(Math.random() * WHEIGHT) + 50,
					y: Math.floor(Math.random() * WWIDTH) + 50,
					playerId: 'enemie'+i,
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
					deathState: false,
					enemieAction: 'nothing',
					actionIterations: -1,
					enemieMode: chooseEnemieMode(),
					modeIterations: -1,
					preyId: '',
					hasShield: false,
					shield: MAXSHIELD
				};
				addPlayer(self, players[enemieId]);
			}
		}

		// create a new player and add it to our players object
		players[socket.id] = {
			rotation: 0,
			x: Math.floor(Math.random() * WHEIGHT) + 50,
			y: Math.floor(Math.random() * WWIDTH) + 50,
			playerId: socket.id,
			team: socket.handshake.query.team.toString(),
			input: {
					left: false,
					right: false,
					up: false
			},
			fuel: MAXFUEL,
			refueling: false,
			hp: MAXHP,
			collidedRecently: false,
			shipSkinIndex: socket.handshake.query.skinIndex.toString()
		};
		// save the socket for later
		sockets[socket.id] = socket;

		// add player to server
		addPlayer(self, players[socket.id]);

		// send the players object to the new player
		socket.emit('currentPlayers', players);
		// update all other players of the new player
		socket.broadcast.emit('newPlayer', players[socket.id]);
		// send the star object to the new player
		socket.emit('starLocation', { x: self.star.x, y: self.star.y });
		// send the star object to the new player
		socket.emit('hpLocation', { x: self.hppowerup.x, y: self.hppowerup.y });
		// send the shield power up object to the new player
		socket.emit('shieldLocation', { x: self.shieldpowerup.x, y: self.shieldpowerup.y });
		// send the current scores
		socket.emit('updateScore', self.scores);
		// send the asteroids to the new players
		socket.emit('asteroidsCreate', asteroidsData(self.asteroids, asteroids));

		socket.on('disconnect', function () {
			console.log('user disconnected');
			// remove player from server
			removePlayer(self, socket.id);
			// remove this player from our players object
			delete players[socket.id];
			// emit a message to all players to remove this player
			io.emit('disconnect', socket.id);
		});

		// when a player moves, update the player data
		socket.on('playerInput', function (inputData) {
			handlePlayerInput(self, socket.id, inputData);
		});
	});

}

function update() {
	this.players.getChildren().forEach((physPlayer) => {
		self = this;
		// remember that in javascript the variable holds a reference to the element on the array
		var player = players[physPlayer.playerId];
		const input = player.input;

		if (player.team != 'enemies') {
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
			if (input.up && !player.refueling) {
				this.physics.velocityFromRotation(physPlayer.rotation + 1.5, 500, physPlayer.body.acceleration);
				// if we are moving up, remove one point of fuel
				player.fuel -= FUELCOST;
				if (player.fuel <= 0) {
					player.refueling = true;
					player.fuel = 0;
				}
			} else {
				// Consider the player to be refueling if its fuel is below 25%
				// That way, we stop it from moving if it is on this state
				if (player.fuel > .25 * MAXFUEL)
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

			if (input.space) {
				var x = physPlayer.x;
				var y = physPlayer.y;
				var angle = physPlayer.rotation;
				var speed_x = Math.cos(angle + Math.PI/2) * SHOT_SPEED;
		  	var speed_y = Math.sin(angle + Math.PI/2) * SHOT_SPEED;

				var bullet = this.physics.add.image(x, y, 'bullet').setScale(0.5);
				this.bullets.add(bullet);
				bullet.body.setVelocity(speed_x, speed_y);
				bullet.id = generateKey();
				bullet.originX = physPlayer.x;
				bullet.originY = physPlayer.y;
				io.emit('bulletCreate', { x: physPlayer.x, y: physPlayer.y, id: bullet.id });
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

  // Update bullets
  removeLostBullets(this.bullets);

  this.physics.world.wrap(this.players, 5);
  this.physics.world.wrap(this.asteroids, 5);
	io.emit('playerUpdates', players);
	io.emit('asteroidsUpdates', asteroidsData(this.asteroids, asteroids));
	io.emit("bulletsUpdate", bulletsData(this.bullets));
}

function generateKey(length = 5) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
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
	if (playerInfo.shipSkinIndex == undefined)
		var shipName = 'ship'+'0';
	else
		var shipName = 'ship'+playerInfo.shipSkinIndex;

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
		  delete sockets[player.playerId];
		  delete players[player.playerId];
		  // also the reference in the phase engine
		  player.destroy();
		}
	});
}

// The collider is a function of the player and the star, but we don't need the star for our purposes
function updateHP(self, player) {
	if (players[player.playerId].team != 'enemies') {
		if ((players[player.playerId].hp + HPPOWERUP) < MAXHP) {
			players[player.playerId].hp = players[player.playerId].hp + HPPOWERUP;
		}
		else {
			players[player.playerId].hp = MAXHP;
		}


		self.hppowerup.setPosition(randomPosition(WHEIGHT), randomPosition(WWIDTH));

		sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);
		sockets[player.playerId].emit('updateHP', players[player.playerId].hp);
		//sockets[player.playerId].emit('updateScore', self.scores);
		sockets[player.playerId].emit('hpLocation', { x: self.hppowerup.x, y: self.hppowerup.y });
		io.emit('hpLocation', { x: self.hppowerup.x, y: self.hppowerup.y});

		// Emit Pill Sound
		sockets[player.playerId].emit("gotPowerUp", "powerup2");
	}
}

// The collider is a function of the player and the star, but we don't need the star for our purposes
function updateShield(self, player) {
	if (players[player.playerId].team != 'enemies') {
		if (!players[player.playerId].hasShield) {
			players[player.playerId].hasShield = true;
			players[player.playerId].shield = 100;

			self.shieldpowerup.setPosition(randomPosition(WHEIGHT), randomPosition(WWIDTH));

			sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);
			sockets[player.playerId].emit('shieldLocation', { x: self.shieldpowerup.x, y: self.shieldpowerup.y });
			io.emit('shieldLocation', { x: self.shieldpowerup.x, y: self.shieldpowerup.y});

			// Emit Pill Sound
			sockets[player.playerId].emit("gotPowerUp", "powerup2");
		}
	}
}

// The collider is a function of the player and the star, but we don't need the star for our purposes
function pickStar(self, player) {
	if (players[player.playerId].team != 'enemies') {
		if (players[player.playerId].team === 'red') {
				self.scores.red += 10;
		} else {
				self.scores.blue += 10;
		}

		players[player.playerId].fuel = Math.min(MAXFUEL, players[player.playerId].fuel + FUELPOWERUP);

		self.star.setPosition(randomPosition(WHEIGHT), randomPosition(WWIDTH));

		sockets[player.playerId].emit('updateFuel', players[player.playerId].fuel);
		sockets[player.playerId].emit('updateScore', self.scores);
		sockets[player.playerId].emit('starLocation', { x: self.star.x, y: self.star.y });
		io.emit('starLocation', { x: self.star.x, y: self.star.y });

		// Emit sound
		sockets[player.playerId].emit("gotPowerUp", "powerup1");
	}
}

function collisionDamage(self, player, flag) {
	if (players[player.playerId].collidedRecently == false) {

		if (players[player.playerId].hp > 0) {
			if(players[player.playerId].shield > 0) {
				players[player.playerId].shield = players[player.playerId].shield - SHIELD_DMG;
			}
			else if(players[player.playerId].shield <= 0) {
				players[player.playerId].hasShield = false;
				players[player.playerId].hp = players[player.playerId].hp - HPDAMAGECOLLISION;
				sockets[player.playerId].emit('updateHP', players[player.playerId].hp);
			}
		}
		players[player.playerId].collidedRecently = true;

	}

	// Efeito de flash de HP
	setTimeout(function () {
  	sockets[player.playerId].emit('collisionFlash');
	}, 50);


	// Previne perdas de HP muito consecutivas
	setTimeout(function () {
		players[player.playerId].input.up = false;
		players[player.playerId].collidedRecently = false;
	}, 300);

	if (players[player.playerId].hp <= 0) {
		console.log('teste');
		console.log(players[player.playerId].deathState);
		players[player.playerId].deathState = true;
		
	}
}

function collisionDamageAsteroid (self, asteroid, flag) {
	if (asteroids[asteroid.id].collidedRecently == false) {

		if (asteroids[asteroid.id].hp > 0) {
			asteroids[asteroid.id].hp = asteroids[asteroid.id].hp - HPDAMAGECOLLISION_AST;
			var colorRatio = asteroids[asteroid.id].hp/MAXHP_AST;
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
		if (asteroids[asteroid.id].size >= MIN_SIZE_AST) {
			for (var i = 0; i < 3; i++) {
				var asteroidSize = asteroids[asteroid.id].size/3;
			  var asteroidSon = self.physics.add.image(asteroid.x, asteroid.y, 'asteroid').setScale(asteroidSize).setBounce(1);
			  asteroidSon.id = asteroid.id+'_'+i;
			  self.asteroids.add(asteroidSon);
			  asteroids[asteroid.id+'_'+i] = {
			  	id: asteroid.id+'_'+i,
			  	hp: MAXHP_AST,
			  	size: asteroidSize,
			  	collidedRecently: false
			  }
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
			var asteroidSize = Math.random() + 0.3;
		  var asteroidSon = self.physics.add.image(randomPosition(WHEIGHT), randomPosition(WWIDTH), 'asteroid').setScale(asteroidSize).setBounce(1);
		  asteroidSon.id = asteroid.id+'_'+i;
		  self.asteroids.add(asteroidSon);
		  asteroids[asteroid.id+'_'+i] = {
		  	id: asteroid.id+'_'+i,
		  	hp: MAXHP_AST,
		  	size: asteroidSize,
		  	collidedRecently: false,
		  }
		  asteroidSon.body.setVelocity(randomSign() * (Math.random() * 300 + 50), randomSign() * (Math.random() * 300 + 50));
		  asteroidSon.setDrag(0);
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

function removeAsteroid (self, asteroidId) {
	self.asteroids.getChildren().forEach((asteroid) => {
		if (asteroidId === asteroid.id) {
		    // also the reference in the phase engine
		    asteroid.destroy();
		}
  });
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
			size: asteroidsInfo[asteroid.id].size
		});
	});
	return asteroidsData;
}

// Convert the full physic objects into its constant to easily send it between server and client
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

function removeLostBullets (bullets) {
	bullets.getChildren().forEach(function (bullet) {
		deltaX = Math.abs(bullet.x - bullet.originX);
		deltaY = Math.abs(bullet.y - bullet.originY);

		// Remove if it goes too far off screen
    if(deltaX > BULLET_LIMIT || deltaY > BULLET_LIMIT) {
    	io.emit('removeBullet', bullet.id);
    	bullet.destroy();
    }

	});
}

function chooseEnemieMode () {
	var prob = Math.random();

	if (prob < CHASE_ENEMIE_PROPORTION)
		return 'chase';
	else
		return 'running';
}

const game = new Phaser.Game(config);

// Send JSDOM info that the game loaded
window.gameLoaded();
