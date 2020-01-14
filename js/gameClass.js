class Game {
  constructor(cards) {
    this.myInterval = null;
    this.mySetTimeout = null;
    this.cards = cards;
    this.init();
  }

  clearAllCardsClasses() {
    this.cards.forEach(card => {
      card.cardObj.classList.remove("matched");
      card.cardObj.classList.remove("unmatched");
      card.cardObj.classList.add("cardHover");
    });
  }

  init = () => {
    let cols = document.getElementsByClassName("card");

    html.style.setProperty("--bgcolor1", level * 22.5);

    if (!isRestartClicked) {
      if (level > 10) {
        gameBoard.style.width = "100%";
      } else {
        gameBoard.style.width = "65%";
      }
    }

    clearTimeout(this.mySetTimeout);
    this.clearAllCardsClasses();
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

  /**
   * @param {string} command         Now only 'add' or 'remove'.
   * @param {string} className       A CSS class name.
   */
  manageStyleClassToCards(command, classname) {
    if (command === "remove") {
      this.twoCard[0].cardObj.classList.remove(classname);
      this.twoCard[1].cardObj.classList.remove(classname);
    } else if (command === "add") {
      this.twoCard[0].cardObj.classList.add(classname);
      this.twoCard[1].cardObj.classList.add(classname);
    } else {
      new Error("Command '" + command + "' is not implemeted yet!");
    }
  }

  timeoutCallback = () => {
    this.setClickable(this.twoCard);
    this.twoCard[0].setVisible(false);
    this.twoCard[1].setVisible(false);
    this.manageStyleClassToCards("remove", "unmatched");
    this.manageStyleClassToCards("add", "cardHover");
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
      card.cardObj.classList.remove("cardHover");
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
        this.manageStyleClassToCards("add", "unmatched");
        this.mySetTimeout = setTimeout(() => {
          timeoutCallback();
        }, 2000);
      } else if (
        this.twoCard.length === 2 &&
        Card.isEqual(this.twoCard[0], this.twoCard[1])
      ) {
        this.manageStyleClassToCards("add", "matched");
        successSound.currentTime = 0;
        successSound.play();
        this.twoCard = [];
      }
    }
  };
}
