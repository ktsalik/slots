var Reel = function(positions, symbolCount, symbolWidth, symbolHeight, game) {
  this.positions = positions;
  this.stopValues = [];
  this.spinValues = [];
  this._spinValues = [];
  this.values = [];
  this.offset = 0;
  this.rolling = false;
  this.stopping = false;

  this.symbolWidth = symbolWidth;
  this.symbolHeight = symbolHeight;
  this.symbolCount = symbolCount;

  this.container = new PIXI.Container();
  game.app.stage.addChild(this.container);
  this.symbols = [];

  for (var i = 0; i < positions + 1; i++) {
    var symbol = new PIXI.Sprite();
    this.symbols.push(symbol);
    this.container.addChild(symbol);
    // game.app.stage.addChild(symbol);
  }

  this.mask = new PIXI.Graphics();
  game.app.stage.addChild(this.mask);
  this.container.mask = this.mask;

  this.game = game;

  this.resize();
};

Reel.prototype.setStopValues = function(values) {
  this.stopValues = values;
  var symbols = this.symbols;
  values.forEach(function(symbol, i) {
    symbols[i].setTexture(game.app.loader.resources['symbol-' + symbol].texture);
  });
};

Reel.prototype.resize = function() {
  var symbolWidth = this.symbolWidth;
  var symbolHeight = this.symbolHeight;
  var game = this.game;
  var _this = this;
  this.symbols.forEach(function(symbol, i) {
    symbol.width = (symbolWidth * game.app.view.width) / game.width;
    symbol.height = (symbolHeight * game.app.view.height) / game.height;
    symbol.x = (_this.x * game.app.view.width) / game.width;
    symbol.y = (symbol.height * (i - 1)) + (_this.y * game.app.view.height) / game.height;
  });
  var m = this.mask;
  m.x = (_this.x * game.app.view.width) / game.width;
  m.y = (_this.y * game.app.view.height) / game.height;
  m.clear();
  m.beginFill(0x000000);
  m.drawRect(0, 0, this.symbols[0].width, this.symbols[0].height * this.positions);
  m.endFill();
};

Reel.prototype.setVisible = function(visible) {
  this.symbols.forEach(function(symbol) {
    symbol.visible = visible;
  });
};

Reel.prototype.render = function() {
  var _this = this;
  if (this.rolling) {
    this.offset += this.symbols[0].height * 0.2;
    if (this.offset > this.symbols[0].height) {
      this.offset = 0;
      this.values.unshift(this._spinValues.pop());
      this.values.splice(-1, 1);
      if (!isNaN(parseInt(this.stopping))) {
        this.stopping++;
      }
    }

    if (this.stopping == this.positions) {
      this.rolling = false;
      this.stopping++;
      // this.stopping = false;
      var o = {
        _offset: _this.symbols[0].height * 0.33,
      };
      anime({
        targets: o,
        _offset: 0,
        duration: 150,
        easing: 'easeOutQuint',
        update: function () {
          _this.offset = o._offset;
          for (var i = 0; i < _this.symbols.length; i++) {
            var symbol = _this.symbols[i];
            symbol.y = (symbol.height * (i - 1)) + ((_this.y + _this.offset) * game.app.view.height) / game.height;
          }
        },
        complete: function() {
          setTimeout(function() {
            _this.stopping = false;
          }, 100);
        },
      });
    }

    for (var i = 0; i < this.symbols.length; i++) {
      var symbol = this.symbols[i];
      symbol.y = (symbol.height * (i - 1)) + ((this.y + this.offset) * game.app.view.height) / game.height;
      symbol.setTexture(this.game.app.loader.resources['symbol-' + this.values[i]].texture);
    }
  }
};

Reel.prototype.roll = function() {
  this.rolling = true;
  if (!this.values.length) {
    this.values = this.stopValues.slice(0);
  }
  this._spinValues = this.spinValues.slice(0);
};

Reel.prototype.stop = function() {
  // this.rolling = false;
  this.stopping = 0;
  this.stopValues = this.values.slice(0);
  var spinValues = [];
  for (var i = 0; i < 100; i++) {
    var n = parseInt(Math.random() * this.symbolCount) + 1;
    spinValues.push(n);
    spinValues.push(n);
    if (Math.random() > 0.5) {
      spinValues.push(n);
    }
  }
  this.spinValues = spinValues;
};