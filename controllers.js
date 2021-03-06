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
    new Button("Deal", "deal", false, "blue_darker", "blue", "blue_radiant"),
    new Button("Hit", "hit", true, "red_darker", "red", "red_radiant"),
    new Button("Stand", "stand", true, "purple_darker", "purple", "purple_radiant"),
    new Button("Double", "double", true, "orange_darker", "orange", "orange_radiant"),
    new Button("Split", "split", true, "brown_darker", "brown", "brown_radiant"),
    new Button("Surrender", "surrender", true, "black_darker", "black", "black_radiant")
  ];
  $scope.money = {
    reserve: 1000,//initial player money
    bet: 5,//suggested player bet
    disable: false,//used to enable or disable bet field
    // limits: /^([5-9]|[1-9]\d|100){1}(\.[0-9]{1,2})?$/ //aggiustare per togliere decimali a 100
    limits: /^([5-9]|[1-9]\d|100)$/, //no decimals
    wins: 0,
    losses: 0,
    ties: 0,
    doubles: 0,
    surrenders: 0,
    blackjacks: 0
  };
  $scope.logGame = function() {
    var money = $scope["money"];
    console.log(`Wins: ${money.wins}
Losses: ${money.losses}
Ties: ${money.ties}
Doubles: ${money.doubles}
Surrenders: ${money.surrenders}
BlackJacks: ${money.blackjacks}`);
  };
  $scope.emptyReserve = function() {
    return noMoney($scope["money"].reserve, $scope["money"].bet);
  };
  $scope.actions = function(button) {
    var buttons = $scope["buttons"],
      money = $scope["money"];
    if (button === "Deal" && buttons[0].active === true) {
      changeStatus(buttons);//deactivates this button and activates others
      money.disable = true;//locks bet input
      firstDeal();
      if (player.total === 21 || dealer.total === 21) {//checks if anyone has blackjack
        $("#communications")
          .fadeIn(200);
        if (player.total === 21 && dealer.total === 21) {
          data["communications"] = "It's a tie!";
          money.ties++;
          money.blackjacks++;
        } else if (player.total === 21 && dealer.total != 21) {
          data["communications"] = "Blackjack! You win!";
          money.reserve += (Number(money.bet) * 1.5);
          money.blackjacks++;
          money.wins++;
        } else if (player.total != 21 && dealer.total === 21) {
          data["communications"] = "You lose!";
          money.reserve -= money.bet;
          money.losses++;
          $scope.emptyReserve();
          if (money.reserve < 5) {
            console.log("no more money");
            $("#game_lost")
              .fadeIn(200);
          }
        }
        changeStatus(buttons);
        $scope.logGame();
      } else {//if nobody has blackjack, changes the second card of the dealer to a back with 0 value
        dealer.storedCard = dealer.cards[1];
        dealer.cards[1] = data.back;
        if (dealer.cards[0].value === 1) {
          dealer.cards[0].value = 11;//changes value of Ace back to 11 to not give up the other card
        }
        dealer.countTot();
        setTimeout(function() {
          $("#dealer > .card:nth-child(2)")
            .addClass("facedown");
        }, 1);
        enableButton(buttons[3]);
        enableButton(buttons[5]);
      }
      if (data["reshuffle"] === true) {//changes button name
        buttons[0].name = "Shuffle";
      } else {
        buttons[0].name = "Clear";
      }
    } else if (button === "Clear") {
      cleanTable();//removes all cards
      $("#communications")
        .fadeOut(200, function() {
          data["communications"] = "";//resets communications
          $("#bet input")//gives focus to bet input
            .focus()
            .select();
        });
        money.disable = false;//reenables bet input
        buttons[0].name = "Deal";//returns to original name
    } else if (button === "Shuffle") {
      setTimeout(function() {
        buttons[0].active = true;//reenable button after shuffling because of stupid Angular
      }, 1400);
      buttons[0].active = false; //disable button while shuffling because of stupid Angular
      data["reshuffle"] = false;//prevents name from changing to reshuffle again
      createFullDeck();//reshuffles deck
      cleanTable();//same as clear
      buttons[0].name = "Deal";//same as clear
      money.disable = false;//same as clear
      $("#bet input")//same as clear
        .focus()
        .select();
      $("#communications")
        .fadeOut(200, function() {
          data["communications"] = "";
          $("#reshuffle")
            .fadeIn(200)
            .delay(1000)
            .fadeOut(200);
        });
    } else if (button === "Hit") {
      disableButton(buttons[3]);
      disableButton(buttons[5]);
      dealCard(player);
      if (data["reshuffle"] === true) {
        buttons[0].name = "Shuffle";//same as deal
      }
      if (player.total > 21) {
        $("#communications")
          .fadeIn(200);
        data["communications"] = "Busted! You lose!";
        uncoverCard();
        money.reserve -= money.bet;//takes money from reserve
        money.losses++;
        $scope.emptyReserve();
        changeStatus(buttons);
        $scope.logGame();
        if (money.reserve < 5) {
          $("#game_lost")//ends game
            .fadeIn(200);
        }
      }
    } else if (button === "Stand") {
      disableButton(buttons[3]);
      disableButton(buttons[5]);
      uncoverCard();
      dealToDealer();//it will add cards only if tot is not already >=17
      if (data["reshuffle"] === true) {
        buttons[0].name = "Shuffle";
      }
      $("#communications")
        .fadeIn(200);
      if (dealer.total > 21) {//if dealer busted
        data["communications"] = "Dealer busted! You win!";
        money.reserve += Number(money.bet);
        money.wins++;
      } else if (player.total > dealer.total) {//if player higher than dealer
        data["communications"] = "You win!";
        money.reserve += Number(money.bet);
        money.wins++;
      } else if (player.total < dealer.total) {//if dealer higher than player
        data["communications"] = "You lose!";
        money.reserve -= money.bet;
        money.losses++;
        $scope.emptyReserve();
        if (money.reserve < 5) {
          console.log("no more money");
          $("#game_lost")
            .fadeIn(200);
        }
      } else {//if push
        data["communications"] = "It's a tie!";
        money.ties++;
      }
      changeStatus(buttons);
      $scope.logGame();
    } else if (button === "Double") {
      money.doubles++;
      money.bet *= 2;
      dealCard(player);
      setTimeout(function() {
        $("#player > .card:nth-child(3)")
          .addClass("doubledown");
      }, 1);
      disableButton(buttons[3]);
      disableButton(buttons[5]);
      changeStatus(buttons);
      $("#communications")
        .fadeIn(200);
      if (player.total > 21) {
        data["communications"] = "Busted! You lose!";
        uncoverCard();
        money.reserve -= money.bet;
        money.losses++;
      } else {
        uncoverCard();
        dealToDealer();
        if (dealer.total > 21) {
          data["communications"] = "Dealer busted! You win!";
          money.reserve += Number(money.bet);
          money.wins++;
        } else if (player.total > dealer.total) {
          data["communications"] = "You win!";
          money.reserve += Number(money.bet);
          money.wins++;
        } else if (player.total < dealer.total) {
           data["communications"] = "You lose!";
           money.reserve -= money.bet;
           money.losses++;
        } else {
          data["communications"] = "It's a tie!";
          money.ties++;
        }
      }
      $scope.emptyReserve();
      $scope.logGame();
      if (money.bet > 100) {
        money.bet /= 2;
      }
      if (data["reshuffle"] === true) {
        buttons[0].name = "Shuffle";
      }
      if (money.reserve < 5) {
        $("#game_lost")//ends game
          .fadeIn(200);
      }
    } else if (button === "Surrender") {
      $("#communications")
        .fadeIn(200);
      data["communications"] = "You surrender!";
      uncoverCard();
      money.reserve -= (Number(money.bet) * 0.5);
      money.surrenders++;
      $scope.emptyReserve();
      changeStatus(buttons);
      disableButton(buttons[3]);
      disableButton(buttons[5]);
      $scope.logGame();
      if (money.reserve < 5) {
        console.log("no more money");
        $("#game_lost")
          .fadeIn(200);
      }
    }
  }
}]);

app.controller('Communications', ['$scope', function($scope) {
  $scope.data = data;
}]);

app.controller('Money', ['$scope', function($scope) {
  $scope.money = money;
}]);
