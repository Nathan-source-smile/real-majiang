import { ClientCommService } from "./ClientCommService";
import GlobalData from "./Common/GlobalData";
import GlobalVariables from "./GlobalVariables";

cc.Class({
    extends: cc.Component,

    properties: {
        mainButton: cc.Button,
        normalSprite: cc.Sprite,
        overSprite: cc.Sprite,
        clickSprite: cc.Sprite,
        transSprite: cc.Sprite,

        _x: -1,
        _y: -1,
        _z: -1,
        _type: -1,
        _semiType: -1,
        _available: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setFace("normal");
        // this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        // this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);

        // var spriteName = "ba-01"
        // this.normalSprite.getComponent(cc.Sprite).spriteFrame =
        //     GlobalData.imgAtlas.getSpriteFrame("tiles-normal-" + spriteName);
        // this.overSprite.getComponent(cc.Sprite).spriteFrame =
        //     GlobalData.imgAtlas.getSpriteFrame("tiles-over-" + spriteName);
        // this.clickSprite.getComponent(cc.Sprite).spriteFrame =
        //     GlobalData.imgAtlas.getSpriteFrame("tiles-click-" + spriteName);

        // var transName = "";
        // if (transName === "")
        //     return
        // else
        //     this.transSprite.getComponent(cc.Sprite).spriteFrame =
        //         GlobalData.imgAtlas.getSpriteFrame(transName);
        // this.setInteractable(this._available);
    },

    setInteractable(interactable) {
        this.mainButton.interactable = interactable;
    },

    isSelected() {
        return this.overSprite.node.active;
    },

    setSelected(click) {
        this.overSprite.node.active = click;
    },

    setTileType(tile) {
        this._x = tile.x;
        this._y = tile.y;
        this._z = tile.z;
        this._type = tile.type;
        this._semiType = tile.semiType;
        this._available = tile.available;

        var spriteName = "";
        var transName = "";
        switch (this._z) {
            case 0:
                transName = "tiles-trans-30";
                break;
            case 1:
                transName = "tiles-trans-20";
                break;
            case 2:
                transName = "tiles-trans-10";
                break;
            default:
                transName = "";
                break;
        }
        if (tile.type >= 0 && tile.type <= 8) {
            spriteName = "ba-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 9 && tile.type <= 17) {
            spriteName = "le-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 18 && tile.type <= 26) {
            spriteName = "ci-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 27 && tile.type <= 28) {
            switch (tile.type) {
                case 27:
                    spriteName = "e-0" + (tile.semiType * 10 % 10);
                    break;
                case 28:
                    spriteName = "f-0" + (tile.semiType * 10 % 10);
                    break;
                default:
                    0;
            }
        } else if (tile.type >= 29 && tile.type <= 35) {
            switch (tile.type) {
                case 29:
                    spriteName = "p-oeste";
                    break;
                case 30:
                    spriteName = "p-este";
                    break;
                case 31:
                    spriteName = "p-sur";
                    break;
                case 32:
                    spriteName = "p-norte";
                    break;
                case 33:
                    spriteName = "c-rojo";
                    break;
                case 34:
                    spriteName = "c-verde";
                    break;
                case 35:
                    spriteName = "c-blanco";
                    break;
                default:
                    0;
            }
        }
        // console.log("sprite name", spriteName);
        this.normalSprite.getComponent(cc.Sprite).spriteFrame =
            GlobalData.imgAtlas.getSpriteFrame("tiles-normal-" + spriteName);
        this.overSprite.getComponent(cc.Sprite).spriteFrame =
            GlobalData.imgAtlas.getSpriteFrame("tiles-over-" + spriteName);
        this.clickSprite.getComponent(cc.Sprite).spriteFrame =
            GlobalData.imgAtlas.getSpriteFrame("tiles-click-" + spriteName);
        if (transName === "")
            return
        else
            this.transSprite.getComponent(cc.Sprite).spriteFrame =
                GlobalData.imgAtlas.getSpriteFrame(transName);
        this.setInteractable(this._available);
    },

    setFace(face) {
        this.normalSprite.node.active = false;
        this.overSprite.node.active = false;
        this.clickSprite.node.active = false;
        switch (face) {
            case "normal":
                this.normalSprite.node.active = true;
                break;
            case "over":
                this.overSprite.node.active = true;
                break;
            case "click":
                this.clickSprite.node.active = true;
                break;
        }
    },

    onUserClick() {
        if (this._available && GlobalVariables.compareTiles.length < 2 && GlobalVariables.gameResult === null) {
            if (this.isSelected()) {
                this.setFace("normal");
                GlobalVariables.compareTiles = [];
                return;
            } else {
                this.setFace("over");
            }
            console.log(this._x, this._y, this._z, this._type, this._semiType);
            if (GlobalVariables.compareTiles.length < 2) {
                if (GlobalVariables.compareTiles.length === 1
                    && GlobalVariables.compareTiles[0].x === this._x
                    && GlobalVariables.compareTiles[0].y === this._y
                    && GlobalVariables.compareTiles[0].z === this._z)
                    return;
                else
                    GlobalVariables.compareTiles.push({
                        x: this._x,
                        y: this._y,
                        z: this._z,
                        type: this._type,
                        semiType: this._semiType,
                        available: this._available,
                    });
            }
            if (GlobalVariables.compareTiles.length === 2) {
                setTimeout(() => {
                    ClientCommService.sendCompareTiles(GlobalVariables.compareTiles);
                    // GlobalVariables.compareTiles = [];
                }, 200);
                // for (let i = 0; i < GlobalVariables._tileComponents.length; i++) {
                //     GlobalVariables._tileComponents[i].setFace("normal");
                // }
            }
        }
    },


    //   start() { },

    // update (dt) {},
});
