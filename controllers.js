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
}]);

app.controller('Actions', ['$scope', function($scope) {
  $scope.buttons = [
    {name: "Deal", status: false},
    {name: "Hit", status: true},
    {name: "Stand", status: true}
  ];
  $scope.actions = function(button) {
    var buttons = $scope["buttons"];
    if (button === "Deal") {
      // buttons[0].status = true;
      // buttons[1].status = false;
      // buttons[2].status = false;
      changeStatus(buttons);
      firstDeal();
    } else if (button === "Hit") {
      dealCard(player);
    } else if (button === "Stand") {
      dealToDealer();
      // buttons[0].status = false;
      // buttons[1].status = true;
      // buttons[2].status = true;
      changeStatus(buttons);
    }
  }
}])
