app.controller('WelcomePage', ['$scope', function($scope) {
  $scope.intro = `<span>Simone's Casino</span> is proud to present`
  $scope.title = 'SUPER AWESOME BLACKJACK';
  $scope.paragraph = `Welcome to my Blackjack web application!<br />
    Choose how much you want to start with and, as always...<br />
    Winner, winner, chicken dinner!`;
  $scope.goToApp = function() {
    console.log("hello");
    $("#table")
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
      data["communications"] = "";
      changeStatus(buttons);
      firstDeal();
      if (player.total === 21) {
        data["communications"] = "Blackjack!";
      }
    } else if (button === "Hit") {
      dealCard(player);
      if (player.total > 21) {
        data["communications"] = "Busted! You lose!";
        changeStatus(buttons);
      } else {
        data["communications"] = "";
      }
    } else if (button === "Stand") {
      dealToDealer();
      // buttons[0].status = false;
      // buttons[1].status = true;
      // buttons[2].status = true;
      if (dealer.total > 21) {
        data["communications"] = "Dealer busted! You win!";
      } else if (player.total > dealer.total || (player.total === 21 && player.total === dealer.total && player["cards"].length === 2 && dealer["cards"].length > 2)) {
        data["communications"] = "You win!";
      } else if (dealer.total > player.total || (player.total === 21 && player.total === dealer.total && dealer["cards"].length === 2 && player["cards"].length > 2)){
        data["communications"] = "You lose!";
      } else {
        data["communications"] = "It's a tie!";
      }
      changeStatus(buttons);
    }
  }
}])

app.controller('Communications', ['$scope', function($scope) {
  $scope.data = data;
}])
