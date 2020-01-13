const faClass = "fa";
const faIcons = [
  "fa-anchor",
  "fa-diamond",
  "fa-leaf",
  "fa-bomb",
  "fa-bolt",
  "fa-bicycle",
  "fa-paper-plane-o",
  "fa-cube",
  "fa-battery-empty",
  "fa-battery-full",
  "fa-bullhorn",
  "fa-car",
  "fa-birthday-cake",
  "fa-beer",
  "fa-globe",
  "fa-university",
  "fa-rocket",
  "fa-truck"
];

shuffle = array => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
