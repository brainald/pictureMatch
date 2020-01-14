const html = document.getElementsByTagName("html")[0];
const gameBoard = document.getElementsByClassName("gameBoard")[0];
const restart = document.getElementsByClassName("restart")[0];
const actualScore = document.getElementById("actualscore");
const bestScore = document.getElementById("score");
const stopper = document.getElementById("stopper");
const moves = document.getElementById("moves");

const tapSound = document.getElementById("tap");
const successSound = document.getElementById("success");
const tadaSound = document.getElementById("tada");

const stopperModal = document.getElementById("stopperModal");
const movesModal = document.getElementById("movesModal");

const ranger = document.getElementById("levelranger");
const rangespan = document.getElementById("rangevalue");
let level = ranger.value;
rangespan.textContent = level;

let isRestartClicked = false;

const createCardList = () => {
  let icons = faIcons.slice(0, faIcons.length - (faIcons.length - level));
  icons = [...icons, ...icons]; // duplicate
  let cards = icons.map(value => {
    let li = document.createElement("li");
    li.classList.add("card");
    let item = document.createElement("i");
    item.classList.add(faClass);
    item.classList.add(value);
    li.appendChild(item);
    return new Card(li, false);
  });
  return cards;
};

let cards = createCardList();
let game = new Game(cards);
game.start();

ranger.addEventListener("input", () => {
  level = ranger.value;
  rangespan.textContent = level;
  cards = createCardList();
  game.cards = cards;
  game.restart();
});

restart.addEventListener("click", () => {
  isRestartClicked = true;
  game.restart();
  isRestartClicked = false;
});
