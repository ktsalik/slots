var ReelsController = function(config) {
  var _this = this;

  this.reels = [];
  config.reels.forEach(function(reelConfig) {
    var reel = new Reel(reelConfig.positions, 140, 140, game);
    reel.setVisible(false);
    reel.x = reelConfig.x;
    reel.y = reelConfig.y;

    var stopValues = [];
    for (var i = 0; i < 4; i++) {
      var n = parseInt(Math.random() * 10) + 1;
      stopValues.push(n);
    }
    reel.setStopValues(stopValues);

    for (var i = 0; i < 100; i++) {
      var n = parseInt(Math.random() * 10) + 1;
      reel.spinValues.push(n);
      reel.spinValues.push(n);
      if (Math.random() > 0.5) {
        reel.spinValues.push(n);
      }
    }

    _this.reels.push(reel);
  });

  (function renderLoop() {
    _this.reels.forEach(function(reel) {
      reel.render();
    });
    requestAnimationFrame(renderLoop);
  })();

  var autoStop;
  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
      if (_this.reels[0].rolling) {
        clearTimeout(autoStop);
        _this.reels.forEach(function (reel) {
          reel.stop();
        });
      } else {
        _this.reels.forEach(function (reel) {
          reel.roll();
        });
        autoStop = setTimeout(function() {
          _this.reels.forEach(function(reel, i) {
            setTimeout(function() {
              reel.stop();
            }, i * 200);
          });
        }, 1500);
      }
    }
  })
};
