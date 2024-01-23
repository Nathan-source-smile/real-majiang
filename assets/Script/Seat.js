// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default cc.Class({
    extends: cc.Component,

    properties: {
        playerSeats: [cc.Label],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setSeats(seats) {
        this.playerSeats.forEach((element, i) => {
            switch (seats[i]) {
                case 0:
                    element.string = "E";
                    break;
                case 1:
                    element.string = "S";
                    break;
                case 2:
                    element.string = "W";
                    break;
                case 3:
                    element.string = "N";
                    break;
                default:
                    break;
            }
        });
    },

    update(dt) { },
});
