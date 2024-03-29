import Accept from "./Accept";
import GlobalData from "./Common/GlobalData";
var global = require("global");

export default cc.Class({
    extends: cc.Component,

    properties: {
        usernameLabel: {
            default: null,
            type: cc.Label
        },
        avatarSprite: {
            default: null,
            type: cc.Sprite
        },
        roundScore: {
            default: null,
            type: cc.Label
        },
        gameScore: {
            default: null,
            type: cc.Label
        },
        playerGameDataBackgroundSprite: {
            default: null,
            type: cc.Sprite
        },
        scoreBackgroundSprite: {
            default: null,
            type: cc.Sprite
        },
        countDownNode: {
            default: null,
            type: cc.Node
        },
        circularProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        timerNode: {
            default: null,
            type: cc.Node
        },

        winds: [cc.Node],

        buttons: {
            default: null,
            type: cc.Node,
        },
        bubbleBackground: {
            default: null,
            type: cc.Sprite,
        },
        bubbleLabel: {
            default: null,
            type: cc.Label,
        },
        player: -1,
        // botIconNode: {
        //     default: null,
        //     type: cc.Node
        // },
        _seatWind: null,
        _discardCard: null,
    },

    onLoad() {
        this.setButtons(false);
        this.countDownNode.active = false;
        this.winds.forEach((wind) => {
            wind.active = false;
        });
    },

    startCountDown(seconds) {
        console.log("showing countDown", seconds);
        this.countDownNode.active = true;
        var currentDate = new Date();
        var toDate = new Date();
        this._fromTime = currentDate.getTime();
        toDate.setSeconds(currentDate.getSeconds() + seconds);
        this._toTime = toDate.getTime();
        this._totalTime = this._toTime - this._fromTime;
        var interval = 1;
        // Time of repetition
        var repeat = 1;
        // Start delay
        var delay = 1;
        this.circularProgressBar.getComponent("CircularProgressBar").setTo(1);
        this.timerNode.getComponent("CountDown").startCountDown(seconds);
        this.circularProgressBar.getComponent("CircularProgressBar").progressTo(seconds, 0);
        //return;
    },

    stopCountDown(seconds) {
        this.countDownNode.active = false;
        //return;
    },

    setWind(wind) {
        this.winds.forEach((seat, index) => {
            if (index === wind) {
                seat.active = true;
                this._seatWind = wind;
            } else {
                seat.active = false;
            }
        })
    },

    setButtons(active) {
        this.buttons.active = active;
    },

    showButtons(str, result, discardCard) {
        this.setButtons(true);
        if (this._discardCard !== discardCard) {
            this._discardCard = discardCard;
            this.buttons.removeAllChildren();
            let passNode = cc.instantiate(global.scenes['gameScene'].acceptPrefab);
            const passComponent = passNode.getComponent(Accept);
            passComponent.set("PASS", result, this.player);
            this.buttons.addChild(passNode);
        }
        let acceptNode;
        let acceptComponent;
        switch (str) {
            case "PONG":
                acceptNode = cc.instantiate(global.scenes['gameScene'].acceptPrefab);
                acceptComponent = acceptNode.getComponent(Accept);
                acceptComponent.set(str, result, this.player);
                this.buttons.addChild(acceptNode);
                break;
            case "KONG":
                acceptNode = cc.instantiate(global.scenes['gameScene'].acceptPrefab);
                acceptComponent = acceptNode.getComponent(Accept);
                acceptComponent.set(str, result, this.player);
                this.buttons.addChild(acceptNode);
                break;
            case "P KONG":
                acceptNode = cc.instantiate(global.scenes['gameScene'].acceptPrefab);
                acceptComponent = acceptNode.getComponent(Accept);
                acceptComponent.set(str, result, this.player);
                this.buttons.addChild(acceptNode);
                break;
            case "CHOW":
                acceptNode = cc.instantiate(global.scenes['gameScene'].acceptPrefab);
                acceptComponent = acceptNode.getComponent(Accept);
                acceptComponent.set(str, result, this.player);
                // if (result.length > 1) {
                //     acceptComponent.button.interactable = false;
                // }
                this.buttons.addChild(acceptNode);
                break;
            default:
                return 0;
        }
        console.log(this.buttons);
    },

    showBubble(str) {
        let spriteFrame = GlobalData.imgAtlas.getSpriteFrame("small notifications-chow-chow");
        this.bubbleLabel.node.color = (new cc.Color()).fromHEX("3F1805");
        switch (str) {
            case "PONG":
                this.bubbleLabel.string = str;
                break;
            case "KONG":
                this.bubbleLabel.string = str;
                break;
            case "P KONG":
                this.bubbleLabel.string = "KONG";
                break;
            case "CHOW":
                this.bubbleLabel.string = str;
                break;
            case "PASS":
                spriteFrame = GlobalData.imgAtlas.getSpriteFrame("small notifications-pass-pass");
                this.bubbleLabel.node.color = (new cc.Color()).fromHEX("582C14");
                this.bubbleLabel.string = str;
                break;
            default:
                return 0;
        }
        this.bubbleBackground.spriteFrame = spriteFrame;
        this.bubbleBackground.node.active = true;
        this.scheduleOnce(() => {
            this.bubbleBackground.node.active = false;
        }, 1)
    },

    // setBotIcon (isBot){
    //     if (isBot){
    //         this.botIconNode.active = true;
    //     }
    //     else {
    //         this.botIconNode.active = false;
    //     }
    // },    

    getUserName() {
        return this.usernameLabel.string;
    },

    setUsername(username) {
        this.usernameLabel.string = username;
    },

    setAvatar(spriteFrame) {
        //this.loadAvatar(avatar);
        this.avatarSprite.spriteFrame = spriteFrame;
    },

    setRoundScore(score) {
        this.roundScore.string = score + "/4";
    },

    setGameScore(score) {
        this.gameScore.string = "0" + score;
    },

    activate() {
        this.usernameLabel.node.color = (new cc.Color()).fromHEX("FFFFFF");
        this.roundScore.node.color = (new cc.Color()).fromHEX("FFFFFF");
        let temps = this.winds[this._seatWind].children;
        temps.forEach((temp) => {
            if (temp.name.endsWith('p')) {
                temp.active = true;
            } else {
                temp.active = false;
            }
        });
        // this.roundScore.node.color = (new cc.Color()).fromHEX("EADCCA");
        this.loadBackgrounds(true);
    },

    deactivate() {
        this.usernameLabel.node.color = (new cc.Color()).fromHEX("582C14");
        this.roundScore.node.color = (new cc.Color()).fromHEX("582C14");
        let temps = this.winds[this._seatWind].children;
        temps.forEach((temp) => {
            if (temp.name.endsWith('p')) {
                temp.active = false;
            } else {
                temp.active = true;
            }
        });
        this.loadBackgrounds(false);
        this.setButtons(false);
    },

    hideCountDown() {
        this.circularProgressBar.getComponent("CircularProgressBar").enabled = false;
        this.timerNode.getComponent("CountDown").enabled = false;
        this.countDownNode.active = false;
    },

    loadBackgrounds(active) {
        let playerGameDataBackgroundPath = "user avatar and name-layer-1";
        let scoreBackgroundPath = "user avatar and name-user-panel-layer2";
        if (active) {
            playerGameDataBackgroundPath = "user avatar and name-user-turn-user-panel-time-layer-1";
            scoreBackgroundPath = "user avatar and name-user-turn-user-panel-time-layer2";
        }
        var spriteFrame = GlobalData.imgAtlas.getSpriteFrame(playerGameDataBackgroundPath);
        this.playerGameDataBackgroundSprite.spriteFrame = spriteFrame;
        spriteFrame = GlobalData.imgAtlas.getSpriteFrame(scoreBackgroundPath);
        this.scoreBackgroundSprite.spriteFrame = spriteFrame;
        this.playerGameDataBackgroundSprite.node.width = 93;
        this.playerGameDataBackgroundSprite.node.height = 125;
        this.scoreBackgroundSprite.node.width = 92;
        this.scoreBackgroundSprite.node.height = 37;
    },



    start() {
    },

    update(dt) { },

    getAvatarUrl(avatar) {
        //return "http://cdn." + global.domain + "/images/avatar/users/" + avatar + ".png";
        if (global.DEV_MODE) {
            return "https://www." + global.domain + "/gameApis/getUserAvatar.php?avatar=" + avatar;
        }
        else {
            return "https://cdn." + global.domain + "/images/avatar/users/" + avatar + ".png";
        }
        //return "http://www." + global.domain + "/gameApi/getGameConfigurationData.php?gameId=1234";
    },

    loadAvatarElite(avatar) {
        // return;

        console.log('avatar lang', this.language);
        var myUrl = this.getAvatarUrl(avatar);
        console.log(myUrl);
        var img = new Image();
        img.src = myUrl;
        var texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.handleLoadedTexture();
        this.avatarSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    },

    loadAvatar(avatar) {
        let self = this;
        let avatarUrl = this.getAvatarUrl(avatar);
        cc.loader.load({ url: avatarUrl, type: 'png' }, function (err, spriteContent) {
            if (!err) {
                let spriteFrame = new cc.SpriteFrame(spriteContent);
                self.avatarSprite.spriteFrame = spriteFrame;
                //let backgroundSprite = cc.director.getScene().getChildByName ('Canvas').getChildByName('PlayerAvatar').getComponent(cc.Sprite);
                //backgroundSprite.spriteFrame = spriteFrame;
            }
            else {
                console.log("Error loading avatar, loading default... ", err);
                self.loadDefaultAvatar();
            }
        });
    },

    setAvatar(spriteContent) {
        this.avatarSprite.spriteFrame = spriteFrame;
    },

    loadDefaultAvatar() {
        const titleSpriteSheetPath = global.gameSpriteSheet;
        let self = this;
        cc.loader.loadRes(titleSpriteSheetPath, cc.SpriteAtlas, function (err, atlas) {
            let defaultPlayerAvatarPath = "default_avatar";
            var spriteFrame = atlas.getSpriteFrame(defaultPlayerAvatarPath);

            self.avatarSprite.spriteFrame = spriteFrame;
        });
    },

    getAvatarSprite() {
        return this.avatarSprite.spriteFrame;
    },
});
