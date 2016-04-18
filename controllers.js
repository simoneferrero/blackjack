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
