// import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Common/CommServices";
var global = require("./global");
var MESSAGE_TYPE = require('../Script/Common/Messages');

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                global.scenes['gameScene'].start1(params.winds);
                break;
            case MESSAGE_TYPE.SC_START_ROUND:
                global.scenes['gameScene'].newRound(params.roundNum);
                break;
            case MESSAGE_TYPE.SC_START_SMALL_GAME:
                global.scenes['gameScene'].startSmallGame(params.roundNum, params.gameNum);
                break;
            case MESSAGE_TYPE.SC_SET_WIND:
                global.scenes['gameScene'].initPlayersWinds(params.winds);
                break;
            case MESSAGE_TYPE.SC_INIT_PLAYERS_HANDS:
                global.scenes['gameScene'].initPlayersHands(params.players);
                break;
            case MESSAGE_TYPE.SC_ASK_PLAYER:
                global.scenes['gameScene'].askPlayer(params.currentPlayer, params.drawCard, params.deckCardsNum, params.discardCard, params.discardPlayer);
                break;
            case MESSAGE_TYPE.SC_SHOW_DISCARD:
                global.scenes['gameScene'].showDiscard(params.discardCard, params.discardPlayer, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_PONG:
                global.scenes['gameScene'].askPong(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_PONG:
                global.scenes['gameScene'].confirmPong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_KONG:
                global.scenes['gameScene'].askKong(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_KONG:
                global.scenes['gameScene'].confirmKong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_PRIVATE_KONG:
                global.scenes['gameScene'].askPrivateKong(params.player, params.result);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_PRIVATE_KONG:
                global.scenes['gameScene'].confirmPrivateKong(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_ASK_CHOW:
                global.scenes['gameScene'].askChow(params.player, params.result, params.discardCard);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_CHOW:
                global.scenes['gameScene'].confirmChow(params.player, params.result, params.playerHand);
                break;
            case MESSAGE_TYPE.SC_END_SMALL_GAME:
                global.scenes['gameScene'].endSmallGame(params.roundNum, params.winners);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                global.scenes['gameScene'].endGameF(params.windsList, params.winners, params.winner);
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

    sendRestartGame(player) {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, { player: player }, 1);
    },

    sendCommand(type, params) {
        this.send(type, params, 1);
    }
};
