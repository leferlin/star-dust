# Game  

## Estrutura das pastas  
Baseado em https://github.com/jdotrjs/phaser-guides/blob/master/Basics/Part1.md  

### Client  
Tudo referente a parte de desenvolvimento do cliente, de toda a parte que será posteriormente exposta.  

### Dist  
Pasta gerada pelo Webpack, contém tudo que vai ficar público como assets, js que rodarão no navegador e afins.  

### PWA
Pasta com configurações do google sobre Progressive Web Apps. [Ver Mais](https://developers.google.com/web/progressive-web-apps/)  

### Server
Conteúdo local do servidor, com estrutura de pastas semelhante a do Client.  

### Webpack
Conjunto de arquivos de configuração do Webpack, responsável por juntar arquivos JS e resolver dependencias.  

## Comandos

### Build Dev  
```bash 
npm run buildDev
```

### Build Prod  
```bash 
npm run build 
```

### Build Dev and Run
```bash 
npm run local
```

### Run   
```bash 
npm start 
```

## Atualizando  

Nesta nova pasta de nosso projeto atualizei as dependencias no ```package.json```, sendo necessário um ```npm install``` para que o conteúdo seja instalado devidamente:

```json
    ...
    "dependencies": {
        "canvas": "^2.1.0",
        "datauri": "^2.0.0",
        "express": "^4.16.4",
        "jsdom": "^15.1.0",
        "phaser": "^3.17.0",
        "socket.io": "^2.1.1",
        "@babel/polyfill": "^7.2.5"
    },
    "devDependencies": {
        "@babel/core": "^7.3.4",
        "@babel/plugin-proposal-class-properties": "^7.3.4",
        "@babel/plugin-syntax-dynamic-import": "^7.2.0",
        "@babel/preset-env": "^7.3.4",
        "babel-loader": "^8.0.5",
        "clean-webpack-plugin": "^2.0.2",
        "copy-webpack-plugin": "^5.0.0",
        "html-webpack-plugin": "^3.2.0",
        "typescript": "^3.3.3333",
        "webpack": "^4.29.6",
        "webpack-cli": "^3.2.3",
        "webpack-dev-server": "^3.2.1",
        "webpack-merge": "^4.2.1",
        "webpack-obfuscator": "^0.18.0",
        "workbox-webpack-plugin": "^4.0.0"
    }
    ...
```

Atualizei o JDDOM, canvas e o datauri além de adicionar o @babel/polyfill nas dependencias do projeto. O polyfill nos ajuda com os imports entre arquivos de acordo com o ES6. O arquivo de configuração do babel é o ```.babelrs```  
  
As dependencias dev são pacotes que ajudam em vários momentos: Traduzindo o código ES6 para CommonJS, fazendo um Bundle com todos os arquivos de JS de acordo com a dependencia de cada um e suporte para Typescript se em algum momento for necessário.  

## Servidor de desenvolvimento

Para melhor desenvolver localmente eu instalei na minha máquina, globalmente, o pacote ```nodemon```, para instalar globalmente é só fazer um:
```bash
    npm install -g nodemon
```
Terminado é só digitar ```nodemon``` na linha de comando, estando na pasta game que ele sobe um servidor local com os parametros definido por essa linha do nosso ```package.json``` onde ele configura o servidor como feito em ```index.js```, porém com a vantagem de atualizar sozinho automaticamente conforme os arquivos forem modificados.

``` json
...
"main": "index.js"
...
```

## Padrões

Inserir aqui padrões a serem adotados para cada tipo de objeto ou classe do jogo.  
Comentários começando em TODO estão espalhados pelo código de maneira a informar melhor aonde precisamos alterar certas coisas.  

## TODO  

Definir padrão de nomes de variáveis de acordo com o contexto.  
Ex: O nome de um evento vindo do servidor deve terminar com Event e usar camelcase ex: GameOverEvent
