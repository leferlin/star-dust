// Template básico de uma Scene
// Não esquecer de adicionar o import referente a nova scene no arquivo
// src/game.js além de colocar o nome da classe no config/scene 

export default class TemplateScene extends Phaser.Scene {
    constructor() {
        super({
            // Talvez adicionar a key da cena num arquivo de constantes
            key: 'scene-key'
        });
    }

    // Método que trata parametros recebidos pela Scene
    init(data) {
        console.log("I got: " + data);

        // Pega do bundle data e salva localmente
        this.option = data.option;
    }

    preload() {
        // Carregamento de recursos
    }

    create() {
        // Enviando parametros para outra cena
        // Enviando batatinhas para 'outra-scene'
        this.scene.start('outra-scene', {
            option: 'batatinhas'
        });
    }

    update() {
        // Update
    }
}