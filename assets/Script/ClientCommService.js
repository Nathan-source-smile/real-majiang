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
                GameScene.askPlayer(params.currentPlayer, params.drawCard, params.deckCardsNum, params.discardCard, params.discardPlayer);
                break;
            case MESSAGE_TYPE.SC_SHOW_DISCARD:
                GameScene.showDiscard(params.discardCard, params.discardPlayer, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_PONG:
                GameScene.askPong(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_PONG:
                GameScene.confirmPong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_KONG:
                GameScene.askKong(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_KONG:
                GameScene.confirmKong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_PRIVATE_KONG:
                GameScene.askPrivateKong(params.player, params.result);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_PRIVATE_KONG:
                GameScene.confirmPrivateKong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_CHOW:
                GameScene.askChow(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_CHOW:
                GameScene.confirmChow(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_END_SMALL_GAME:
                GameScene.endSmallGame(params.roundNum, params.winners);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                GameScene.endGameF(params.windsList, params.winners, params.winner);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendConfirmInitHand() {
        this.send(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, {}, 1);
    },

    sendClaimDiscard(discardCard, discardPlayer, draw) {
        this.send(MESSAGE_TYPE.CS_CLAIM_DISCARD, { discardCard: discardCard, discardPlayer: discardPlayer, draw });
    },

    sendClaimPass(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_PASS, { player: player });
    },

    sendClaimPong(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_PONG, { player: player });
    },

    sendClaimKong(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_KONG, { player: player });
    },

    sendClaimPrivateKong(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_PRIVATE_KONG, { player: player });
    },

    sendClaimChow(player, tiles) {
        this.send(MESSAGE_TYPE.CS_CLAIM_CHOW, { player: player, tiles: tiles });
    },

    sendRestartGame() {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, {}, 1);
    }
};
