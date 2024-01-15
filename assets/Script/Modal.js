import { ClientCommService } from "./ClientCommService"

export default cc.Class({
    extends: cc.Component,

    properties: {
        ModalScore: {
            default: null,
            type: cc.Label,
        },

        
    },
    onLoad() {
    },

    setText(text) {
        this.ModalScore.string = text;
    },

    onClick() {
        ClientCommService.sendRestartMission();
        this.node.active = false;
    }

})