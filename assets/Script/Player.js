import PlayerDiscards from "./PlayerDiscards";
import PlayerGameData from "./PlayerGameData";
import PlayerHand from "./PlayerHand";
import PlayerTriples from "./PlayerTriples";

export default cc.Class({
    extends: cc.Component,

    properties: {
        hand: PlayerHand,
        discards: PlayerDiscards,
        triples: PlayerTriples,
        avatar: PlayerGameData,
    },


    onLoad () {},

    start () {

    },

    setWind(wind){
        this.avatar.setWind(wind);
    },

    initHand(tiles){
        this.hand.initHand(tiles);
    },

    setDrawCard(drawCard){
        this.hand.setDrawCard(drawCard);
    },

    clearDrawCard(){
        this.hand.clearDrawCard();
    },
    
    update (dt) {},
});
