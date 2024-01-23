// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        playerName: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setName(str) {
        this.playerName.string = str;
    },

    update(dt) { },
});
