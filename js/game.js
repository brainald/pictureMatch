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

const level = 3;

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

class Game {
    constructor(cards) {
        this.myInterval = null;
        this.mySetTimeout = null;
        this.cards = cards;
        this.init();
    }

    init = () => {
        clearTimeout(this.mySetTimeout);
        this.twoCard = [];
        this.clickCounter = 0;
        this.timerTime = 0;
        this.firstClick = false;
        stopper.textContent = "00:00:00";
        stopperModal.textContent = "00:00:00";
    };

    start = () => {
        this.cards = shuffle(this.cards);
        this.addToGameBoard();
        this.setClickable(this.cards);
    };

    restart = () => {
        this.init();
        document.getElementsByTagName("ul")[0].remove();
        this.cards.forEach(element => {
            element.setVisible(false);
        });
        this.start();
        moves.textContent = 0;
        movesModal.textContent = 0;
        clearInterval(this.myInterval);
    };

    isFinished = () => {
        return this.cards.every(card => card.isVisible());
    };

    startStopper = () => {
        this.myInterval = setInterval(() => {
            this.timerTime++;
            let numOfHours = Math.floor(this.timerTime / 3600);
            let numOfMins = Math.floor((this.timerTime % 3600) / 60);
            let numOfSecs = Math.floor((this.timerTime % 3600) % 60);
            if (numOfHours < 10) numOfHours = "0" + numOfHours;
            if (numOfSecs < 10) numOfSecs = "0" + numOfSecs;
            if (numOfMins < 10) numOfMins = "0" + numOfMins;
            stopperModal.textContent = stopper.textContent =
                numOfHours + ":" + numOfMins + ":" + numOfSecs;
        }, 1000);
    };

    addToGameBoard = () => {
        let ul = document.createElement("ul");
        this.cards.forEach(card => {
            ul.appendChild(card.cardObj);
        });
        gameBoard.appendChild(ul);
    };

    setClickable = cards => {
        cards.forEach(card => {
            card.cardObj.onclick = () =>
                this.onClickHandelForCards(card, this.timeoutCallback); // callback for settimeout
        });
    };

    // https://gamedev.stackexchange.com/questions/43962/how-to-devise-a-scoring-algorithm-based-on-elapsed-time-and-number-of-moves
    getScore = () => {
        const minimumMoves = this.cards.length;
        const minimumTime = this.cards.length;
        const score =
            (minimumTime / this.timerTime) *
            (minimumMoves / this.clickCounter) *
            (minimumMoves * minimumTime * level); // harono
        return score;
    };

    timeoutCallback = () => {
        this.setClickable(this.twoCard);
        this.twoCard[0].setVisible(false);
        this.twoCard[1].setVisible(false);
        this.twoCard = [];
    };

    onClickHandelForCards = (card, timeoutCallback) => {
        if (!this.firstClick) {
            this.startStopper();
            this.firstClick = true;
        }

        if (this.twoCard.length < 2) {
            this.twoCard.push(card);
            card.setVisible(true);
            tapSound.play();

            card.cardObj.onclick = null; // disable onclick event until check eqaualiti twoCards

            movesModal.textContent = moves.textContent = ++this.clickCounter;
            if (this.isFinished()) {
                clearInterval(this.myInterval);
                actualscore.textContent = this.getScore().toFixed(2);

                // Open nav when finished game ---- from ./modal.js
                toggleClasses();
                showModal();
                showModalChildren();
                tadaSound.play();
            }

            if (
                this.twoCard.length === 2 &&
                !Card.isEqual(this.twoCard[0], this.twoCard[1])
            ) {
                this.mySetTimeout = setTimeout(() => {
                    timeoutCallback();
                }, 2000);
            } else if (
                this.twoCard.length === 2 &&
                Card.isEqual(this.twoCard[0], this.twoCard[1])
            ) {
                successSound.currentTime = 0;
                successSound.play();
                this.twoCard = [];
            }
        }
    };
}

let cards = createCardList();
let game = new Game(cards);
game.start();

restart.addEventListener("click", () => {
    game.restart();
});