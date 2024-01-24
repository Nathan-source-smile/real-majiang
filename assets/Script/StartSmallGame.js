// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default cc.Class({
    extends: cc.Component,

    properties: {
        roundNum: cc.Label,
        gameNum: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setRound(roundNum) {
        this.roundNum.string = "ROUND " + roundNum;
    },

    setGameNum(gameNum) {
        this.gameNum.string = "Game " + gameNum;
    },

    update(dt) { },
});
