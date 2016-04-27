app.controller('WelcomePage', ['$scope', function($scope) {
  $scope.intro = `<span>Simone's Casino</span><br />is proud to present:`
  $scope.title = `<span>SUPER</span> <span>AWESOME</span><br /><span><span>B</span><span>L</span><span>A</span><span>C</span><span>K</span><span>J</span><span>A</span><span>C</span><span>K</span>`;
  $scope.paragraph = `Welcome to my Blackjack web application:<br />
    May luck be in your favour!`;
  $scope.goToApp = function() {
    console.log("hello");
    $("#table")
      .fadeIn(1000);
  };
}]);

app.controller('Table', ['$scope', function($scope) {
  $scope.name = `<span>Simone's Casino</span>`
  $scope.title = `<span>SUPER</span> <span>AWESOME</span><br /><span><span>B</span><span>L</span><span>A</span><span>C</span><span>K</span><span>J</span><span>A</span><span>C</span><span>K</span>`;
  $scope.blackjack = `<span>PAYS 3 TO 2</span>`;
  $scope.insurance =  divideLetters("PAYS 2TO1 - INSURANCE - PAYS 2TO1");
// `<span>PAYS 2 TO 1 - INSURANCE - PAYS 2 TO 1</span>`;
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
    {name: "Deal", status: false, baseColour: "blue_darker", mainColour: "blue", radiantColour: "blue_radiant"},
    {name: "Hit", status: true, baseColour: "red_darker", mainColour: "red", radiantColour: "red_radiant"},
    {name: "Stand", status: true, baseColour: "purple_darker", mainColour: "purple", radiantColour: "purple_radiant"},
    {name: "Double", status: true, baseColour: "orange_darker", mainColour: "orange", radiantColour: "orange_radiant"},
    {name: "Split", status: true, baseColour: "brown_darker", mainColour: "brown", radiantColour: "brown_radiant"},
    {name: "Surrender", status: true, baseColour: "black_darker", mainColour: "black", radiantColour: "black_radiant"}
  ];
  $scope.actions = function(button) {
    var buttons = $scope["buttons"];
    if (button === "Deal") {
      // buttons[0].status = true;
      // buttons[1].status = false;
      // buttons[2].status = false;
      firstDeal();
      changeStatus(buttons);
      buttons[0].name = "Clear";
      if (player.total === 21) {
      $("#communications")
        .fadeIn(200);
        data["communications"] = "Blackjack!";
      }
    } else if (button === "Clear") {
      $("#communications")
        .fadeOut(200, function() {
          data["communications"] = "";
        });
        cleanTable();
        buttons[0].name = "Deal";
    } else if (button === "Hit") {
      dealCard(player);
      if (player.total > 21) {
        $("#communications")
          .fadeIn(200);
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
      $("#communications")
        .fadeIn(200);
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
