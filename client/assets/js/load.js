function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var gameKey = getUrlParameter('q');

var gameScript = document.createElement('script');
window.gameKey = gameKey;
gameScript.src = '/data/games/' + gameKey + '/game.js';
document.body.appendChild(gameScript);
gameScript.onload = function () {
  
};