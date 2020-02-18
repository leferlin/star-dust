// https://medium.com/@z_callan/javascript-project-architecture-constants-deddfde3c8a8

export const TESTE = 'Testando';

// GAME SCENES KEY
export const SCENES = {
    SETTINGS: "SETTINGS",
    DEBUG: "DEBUG",
    PRELOADER: "PRELOADER",
    GAMEOVER: "GAMEOVER",
    MENU: "menu",
    PRELOAD: "PRELOAD",
    PLAY: "play",
    SHIP_CHANGE: 'shipChange',
    TUTORIAL: "tutorial"
};

// STRINGS FOR LATER TRANSLATION
export const STRINGS = {
    NO_TEAM: "----",
    RED_TEAM: "SIRIUS Team",
    BLUE_TEAM: "AETHER Team",
    ENEMIE_TEAM: "enemies",
    CHASE_ENEMIE: "chase",
    TEAM_LABEL: "Team: ",
    BOTS_ON: "ON",
    BOTS_OFF: "OFF",
    START_GAME: "START GAME",
    RESTART_GAME: "RESTART GAME",
    ENTER_TO_RESTART: "PRESS ENTER TO RESTART",
    ENTER_TO_START: "PRESS ENTER TO START",
    MISSILE_INDEX: 4,
    // Ship Selection Screen
    CHOOSE_TEAM: "Choose your team: ",
    CHOOSE_SHIP: "Choose Ship",
    INSERT_BOTS: "Insert bots? ",
    UNDEFINED: "undefined"
};

export const COLORS = {
    RED_TEAM_1: "#f6019d",
    RED_TEAM_2: "#01f65b",
    BLUE_TEAM_1: "#2de2e6",
    BLUE_TEAM_2: "#f62259"
};

// SOCKET PARAMETERS
export const QUERY = {
    TEAM: "team=",
    BOTS: "&bots=",
    SKIN_INDEX: "&skinIndex="
};

// BOT MODE
export const BOTS = {
    BEHAVIOR: "",
    MODE: "",
    CHASE_MODE: "chase"
};

// Ship Selection
export const BIG_SHIPS = {
    SS_LARGE_SHIP_0: 'assets/newShip00_large.png',
    SS_LARGE_SHIP_1: 'assets/newShip01_large.png',
    SS_LARGE_SHIP_2: 'assets/newShip02_large.png',
    SS_LARGE_SHIP_3: 'assets/newShip03_large.png',
    SS_LARGE_SHIP_4: 'assets/newShip04_large.png',
    SS_LARGE_SHIP_5: 'assets/newShip05_large.png',
    SS_LARGE_SHIP_6: 'assets/newShip06_large.png',
    SS_LARGE_SHIP_7: 'assets/newShip07_large.png'
};

// Weapons parameters
export const WEAPONS = {
    N_WEAPONS: 4,
    COLORS: [0x008714, 0x870000, 0x004587, 0xbb47ff],
    DIST_TO_PLAYER: 50,
};

export const PLAYER_SHIPS = {
    SHIP_0: 'assets/newShip00.png',
    SHIP_1: 'assets/newShip01.png',
    SHIP_2: 'assets/newShip02.png',
    SHIP_3: 'assets/newShip03.png',
    SHIP_4: 'assets/newShip04.png',
    SHIP_5: 'assets/newShip05.png',
    SHIP_6: 'assets/newShip06.png',
    SHIP_7: 'assets/newShip07.png',
};

export const ASSETS = {
    SPRITE: {
        // Ships
        SHIP_PLAYER_1: 'assets/spaceShips_001.png',
        SHIP_ENEMY_1: 'assets/enemyBlack5.png',
        SHIP_ENEMY_HUNTER: 'assets/enemieHunter.png',
        SHIP_0: 'assets/newShip00.png',
        SHIP_1: 'assets/newShip01.png',
        SHIP_2: 'assets/newShip02.png',
        SHIP_3: 'assets/newShip03.png',
        SHIP_4: 'assets/newShip04.png',
        SHIP_5: 'assets/newShip05.png',
        SHIP_6: 'assets/newShip06.png',
        SHIP_7: 'assets/newShip07.png',
        // PowerUps
        POWERUP_HP: 'assets/health.png',
        POWERUP_SPEED: 'assets/speed.png',
        POWERUP_SHIELD: 'assets/powerupGreen_shield.png',
        POWERUP_STAR: 'assets/star_gold.png',
        POWERUP_GEM: 'assets/gem.png',
        // Effects
        FX_SHIELD: 'assets/shield1.png',
        // Entities
        ENT_ASTEROID_1: 'assets/asteroid1.png',
        ENT_ASTEROID_2: 'assets/asteroid2.png',
        ENT_ASTEROID_3: 'assets/asteroid3.png',
        ENT_ASTEROID_4: 'assets/asteroid4.png',
        ENT_ASTEROID_5: 'assets/asteroid5.png',
        ENT_ASTEROID_6: 'assets/asteroid6.png',
        ENT_ASTEROID_7: 'assets/asteroid7.png',
        ENT_ASTEROID_8: 'assets/asteroid8.png',
        ENT_ASTEROID_9: 'assets/asteroid9.png',
        // Projectile
        PJ_LASER: 'assets/laser.png',
        PJ_NEWLASER: 'assets/newlaser.png',
        PJ_LASER_0: 'assets/laser.png',
        PJ_LASER_1: 'assets/laserGreen13.png',
        PJ_LASER_2: 'assets/laserGreen05.png',
        PJ_LASER_3: 'assets/laserGreen04.png',
        PJ_LASER_4: 'assets/missile.png',
        // Guns
        GUN_1: 'assets/gun08.png',
        GUN_2: 'assets/gun01.png',
        GUN_3: 'assets/gun00.png',
        GUN_4: 'assets/gun09.png',
        // Particles
        PART_YELLOW: 'assets/yellow.png',
        PART_BLUE: 'assets/blue.png',
        PART_RED: 'assets/red.png',
        PART_GREEN: 'assets/red.png',
        PART_SPARK: 'assets/white.png',
        // Images
        BG_DEBUG: 'assets/debug_bg.png',
        BG_SPACE: 'assets/spacebg.png',
        BG_INTRO: 'assets/background4_3.png',
        BG_GAMEOVER: 'assets/gameover.png',
        BG_FINAL: 'assets/bg.jpg',
        SUN: 'assets/sun.png',
        BLUEPLANET: 'assets/blue-planet.png',
        BROWNPLANET: 'assets/brown-planet.png',
        PURPLEPLANET: 'assets/purple-planet.png',
        GASGIANT: 'assets/gas-giant.png',
        STARSBG: 'assets/stars_texture.png',
        GALAXY: 'assets/galaxy.png',
        ASTEROIDS: 'assets/asteroid1.png',
        BG_PLAY: 'assets/spacebg.png',
        // UI
        GAME_TITLE: 'assets/game-title.png',
        BIG_SHIP: 'assets/spaceShips_001_large.png',
        BTN_ACCEPT: 'assets/accept.png',
        BTN_ARROW: 'assets/arrow.png',
        BTN_START_GAME: 'assets/start-game.png',
        BTN_RESTART_GAME: 'assets/restart-game.png',
        // Ship Selection Screen TODO: REVIEW
        SS_LARGE_SHIP_0: 'assets/newShip00_large.png',
        SS_LARGE_SHIP_1: 'assets/newShip01_large.png',
        SS_LARGE_SHIP_2: 'assets/newShip02_large.png',
        SS_LARGE_SHIP_3: 'assets/newShip03_large.png',
        SS_LARGE_SHIP_4: 'assets/newShip04_large.png',
        SS_LARGE_SHIP_5: 'assets/newShip05_large.png',
        SS_LARGE_SHIP_6: 'assets/newShip06_large.png',
        SS_LARGE_SHIP_7: 'assets/newShip07_large.png',
        // Weapons
        WEAPON: 'assets/weapon1.png',
        WEAPON_FRAME: 'assets/frame.png',
        // Tutorial
        CONTROLS: 'assets/tutorial-image.png',
        RED_LOGO: 'assets/sirius_logo.png',
        BLUE_LOGO: 'assets/aether_logo.png'
    },
    AUDIO: {
        SFX_COLLISION: 'audio/collision1.ogg',
        SFX_DEATH_1: 'audio/death1.ogg',
        SFX_DEATH_2: 'audio/death2.ogg',
        SFX_DEATH_3: 'audio/death3.ogg',
        SFX_POWERUP_1: 'audio/powerup1.ogg',
        SFX_POWERUP_2: 'audio/powerup2.ogg',
        SFX_SHOT_1: 'audio/shot1.ogg',
        SFX_TELEPORT: 'audio/teleport1.ogg'
    },
    MUSIC: {
        NOTHING: 'NOTHING'
    }
};

// Exporting all consts
// export * from './filename'