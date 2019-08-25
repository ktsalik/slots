angular
  .module('Slots', [])
  .controller('IndexController', ['$scope', function($scope) {
    var vm = this;

    vm.games = [];
    fetch('../data/games/metadata.json').then(function(response) {
      response.json().then(function(data) {
        data.games.forEach(function (game) {
          $scope.$apply(function() {
            vm.games.push(game);
          });
        });
      });
    });

    vm.play = function(game) {
      location.href = 'game.html?q=' + game.key;
    };
  }])
  .directive('game', function() {
    return {
      restrict: 'E',
      templateUrl: 'assets/templates/game-component.html',
      scope: {
        title: '=gameTitle',
        thumbnail: '=',
      },
      link: function(scope, element, attrs) {

      },
    };
  });