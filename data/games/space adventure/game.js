var game = new Game(window.gameKey, 1500, 640);
document.body.appendChild(game.view);

window.addEventListener('resize', function () {
  game.resize();
});

game.start({
  resources: [
    ['background', 'bg_game.jpg'],
    ['menu-background', 'bg_menu.jpg'],
    ['btn-menu-play', 'but_play_bg.png'],
    ['mask', 'mask_slot.png'],
    ['symbol-1', 'symbol-1.png'],
    ['symbol-2', 'symbol-2.png'],
    ['symbol-3', 'symbol-3.png'],
    ['symbol-4', 'symbol-4.png'],
    ['symbol-5', 'symbol-5.png'],
    ['symbol-6', 'symbol-6.png'],
    ['symbol-7', 'symbol-7.png'],
    ['symbol-8', 'symbol-8.png'],
    ['symbol-9', 'symbol-9.png'],
    ['symbol-10', 'symbol-10.png'],
    ['btn-spin', 'but_spin_bg.png'],
    ['btn-exit', 'but_exit.png'],
    ['btn-autoplay', 'but_maxbet_bg.png'],
  ],
}).then(function () {
  var background = game.sprite('background');
  var menuBackground = game.sprite('menu-background');
  var btnMenuPlay = game.sprite('btn-menu-play');
  btnMenuPlay._x = 600;
  btnMenuPlay._y = 470;
  btnMenuPlay.interactive = true;
  var btnMenuPlayText = new PIXI.Text('PLAY', {
    fontFamily: 'walibi',
    fontSize: 30,
    fill: '0xFFFFFF',
  });
  game.app.stage.addChild(btnMenuPlayText);
  btnMenuPlayText._x = 705;
  btnMenuPlayText._y = 535;
  btnMenuPlayText.fontSize = 30;

  var mask = game.sprite('mask');
  mask.visible = false;

  btnMenuPlay.on('click', function () {
    menuBackground.visible = false;
    btnMenuPlay.visible = false;
    btnMenuPlayText.visible = false;

    mask.visible = true;
    reelsController.reels.forEach(function(reel) {
      reel.setVisible(true);
    });
    btnSpin.visible = true;
    creditsText.visible = true;
    btnExit.visible = true;
    btnAutoplay.visible = autoplayText.visible = true;
  });

  var reelsController = new ReelsController({
    reels: [
      {
        positions: 3,
        x: 380,
        y: 117,
      },
      {
        positions: 3,
        x: 530,
        y: 117,
      },
      {
        positions: 3,
        x: 680,
        y: 117,
      },
      {
        positions: 3,
        x: 830,
        y: 117,
      },
      {
        positions: 3,
        x: 980,
        y: 117,
      },
    ],
    symbolCount: 10,
  }, game);
  reelsController.reels.forEach(function(reel) {
    reel.setVisible(false);
  });

  reelsController.onSpin = function(reelsState) {
    if (reelsState == 'stopped') {
      credits--;
      creditsText.text = 'CREDITS: ' + credits;
    }
    window.hasWin = Math.random() > 0.7;
    if (autoplay) {
      setTimeout(function() {
        reelsController.spin();
      }, 580 + 1000 + (window.hasWin ? 1000 : 0));
    }
  };

  var animationController;
  window.symbolAnimationTextures = [];
  new Promise(function(resolve) {
    var downloads = [];
    var sprites = {};
    for (var i = 1; i <= 10; i++) {
      downloads.push(new Promise(function(resolveDownload) {
        var img = new Image();
        img.src = '../data/games/' + window.gameKey + '/symbol_' + i + '_anim.png';
        img.onload = resolveDownload;
        sprites['symbol-' + i] = img;
      }));
    }
    Promise.all(downloads).then(function() {
      resolve(sprites);
    });
  }).then(function(sprites) {
    for (var key in sprites) {
      window.symbolAnimationTextures[key] = [];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 5; j++) {
          var frame = document.createElement('canvas');
          frame.width = 140;
          frame.height = 140;
          frame.getContext('2d').drawImage(sprites[key], j * 140, i * 140, 140, 140, 0, 0, 140, 140);
          var texture = PIXI.Texture.fromCanvas(frame);
          window.symbolAnimationTextures[key].push(texture);
        }
      }
    }

    animationController = new AnimationController(reelsController);
    animationController.animations.forEach(function(column) {
      column.forEach(function(a) {
        game.app.stage.addChild(a);
      });
    });
    reelsController.reels.forEach(function (reel, i) {
      reel.symbols.forEach(function (symbol, j) {
        animationController.animations[i][j].x = symbol.x;
        animationController.animations[i][j].y = symbol.y;
        animationController.animations[i][j].scale.x = symbol.scale.x;
        animationController.animations[i][j].scale.y = symbol.scale.y;
      });
    });
    var indexOfBtnSpin = game.app.stage.children.indexOf(c => c.id == 'btn-spin');
    game.app.stage.children.splice(indexOfBtnSpin, 1);
    game.app.stage.addChild(btnSpin);
  });

  var btnSpin = game.sprite('btn-spin');
  btnSpin.id = 'btn-spin';
  btnSpin.visible = false;
  btnSpin._x = 995;
  btnSpin._y = 510;
  btnSpin.interactive = true;
  btnSpin.on('click', function() {
    window.autoplay = false;
    reelsController.spin();
  });

  window.autoplay = false;
  var btnAutoplay = game.sprite('btn-autoplay');
  btnAutoplay.visible = false;
  btnAutoplay._x = 750;
  btnAutoplay._y = 570;
  btnAutoplay.interactive = true;
  btnAutoplay.on('click', function() {
    window.autoplay = !window.autoplay;
    if (window.autoplay)
    reelsController.spin();
  });

  var autoplayText = new PIXI.Text('AUTOPLAY', {
    fontFamily: 'walibi',
    fontSize: 22,
    fill: '0xFFFFFF',
  });
  autoplayText.visible = false;
  game.app.stage.addChild(autoplayText);
  autoplayText._x = 794;
  autoplayText._y = 579;
  autoplayText.fontSize = 22;

  var credits = 111;
  var creditsText = new PIXI.Text('CREDITS: ' + credits, {
    fontFamily: 'walibi',
    fontSize: 20,
    fill: '0xFFFFFF',
  });
  creditsText.visible = false;
  game.app.stage.addChild(creditsText);
  creditsText._x = 380;
  creditsText._y = 38;
  creditsText.fontSize = 20;

  var btnExit = game.sprite('btn-exit');
  btnExit.visible = false;
  btnExit._x = 1500 - 82;
  btnExit.interactive = true;
  btnExit.on('click', function() {
    location.href = '../client';
  });

  game.resize();
  game.resize();
  reelsController.reels.forEach(function(reel) {
    reel.resize();
  });

  window.addEventListener('resize', function() {
    reelsController.reels.forEach(function(reel) {
      reel.resize();
    });

    if (animationController) {
      reelsController.reels.forEach(function (reel, i) {
        reel.symbols.forEach(function (symbol, j) {
          animationController.animations[i][j].x = symbol.x;
          animationController.animations[i][j].y = symbol.y;
          animationController.animations[i][j].scale.x = symbol.scale.x;
          animationController.animations[i][j].scale.y = symbol.scale.y;
        });
      });
    }
  });
});