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
  reshuffleCard: new Card("Reshuffle", 0, "reshuffle.png")
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
      var img = name.split(" ").join("").toLowerCase() + ".png";
      if (ranks[j] === "Ace") {
        var newCard = new Card(name, 1, img, deck);
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

var dealer = {
  cards: [],
  total: 0
}

var player = {
  cards: [],
  total: 0
}

function dealCard(receiver) {
  if (receiver.total <= 21) {
    var card = data["fullDeck"].shift();
    console.log(card);
    receiver["cards"].push(card);
    receiver["total"] += card.value;
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
