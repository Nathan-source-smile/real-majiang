// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Winner from "./Winner";

export default cc.Class({
    extends: cc.Component,

    properties: {
        roundNum: cc.Label,
        games: [cc.Label],
        winners: [Winner],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setWinners(roundNum, winners) {
        this.roundNum.string = roundNum;
        let p = (roundNum - 1) * 4;
        this.games.forEach((gameNum, index) => {
            if (index < winners.length - p) {
                gameNum.node.active = true;
                let i = winners[p + index] + 1;
                if (i === 0) {
                    this.winners[index].node.active = false;
                } else {
                    this.winners[index].node.active = true;
                    this.winners[index].setName("player" + i);
                }
            } else {
                gameNum.node.active = false;
                this.winners[index].node.active = false;
            }
        });
    },

    update(dt) { },
});
