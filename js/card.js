class Card {
  constructor(cardObj, visible = false) {
    this.cardObj = cardObj;
    this.visible = visible;
    this.setVisible(visible);
  }

  isVisible() {
    return this.visible;
  }

  setVisible = bool => {
    this.visible = bool;
    if (this.visible) {
      this.cardObj.classList.add("show");
    } else {
      this.cardObj.classList.remove("show");
    }
  };

  static isEqual = (card1, card2) => {
    return (
      card1.cardObj.children[0].className ===
      card2.cardObj.children[0].className
    );
  };
}
