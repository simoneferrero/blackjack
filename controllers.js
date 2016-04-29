app.controller('WelcomePage', ['$scope', function($scope) {
  $scope.intro = `<span>Simone's Casino</span><br />is proud to present:`
  $scope.title = `<span>SUPER</span> <span>AWESOME</span><br /><span><span>B</span><span>L</span><span>A</span><span>C</span><span>K</span><span>J</span><span>A</span><span>C</span><span>K</span>`;
  $scope.paragraph = `Welcome to my Blackjack web application:<br />
    May luck be in your favour!`;
  $scope.goToApp = function() {
    $("#table")
      .fadeIn(1000);
    $("#bet input")
      .focus()
      .select();
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
    {name: "Deal", id:"deal", status: false, baseColour: "blue_darker", mainColour: "blue", radiantColour: "blue_radiant"},
    {name: "Hit", id:"hit", status: true, baseColour: "red_darker", mainColour: "red", radiantColour: "red_radiant"},
    {name: "Stand", id:"stand", status: true, baseColour: "purple_darker", mainColour: "purple", radiantColour: "purple_radiant"},
    {name: "Double", id:"double", status: true, baseColour: "orange_darker", mainColour: "orange", radiantColour: "orange_radiant"},
    {name: "Split", id:"split", status: true, baseColour: "brown_darker", mainColour: "brown", radiantColour: "brown_radiant"},
    {name: "Surrender", id:"surrender", status: true, baseColour: "black_darker", mainColour: "black", radiantColour: "black_radiant"}
  ];
  $scope.money = {
    reserve: 1000,
    buffer: 0,
    bet: 5,
    disable: false,
    // limits: /^([5-9]|[1-9]\d|100){1}(\.[0-9]{1,2})?$/ //aggiustare per togliere decimali a 100
    limits: /^([5-9]|[1-9]\d|100)$/, //no decimals
    wins: 0,
    losses: 0,
    ties: 0,
    blackjacks: 0
  };
  $scope.emptyReserve = function() {
    return noMoney($scope["money"].reserve, $scope["money"].bet);
  };
  $scope.actions = function(button) {
    var buttons = $scope["buttons"],
      money = $scope["money"];
    if (button === "Deal") {
      changeStatus(buttons);
      money.disable = true;
      money.buffer = money.bet;
      firstDeal();
      buttons[0].name = "Clear";
      if (player.total === 21) {
        $("#communications")
          .fadeIn(200);
        data["communications"] = "Blackjack!";
        money.blackjacks++;
      }
    } else if (button === "Clear") {
      $("#communications")
        .fadeOut(200, function() {
          data["communications"] = "";
          $("#bet input")
            .focus()
            .select();
        });
        cleanTable();
        money.disable = false;
        buttons[0].name = "Deal";
    } else if (button === "Hit") {
      dealCard(player);
      if (player.total > 21) {
        $("#communications")
          .fadeIn(200);
        data["communications"] = "Busted! You lose!";
        money.reserve -= money.buffer;
        money.losses++;
        changeStatus(buttons);
        if (money.reserve < 5) {
          console.log("no more money");
          $("#game_lost")
            .fadeIn(200);
        }
        console.log(`Wins: ${money.wins}
Losses: ${money.losses}
Ties: ${money.ties}
BlackJacks: ${money.blackjacks}`);
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
        money.reserve += Number(money.buffer);
        money.wins++;
      } else if (player.total === 21 && player.total === dealer.total && player["cards"].length === 2 && dealer["cards"].length > 2) {
        data["communications"] = "You win!";
        console.log("blackjack");
        money.reserve += (Number(money.buffer) * 1.5);
        money.wins++;
      } else if (player.total > dealer.total && player.total === 21 && player["cards"].length === 2) {
        data["communications"] = "You win!";
        console.log("blackjack");
        money.reserve += (Number(money.buffer) * 1.5);
        money.wins++;
      } else if (player.total > dealer.total) {
        data["communications"] = "You win!";
        money.reserve += Number(money.buffer);
        money.wins++;
      } else if (dealer.total > player.total || (player.total === 21 && player.total === dealer.total && dealer["cards"].length === 2 && player["cards"].length > 2)){
        data["communications"] = "You lose!";
        money.reserve -= money.buffer;
        money.losses++;
        if (money.reserve < 5) {
          console.log("no more money");
          $("#game_lost")
            .fadeIn(200);
        }
      } else {
        data["communications"] = "It's a tie!";
        money.ties++;
      }
      changeStatus(buttons);
      console.log(`Wins: ${money.wins}
Losses: ${money.losses}
Ties: ${money.ties}
BlackJacks: ${money.blackjacks}`);
    }
  }
}]);

app.controller('Communications', ['$scope', function($scope) {
  $scope.data = data;
}]);

app.controller('Money', ['$scope', function($scope) {
  $scope.money = money;
}]);
