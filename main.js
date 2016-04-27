var app = angular.module("Blackjack", []);

function Card(name, value, image, deck) {
  this.name = name;
  this.value = value;
  this.image = image;
  this.deck = deck;
}

var data = {
  baseDeck: [],
  fullDeck: [],
  reshuffleCard: new Card("Reshuffle", 0, "cards/reshuffle.png"),
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
    createBaseDeck(i);
    tempArray.push(data["baseDeck"]);
  }
  data["fullDeck"] = [].concat.apply([], tempArray); //merges 6 decks together
  shuffle(data["fullDeck"]); //shuffles all cards
  for (var i = 0; i <= 4; i++) {
    data["fullDeck"].shift(); //removes first 5 cards from beginning of deck
  }
  var lastIndex = Math.floor(data["fullDeck"].length * 75 / 100);
  var randomIndex = Math.floor(Math.random() * (data["fullDeck"].length - lastIndex)) + lastIndex;
  data["fullDeck"].splice(randomIndex, 0, data["reshuffleCard"]); //inserts reshuffle card after 75% of the deck
  console.log(data["fullDeck"].length);
  console.log(randomIndex);
}

createFullDeck();

function Component() {
  this.cards = [];
  this.total = 0;
  this.countTot = function() {
    var cards = this.cards;
    this.total = 0;
    for (var i = 0; i < cards.length; i++) {
      this.total += cards[i].value;
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
  if (receiver.total <= 21) {
    var card = data["fullDeck"].shift();
    console.log(card);
    receiver["cards"].push(card);
    receiver.countTot();
    if (receiver.total > 21) {
      console.log("Busted!");
    }
  }
}

function dealToDealer() {
  if (dealer.total < 17) {
    dealCard(dealer);
    dealToDealer();
  }
}

function removeCards(whose) {
  whose["cards"].length = 0;
  whose["total"] = 0;
}

function cleanTable() {
  removeCards(dealer);
  removeCards(player);
}
function firstDeal() {
  dealCard(player);
  dealCard(dealer);
  dealCard(player);
}
$('#mydiv').find('input, textarea, button, select').attr('disabled','disabled');
function changeStatus(array) {
  array[0].status === false ? array[0].status = true : array[0].status = false;
  array[1].status === true ? array[1].status = false : array[1].status = true;
  array[2].status === true ? array[2].status = false : array[2].status = true;
}
//
// function changeStatus(array) {
//   if (array[0].status === false) {
//
//   }

function divideLetters(phrase) {
  var phrase = phrase.split(""),
    newPhrase = [];
  for (var i = 0; i < phrase.length; i++) {
    newPhrase.push("<span class='char" + i + "'>" + phrase[i] + "</span>");
  }
  return newPhrase.join("");
}
