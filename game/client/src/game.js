// Game Main Scene
// Import Babel Polyfill and Phaser so ES6 imports should work
import 'phaser';
import '@babel/polyfill';

// Scenes import
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import GameOverScene from './scenes/GameOverScene';
import SettingsScene from './scenes/SettingsScene';
import ShipChangeScene from './scenes/ShipChangeScene';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

// !!!DEBUG
var atabl;

// TODO: change raw numbers to contants 
// TODO: Maybe change to a JSON file and load it here
const config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-game', // Name to the given div
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scene: [PreloadScene, MenuScene, ShipChangeScene, PlayScene, GameOverScene, SettingsScene],
    autoResize: true,
    // plugins: {
    //     global: [{
    //             key: 'rexuiplugin',
    //             url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
    //             sceneKey: 'rexUI'
    //             // mapping: memberName  // member name in each scene instance, optional
    //         },
    //     ]
    // },
    // dom container is required to make RexUI work
    dom: {
        createContainer: true
    }
};

window.addEventListener('load', () => {
    let game = new Phaser.Game(config);
    game.scene.dump();
    atabl = game;
});
