import busDriverImage from "../assets/images/games/busdriver.webp";
import ringOfFireImage from "../assets/images/games/ringoffire.webp";
import horseRaceImage from "../assets/images/games/horserace.webp";
import drunkDealerImage from "../assets/images/games/drunkDealer.webp";
import type { Game } from "../types/game.types";

// Define an interface for the complete games object
export interface Games {
  [key: string]: Game;
}

// Type the games object with the Games interface
export const games: Games = {
  fuckTheDealer: {
    name: "F*CK THE DEALER",
    image: drunkDealerImage,
    desc: "House doesn't always win.",
    minPlayers: 2,
    maxPlayers: 10,
    route: "fuckTheDealer",
    rules: [
      "Sit around a table in circular fashion, and each player choose a face down card from the deck.",
      "Whoever picked the lowest card (Twos are low, Aces are high) begins as the first dealer. No cards need to be dealt before the game begins.",
      "Dealer asks the first player (typically whoever is to their left to guess the number of the card from the top of the deck.",
      "Should they guess right, the dealer drinks (5) sips and the card is placed in the middle face up. The dealer asks the next person to guess the card number.",
      "Should they guess wrong, the dealer tells whether the card is higher or lower than the guessed card, the player guesses again.",
      "Should they guess right the dealer drinks (2) and the card is placed in the middle face up. The dealer asks the next person to guess the card number.",
      "Should they guess wrong the guesser drinks the difference between the guessed number and the actual card number, the card is placed in the middle and the turn moves to the next player.",
      "The dealer changes if 3 players in a row guess the wrong card.",
      "When 1/3 of the pack is left you can remove the second guess option if you like.",
    ],
  },
  busDriver: {
    name: "BUS DRIVER",
    image: busDriverImage,
    desc: "Have you driven the bus?",
    minPlayers: 2,
    maxPlayers: 6,
    route: "busDriver",
    rules: [
      "Make a pyramid of cards 5 at the bottom 1 at the top.",
      "Deal the rest of the pack between members equally.",
      "Flip the first card of the pyramid from the bottom.",
      "If you have the same number in hand that the pyramid currently turned card is, you can place your card on top of the card and deal X amount of sips",
      "Then turn the next card. Go one row at a time.",
      "The first row one card is worth 2 sips, the next row 4, the third row 6, etc...",
      "You don't have to play a card and can save it for the better rows.",
      "You can place multiple cards at the same time if you have them.",
      "Bus driver is the person with the most cards in the end of the game after top card of pyramid is played. Bus driver gets a bonus round.",
      "On ties deal single cards to tied players and the smallest card becomes bus driver",
      "BONUS ROUND: Make similar pyramid as in the start.",
      "The bus driver has to get to the top of pyramid without hitting J,Q,K,A.",
      "The bus driver opens one card of his choosing from each row of the pyramid.",
      "If the card is one of J,Q,K,A drink sips of the row number the card was on.",
      "Replace all cards and the bus driver goes back to the start.",
      "Repeat this until the bus driver chooses a card from each row without hitting a face card.",
    ],
  },
  ringOfFire: {
    name: "RING OF FIRE",
    image: ringOfFireImage,
    desc: "Don't burn yourself!",
    minPlayers: 2,
    maxPlayers: Infinity,
    route: "ringOfFire",
    rules: [
      "Gameplay:",
      "1. Drawing Cards: On each player's turn, they draw a card from the circle of cards. The action or rule associated with the drawn card must be followed.",
      "",
      "Card Rules:",
      "Ace (A): 'Waterfall' - The player who drew the card starts drinking, then the next player in the circle starts, and so on. Players can only stop drinking when the person before them stops.",
      "Two (2): 'You' - The player who drew the card points at another player, who must take a drink.",
      "Three (3): 'Me' - The player who drew the card must take a drink.",
      "Four (4): 'Floor' - All players must touch the floor. The last player to do so takes a drink.",
      "Five (5): 'Guys' - All male players take a drink.",
      "Six (6): 'Chicks' - All female players take a drink.",
      "Seven (7): 'Heaven' - All players must raise their hands. The last player to do so takes a drink.",
      "Eight (8): 'Mate' - The player who drew the card chooses another player to be their 'mate.' Whenever one drinks, both must drink.",
      "Nine (9): 'Rhyme' - The player who drew the card says a word, and players take turns saying words that rhyme with it. The first player who can't think of a rhyme or repeats a word drinks.",
      "Ten (10): 'Categories' - The player who drew the card chooses a category (e.g., types of beer). Players take turns naming items in that category. The first player who can't think of an item or repeats an item drinks.",
      "Jack (J): 'Make a Rule' - The player who drew the card creates a new rule that must be followed for the rest of the game. Anyone who breaks the rule drinks.",
      "Queen (Q): 'Question Master' - The player who drew the card becomes the Question Master. They can ask questions, and if another player answers any of their questions, that player must drink. This lasts until another Queen is drawn.",
      "King (K): 'King's Cup' - The first three players to draw a King pour some of their drink into the King's Cup. The player who draws the fourth King must drink the entire King's Cup.",
    ],
  },
  horseTrack: {
    name: "HORSE TRACK",
    image: horseRaceImage,
    desc: "Lets hit the tracks.",
    minPlayers: 1,
    maxPlayers: Infinity,
    route: "horseTrack",
    rules: [
      "The horseracing game requires active participation by only one person: the announcer.",
      "The announcer prepares the field by searching through the deck, taking out the ace (horse) of each suit, and laying them face-up and side by side at one end of the table (these are 'the gates'). ",
      "They then shuffle the deck and lay out a variable number of cards face-down (these form the 'links' of the race) in a straight line perpendicular to the row of aces.",
      "The cards thus appear to form an 'L' or the two legs of a right triangle. The field is now set.",
      "Before the game begins, each player makes bets based on their horse being as simple as 'five on diamonds'.",
      "The player has to drink 1/3 of his bet amount before the race starts as a pay in.",
      "Once all bets are in, the announcer begins the race.",
      "They flip over the top card of the remaining deck. Only the suit of this card matters; the ace of that suit moves forward to the first link.",
      "The announcer narrates the ebb and flow of the game as the betters cheer on their horse.",
      "The announcer continues flipping cards and advancing horses accordingly until one horse wins by passing the final link into the winner's circle.",
      "If all horses pass a link that link is flipped over. The horse that matches the suit that appears in the link will be pulled one link backwards. (Can't go back from starting position).",
      "The players who bet on the right horse can give out drinks equal to their bet amount to all the players who chose a losing horse.",
    ],
  },
  /*  biggerCard: {
    name: "CARD BATTLE",
    image: biggerCardImage,
    desc: "Need to get drunk fast?",
    minPlayers: 2,
    maxPlayers: 10,
    route: "cardBattle",
    rules: [
      "Simple. Shuffle deck and give one card to all participants.",
      "Lowest card number (in this case Ace is 1) has to drink the difference between the lowest and highest card.",
      "On tie give the tied players a card and continue until no ties occur.",
    ],
  },
  truthOrDare: {
    name: "TRUTH OR DARE",
    image: truthOrdareImage,
    desc: "What are you willing to do to hide your secrets?",
    minPlayers: 2,
    maxPlayers: Infinity,
    route: "truthOrDare",
    rules: [
      "Choose player to start.",
      "Player gets asked truth or dare.",
      "Player either completes truth or dare OR drinks 5 sips.",
      "Next players turn.",
    ],
  }, */
};
