app.controller('WelcomeCtrl', ['$scope', function($scope) {
  $scope.title = 'Blackjack';
  $scope.paragraph = `Welcome to my Blackjack web application!<br />
    I wish you good luck and... Winner, winner, chicken dinner!`;
  $scope.goToApp = function() {
    console.log("hello");
    $("#prova")
      .fadeIn(1500);
  };
}]);

app.controller('Dealer', ['$scope', function($scope) {
  $scope.user = dealer;
  $scope.cards = $scope["user"].cards;
}]);

app.controller('Player', ['$scope', function($scope) {
  $scope.user = player;
  $scope.cards = $scope["user"].cards;
  $scope.deal = function() {
    return dealCard(player);
  };
  $scope.stay = function() {
    return dealToDealer();
  }
}]);
