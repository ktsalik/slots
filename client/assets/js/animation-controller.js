var AnimationController = function(reelsController) {
  var _this = this;

  this.animations = [];
  reelsController.reels.forEach(function(reel, i) {
    var animations = [];
    reel.symbols.forEach(function(symbol, j) {
      var animation = new PIXI.extras.AnimatedSprite(symbolAnimationTextures['symbol-1']);
      animation.animationSpeed = 0.25;
      animation.visible = false;
      var acSymbol = reelsController.reels[i].symbols[j];
      animation.x = acSymbol.x;
      animation.y = acSymbol.y;
      animations.push(animation);
    });
    _this.animations.push(animations);
  });

  reelsController.onStop = function() {
    if (window.hasWin) {
      _this.animations.forEach(function(reelColumn, i) {
        reelColumn.forEach(function(symbolAnim, j) {
          if (j === 0) return;
          if (Math.random() > 0.3) {
            symbolAnim.textures = symbolAnimationTextures[reelsController.reels[i].symbols[j].texture.textureCacheIds[0]];
            symbolAnim.visible = true;
            symbolAnim.gotoAndPlay(1);
          }
        });
      });
    }
  };

  reelsController.onSpin2 = function() {
    _this.animations.forEach(function (reelColumn, i) {
      reelColumn.forEach(function (symbolAnim, j) {
        symbolAnim.visible = false;
      });
    });
  };
};