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
  }, game);
  reelsController.reels.forEach(function(reel) {
    reel.setVisible(false);
  });

  game.resize();
  game.resize();
  reelsController.reels.forEach(function(reel) {
    reel.resize();
  })
});