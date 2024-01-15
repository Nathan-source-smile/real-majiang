import GlobalData from "./Common/GlobalData";

export const loadImgAtlas = () => {
  return new Promise((resolve, reject) => {
    cc.resources.load(
      "images/timer",
      cc.SpriteAtlas,
      function (err, timerAtlas) {
        if (err) {
          console.log("Error loading timer atlas", err);
          // reject();
          return;
        }
        console.log("Loaded timer atlas successfully!");
        GlobalData.timerAtlas = timerAtlas;
        // resolve();
      }
    );
    cc.resources.load(
      "images/shuffle",
      cc.SpriteAtlas,
      function (err, shuffleAtlas) {
        if (err) {
          console.log("Error loading timer atlas", err);
          // reject();
          return;
        }
        console.log("Loaded timer atlas successfully!");
        GlobalData.shuffleAtlas = shuffleAtlas;
        // resolve();
      }
    );
    cc.resources.load(
      "images/main",
      cc.SpriteAtlas,
      function (err, imgAtlas) {
        if (err) {
          console.log("Error loading image atlas", err);
          reject();
          return;
        }
        console.log("Loaded image atlas successfully!");
        GlobalData.imgAtlas = imgAtlas;
        resolve();
      }
    );
  });
};
