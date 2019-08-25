PIXI.utils.skipHello();

class Game {
  constructor(gameKey, width, height) {
    this.app = new PIXI.Application({
      // forceCanvas: true,
    });
    this.view = this.app.view;
    this.key = gameKey;
    this.width = width;
    this.height = height;
    this.ratio = width / height;
    // document.body.appendChild(app.view);
    // app.view.width = document.body.offsetWidth;
    // app.view.height = document.body.offsetHeight;
  }

  start(config) {
    var _this = this;
    return new Promise(function(resolve) {
      var resources = config.resources;
      resources.forEach(function (resource) {
        _this.app.loader.add(resource[0], '../data/games/' + _this.key + '/' + resource[1]);
      });
      _this.app.loader.load(function () {
        document.querySelector('[loading]').remove();
        resolve();
      });
    });
  }

  resize() {
    var _this = this;
    var width, height;
    // if (document.body.offsetWidth < document.body.offsetHeight) {
      width = document.body.offsetWidth;
      height = document.body.offsetWidth / this.ratio;
      this.app.renderer.resize(width, height);
    // } else {
    //   width = document.body.offsetHeight * this.ratio;
    //   height = document.body.offsetHeight;
    //   this.app.renderer.resize(width, height);
    // }

    this.app.stage.children.forEach(function(component) {
      if (component.constructor == PIXI.Sprite) {
        component.scale.x = _this.view.width / _this.width;
        component.scale.y = _this.view.height / _this.height;
      }
      component.x = ((component._x || 0) * _this.view.width) / _this.width;
      component.y = ((component._y || 0) * _this.view.height) / _this.height;

      if (component.constructor == PIXI.Text) {
        component.style.fontSize = (component.fontSize * _this.view.height) / _this.height;
      }
    });

    this.view.style.position = 'absolute';
    this.view.style.left = (document.body.offsetWidth - this.view.width) / 2 + 'px';
    this.view.style.top = (document.body.offsetHeight - this.view.height) / 2 + 'px';
  }

  sprite(resourceKey) {
    var sprite = new PIXI.Sprite(this.app.loader.resources[resourceKey].texture);
    this.app.stage.addChild(sprite);
    return sprite;
  }
}