// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Seat from "./Seat";
import Winner from "./Winner";

export default cc.Class({
    extends: cc.Component,

    properties: {
        // games: [cc.Label],
        winners: [Winner],
        seats: [Seat],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setWinners(windsList, winners) {
        console.log("windsList: ", windsList);
        this.winners.forEach((winner, index) => {
            if (winners[index] === undefined || winners[index] === -1) {
                winner.node.active = false;
            } else {
                winner.node.active = true;
                winner.setName("player" + (winners[index] + 1));
            }
            if (winners[index] === undefined) {
                this.seats[index].node.active = false;
            } else {
                this.seats[index].node.active = true;
                this.seats[index].setSeats(windsList[index]);
            }
        });
    },

    update(dt) { },
});
