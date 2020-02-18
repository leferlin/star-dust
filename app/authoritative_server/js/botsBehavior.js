// Bots behavior 

const ROTATE_LEFT = 1;
const ROTATE_RIGHT = 2
const MOVE_FORWARD = 10;
const DISTANCE_LIMIT = 10;
const CHASE_MODE = 100;


/*	
		physPlayer is the physic enemie Object
		player is the data of this enemie
 */		
function updateBehavior(self, physEnemie, player) {

	if (player.enemieMode == 'chase')
		chaseMode(self, physEnemie, player);
	// enemy is in running mode
	else
		runningMode(self, physEnemie, player);
}


function chaseMode (self, physEnemie, player) {

	var randomPlayerX;
	var randomPlayerY;

	if (player.modeIterations == -1 || player.modeIterations == 0) {
		randomPlayer = getRandomPlayer(self);
		player.preyId = randomPlayer.playerId;
		player.modeIterations = Math.floor(getRandomArbitrary(180, 540));
		randomPlayerX = randomPlayer.x;
		randomPlayerY = randomPlayer.y;
	} else {
		self.players.getChildren().forEach((physPlayer) => {
			if (physPlayer.playerId == player.preyId)
				randomPlayerX = physPlayer.x;
				randomPlayerY = physPlayer.y;
		});
	}
	
	if (player.modeIterations > 0) {
		// distance between enemie and player
		var dist = Math.sqrt(Math.pow(physEnemie.x - randomPlayerX, 2) + Math.pow(physEnemie.y - randomPlayerY, 2));
		if (dist > DISTANCE_LIMIT) 
			self.physics.accelerateToObject(physEnemie, randomPlayer, 400);
		else
			physEnemie.body.setVelocity(0,0);
		// TODO
		//self.physics.accelerateToObject(physEnemie, physShip);
	}
	
	player.modeIterations = player.modeIterations - 1 ;
}


function runningMode(self, physEnemie, player) {
	if ((player.enemieAction == 'nothing') || (player.actionIterations == 0)) {
		var prob = Math.floor(Math.random() * 10);
		
		if (prob < ROTATE_LEFT)
			physEnemie.enemieAction = 'rotateLeft';
		else if (prob < ROTATE_RIGHT)
			physEnemie.enemieAction = 'rotateRight';
		else if (prob < MOVE_FORWARD)
			physEnemie.enemieAction = 'move';
	}
	if ((player.actionIterations == -1) || (player.actionIterations == 0))
		physEnemie.actionIterations =  Math.floor(getRandomArbitrary(10, 120));
	
	// Execute action 
	
	if (player.enemieAction == 'rotateLeft') {
		physEnemie.setAngularVelocity(-300);
		
	} else if (player.enemieAction == 'rotateRight') {
		physEnemie.setAngularVelocity(300);
	} else {
		// move forward
		physEnemie.setAngularVelocity(0);
		self.physics.velocityFromRotation(physEnemie.rotation + 1.5, 200, physEnemie.body.acceleration);
	}
	
	physEnemie.actionIterations--;
}


/* Auxiliar functions */

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomPlayer (self) {
	
	var children = self.players.getChildren();
	while(true) {
		var randomPlayer = children[Phaser.Math.RND.integerInRange(0, children.length - 1)];
		if (players[randomPlayer.playerId].team != 'enemies')		
			return randomPlayer;
	}
		
}




