// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ClientCommService } from "./ClientCommService";
import Winner from "./Winner";

export default cc.Class({
    extends: cc.Component,

    properties: {
        winnerName: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setWinnerName(str) {
        this.winnerName.string = str;
    },

    onClick() {
        ClientCommService.sendRestartGame();
    },

    update(dt) { },
});
