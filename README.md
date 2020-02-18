# Projeto MC437

## Escopo
* Interação cliente-servidor para múltiplos usuários via plataforma web em jogo contendo persistência de dados
* Jogo em tema de naves espaciais no espaço, com adição de bots e múltiplas salas com número fixo de jogadores.

## Problema
* Criar um jogo de gênero .io multijogador em browser utilizando Phaser HTML 5

## Arquitetura
* Cliente utilizando um browser acessa o jogo, que está em um host na cloud

## Requerimentos Funcionais e não Funcionais
* Rodar em todos os browsers
* Tempo de resposta entre click e ação no jogo dever ser de menos de 0.5s
* Sistema deve permitir que usuário escolha um nome
* Sistema deve permitir usuário entrar em uma sala já existente, ou uma sala criada após a entrada do usuário
* Mapa deve permitir a presença de asteroides
* Mapa deve permitir a presença de aliens(bots)
* Sistema deve permitir jogador a mover a nave espacial
* Sistema deve permitir jogador a mover a atirar com a nave
* Sistema deve diminuir vida da nave ao colidir com asteroide
* Sistema deve diminuir vida da nave ao ser atingida por bot
* Sistema deve diminuir vida da nave ao ser atingida por outro jogador
* Sistema deve criar aliens aleatoriamente, após um período de tempo mínimo fixo

## Critério de Aceitação
* Inputs bem responsivos do jogador e presença de adversários "bots" ou outros jogadores
* Consistência na persistência de dados

## Riscos
* Desistência de algum membro da equipe
* Falta de features necessárias nas ferramentas escolhidas

## Ferramentas Utilizadas
*   Phaser 3
*   Node
*   Socket.io
*   Express
*   WebPack

## Créditos
*   TODO!

## Licenças
*   TODO: Adicionar Licenças: de sprites, sons, músicas, bibliotecas.

* Sprites by Kenney Vleugels (www.kenney.nl) 

### Arquivos

#### jsconfig.json
    Autocompletar no VSCODE

#### .gitlab-ci
    Controla a integração contínua no GitLab

#### .gitignore
    Ignora arquivos criados localmente por editores de texto e pelo webpack na hora de fazer um commit

#### Dockerfile
#### Makefile    

#### TO-DO  
##### Ultima iteração  

*   Cena de tutorial
*   Nome de usuário
*   Refatorar Classes Jogador-Asteroides-Objetos do Mapa
*   Criar Salas
*   Heroku/Deploy servidor
*   gitlab-ci, dockerfile e afins
*   Sound Effects
*   Musics
*   Sprites da GUI/HUD
*   Eventos Aleatórios(Desastres etc)[https://simcity.fandom.com/pt-br/wiki/Desastre]
*   Efeitos de aceleração, armas adicionais
*   Apresentação do jogo
*   Repaginar tela inicial
*   Docker
*   Gerar salas aleatoriamente


