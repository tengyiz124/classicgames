// --- Simplified Solitaire --- //

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const board = document.getElementById('game-board');

let deck = [];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function displayCards() {
  board.innerHTML = '';
  deck.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    if (card.suit === '♥' || card.suit === '♦') {
      cardEl.classList.add('red');
    }
    cardEl.textContent = `${card.value}${card.suit}`;
    cardEl.draggable = true;
    cardEl.style.position = 'relative';

    // Drag events
    cardEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
    });

    cardEl.addEventListener('dragover', (e) => e.preventDefault());
    cardEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData('text/plain');
      const toIndex = index;
      [deck[fromIndex], deck[toIndex]] = [deck[toIndex], deck[fromIndex]];
      displayCards();
    });

    board.appendChild(cardEl);
  });
}

function startGame() {
  createDeck();
  shuffleDeck();
  displayCards();
}

startGame();
