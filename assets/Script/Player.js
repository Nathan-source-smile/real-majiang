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


    onLoad() { },

    start() {

    },

    clear(){
        this.hand.clear();
        this.discards.clear();
        this.triples.clear();
    },

    setWind(wind) {
        this.avatar.setWind(wind);
    },

    initHand(tiles) {
        this.hand.initHand(tiles);
    },

    setDrawCard(drawCard) {
        this.hand.setDrawCard(drawCard);
        this.hand._click = false;
    },

    clearDrawCard() {
        this.hand.clearDrawCard();
    },

    addDiscardCard(discardCard) {
        this.discards.add(discardCard);
    },

    showButtons(str, result, discardCard) {
        this.avatar.showButtons(str, result, discardCard);
    },

    confirmPong(result) {
        this.triples.add(result);
    },

    confirmPrivateKong(result) {
        this.triples.add(result);
    },

    confirmKong(result) {
        this.triples.add(result);
    },

    confirmChow(result) {
        this.triples.add(result);
    },

    update(dt) { },
});
