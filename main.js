var app = angular.module("Blackjack", []);

function Card(name, value, image, deck) {
  this.name = name;
  this.value = value;
  this.image = image;
  this.deck = deck;
  this.upside = false; //if false, value = 0 and image = back
}

function Button(name, id, status, baseColour, mainColour, radiantColour) {
  this.name = name;
  this.id = id;
  this.status = status;
  this.active = true;
  this.baseColour = baseColour;
  this.mainColour = mainColour;
  this.radiantColour = radiantColour;
}

var data = {
  baseDeck: [],
  fullDeck: [],
  reshuffleCard: new Card("Reshuffle", 0, "cards/reshuffle.png"),
  reshuffle: false,
  back: new Card("Back", 0, "cards/back.png"),
  communications: ""
}

function shuffle(deck) {
  var randomIndex, currentCard;
  for (var i = deck.length; i > 0; i--) {
    randomIndex = Math.floor(Math.random() * i); //finds random index between remaining elements
    currentCard = deck[i - 1]; //saves current element value
    deck[i - 1] = deck[randomIndex]; //changes current element with random
    deck[randomIndex] = currentCard; //changes random element with current
  }
  for (var i = 0; i <= 5; i++) {
    deck.shift(); //removes first 5 cards from beginning of deck
  }
  var lastIndex = Math.floor(deck.length * 75 / 100);//selects index at 75% of deck
  var randomIndex = Math.floor(Math.random() * (deck.length - lastIndex)) + lastIndex;//picks random index after 75%
  // var lastIndex = Math.floor(deck.length * 25 / 100);//for quicker testing
  // var randomIndex = lastIndex;//for quicker testing
  deck.splice(randomIndex, 0, data["reshuffleCard"]); //inserts reshuffle card at random index
}

function createBaseDeck(deck) {
  data["baseDeck"] = [];
  var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  var ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
  for (var i = 0; i < suits.length; i++) { //first loop for suits
    for (var j = 0; j < ranks.length; j++) { //second loop for ranks
      var name = ranks[j] + " of " + suits[i];
      var img = "cards/" + name.split(" ").join("").toLowerCase() + ".png";
      if (ranks[j] === "Ace") {
        var newCard = new Card(name, 11, img, deck);
      } else if (ranks[j] === "Jack" || ranks[j] === "Queen" || ranks[j] === "King") {
        var newCard = new Card(name, 10, img, deck);
      } else {
        var newCard = new Card(name, ranks[j], img, deck); //creates new card
      }
      data["baseDeck"].push(newCard); //pushes new card in deck
    }
  }
}

function createFullDeck() {
  var tempArray = [];
  for (var i = 0; i < 6; i++) {
  // for (var i = 0; i < 1; i++) {//for quicker testing
    createBaseDeck(i);
    tempArray.push(data["baseDeck"]);
  }
  data["fullDeck"] = [].concat.apply([], tempArray); //merges 6 decks together
  shuffle(data["fullDeck"]); //shuffles all cards
}

createFullDeck();

function Component() {
  this.cards = [];
  this.total = 0;
  this.countTot = function() {//called by dealCard()
    var cards = this.cards;
    this.total = 0;//resets total
    for (var i = 0; i < cards.length; i++) {
      this.total += cards[i].value;//adds value of card to total for each of cards
    }
    if (this.total > 21) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].value === 11 && this.total > 21) { //checks if there are Aces in hand and sum is still higher than 21
          this.total -= cards[i].value; //removes the value from sum
          cards[i].value = 1; //changes value of Ace from 11 to 1
          this.total += cards[i].value; //updates sum with new value
        }
      }
    }
    return this.total;
  };
}

var dealer = new Component();

var player = new Component();

function dealCard(receiver) {
  if (receiver.total <= 21) {//doesn't work if busted
    var card = data["fullDeck"].shift();//draws card from deck
    if (card.name === "Reshuffle") {
      data["reshuffle"] = true;//used to change button
      card = data["fullDeck"].shift();//draws new card
    }
    receiver["cards"].push(card);//pushes card in hand
    receiver.countTot();//calls for sum of value
  }
}

function dealToDealer() {
  if (dealer.total < 17) {
    dealCard(dealer);
    dealToDealer();//recursive until total is >=17
  }
}

function removeCards(whose) {
  whose["cards"].length = 0;//empties array
  whose["total"] = 0;//resets total
}

function cleanTable() {
  removeCards(dealer);
  removeCards(player);
}

function firstDeal() {
  dealCard(player);
  dealCard(dealer);
  dealCard(player);
  //eventually deal one more facedown card to dealer
}


function changeStatus(array) {
  array[0].status === false ? array[0].status = true : array[0].status = false;
  array[1].status === true ? array[1].status = false : array[1].status = true;
  array[2].status === true ? array[2].status = false : array[2].status = true;
}

function divideLetters(phrase) {
  var phrase = phrase.split(""),//separates phrase characters
    newPhrase = [];
  for (var i = 0; i < phrase.length; i++) {
    newPhrase.push("<span class='char" + i + "'>" + phrase[i] + "</span>");//encases each character in span and gives unique class
  }
  return newPhrase.join("");//reforms phrase
}

function noMoney(reserve, bet) {
  if (reserve - bet < 0) {//displays banner if money is not enough to bet, called by controller
    $("#reserve span:nth-child(2)").css("display", "none");
    $("#reserve span:nth-child(3)").css("display", "inline-block");
  } else {
    $("#reserve span:nth-child(2)").css("display", "inline-block");
    $("#reserve span:nth-child(3)").css("display", "none");
  }
}
