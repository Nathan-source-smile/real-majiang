import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
import { GameScene } from "./GameScene";

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                // GameScene.start1(params.tiles, params.availableTiles, params.moves);
                break;
            case MESSAGE_TYPE.SC_SET_WIND:
                GameScene.initPlayersWinds(params.winds);
                break;
            case MESSAGE_TYPE.SC_INIT_PLAYERS_HANDS:
                GameScene.initPlayersHands(params.players);
                break;
            case MESSAGE_TYPE.SC_ASK_PLAYER:
                GameScene.askPlayer(params.currentPlayer, params.drawCard, params.deckCardsNum);
                break;
            case MESSAGE_TYPE.SC_SHOW_DISCARD:
                GameScene.showDiscard(params.discardCard, params.discardPlayer);
                break;

            case MESSAGE_TYPE.SC_DRAW_BOARD:
                // GameScene.drawBoard(params.tiles, params.availableTiles, params.moves, params.succeed);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                // GameScene.showEndModal(params.gameResult, params.reason);
                break;
            case MESSAGE_TYPE.SC_NO_MORE:
                // GameScene.showNoMore();
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendConfirmInitHand() {
        this.send(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, {}, 1);
    },

    sendCompareTiles(compareTiles) {
        this.send(MESSAGE_TYPE.CS_COMPARE_TILES, { compareTiles }, 1);
    },

    sendRestartGame() {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, {}, 1);
    }
};
