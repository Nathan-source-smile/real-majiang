import { loadImgAtlas } from "./AssetLoader";
import { FakeServer } from "./Common/CommServices";
import { ClientCommService } from "./ClientCommService";
import TopBar from "./TopBar";
import GlobalVariables from "./GlobalVariables";
import Modal from "./Modal";
import { LOSE, TILE_SIZE, TIME_LIMIT, TOTAL_TILES, TOTAL_TIME, WIN } from "./Common/Constants";
import GlobalData from "./Common/GlobalData";
import Player from "./Player";
import Board from "./Board";

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,
        topBar: TopBar,
        player1: Player,
        player2: Player,
        player3: Player,
        player4: Player,
        board: Board,
        tilePrefab: cc.Prefab,
        
        _currentPlayer: -1,
        _discardPlayer: -1,
        _players: [],
    },

    // use this for initialization
    onLoad: function () {
        // global.loadingScene = false;
        // global.scenes['currentScene'] = this;
        // global.scenes['gameScene'] = global.scenes['currentScene'];

        GameScene = this;
        this._time = cc.director.getTotalTime();
        this._players = [this.player1, this.player2, this.player3, this.player4];
        loadImgAtlas()
            .then(() => {
                FakeServer.initHandlers();
                FakeServer.init();
                this._players.forEach((player, index) => {
                    player.avatar.setUsername('player' + (index + 1));
                });
            })
            .catch((error) => {
            });
    },

    initPlayersWinds(winds) {
        this._players.forEach((player, index) => {
            player.setWind(winds[index]);
        });
    },

    initPlayersHands(players) {
        this._players.forEach((player, index) => {
            player.initHand(players[index]);
        });
        this.board.clearBoard(TOTAL_TILES - 13 * 4);
        ClientCommService.sendConfirmInitHand();
    },

    setActivePlayer(gameBoardOrder, timeout) {
        this._players.forEach((player) => { player.avatar.stopCountDown(); player.avatar.deactivate(); });
        this._players[gameBoardOrder].avatar.activate();
        this._players[gameBoardOrder].avatar.startCountDown(timeout);
    },

    stopPlayer(gameBoardOrder) {
        this._players[gameBoardOrder].avatar.stopCountDown();
        this._players[gameBoardOrder].avatar.deactivate();
    },

    askPlayer(currentPlayer, drawCard, deckCardsNum) {
        this._currentPlayer = currentPlayer;
        this.setActivePlayer(currentPlayer, TIME_LIMIT);
        this._players[currentPlayer].setDrawCard(drawCard);
        this.board.clearBoard(deckCardsNum);
    },

    showDiscard(discardCard, discardPlayer) {
        this._discardPlayer = discardPlayer;
        this._players[discardPlayer].clearDrawCard();
        this.board.showDiscard(discardCard);
    },

    // called every frame
    update: function (dt) {
    },

});