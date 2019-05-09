let rubySquareArray = [];

const colors = ['violet', 'orange', 'green', 'yellow'];

let commonSquareSize = 4;
let rotatingSquareSize = 2;


const rubySquare = document.querySelector('#ruby-square');
const commonSquareSizeSelect = document.querySelector('#common-square-size');
const rotatingSquareSizeSelect = document.querySelector('#rotating-square-size');
const searchButton = document.querySelector('#search-button');

commonSquareSizeSelect.value = commonSquareSize;
rotatingSquareSizeSelect.value = rotatingSquareSize;

rubySquareArray = getRubySquareArray(commonSquareSize);
drawRubySquare(rubySquareArray);

commonSquareSizeSelect.addEventListener('change', (e) => {
  commonSquareSize = Number(e.target.value);

  rubySquareArray = getRubySquareArray(commonSquareSize);
  drawRubySquare(rubySquareArray);
});

rotatingSquareSizeSelect.addEventListener('change', (e) => {
  rotatingSquareSize = Number(e.target.value);
});

rubySquare.addEventListener('click', (e) => {
  if (e.target === rubySquare) return;

  const square = e.target;
  const ids = square.id.split('-');

  const i = Number(ids[0]);
  const j = Number(ids[1]);

  const oldColor = colors[rubySquareArray[i][j].color];

  rubySquareArray[i][j].color = rubySquareArray[i][j].color === 3
    ? 0
    : rubySquareArray[i][j].color + 1;

  const newColor = colors[rubySquareArray[i][j].color];

  square.classList.replace(oldColor, newColor);
});

searchButton.addEventListener('click', () => {
  console.log('search', commonSquareSize, rotatingSquareSize);
});


/**
 * get ruby square array
 * 
 * @param {number} squareSize - side of square
 * @return {array} ruby square array
 */
function getRubySquareArray(squareSize) {
  const rubySquareArray = [];

  for (let i = 0; i < squareSize; ++i) {
    rubySquareArray[i] = [];

    const isTop = !Math.floor(i / (squareSize / 2));

    for (let j = 0; j < squareSize; ++j) {
      const isLeft = !Math.floor(j / (squareSize / 2));

      /* set color of square */
      let color;

      if (isTop && isLeft) color = 0;
      else if (isTop && !isLeft) color = 1;
      else if (isLeft) color = 2;
      else color = 3;

      rubySquareArray[i][j] = {
        color,
      };
    }
  }

  return rubySquareArray;
}


/**
 * draw ruby square
 * 
 * @param {array} rubySquareArray
 * @return {void}
 */
function drawRubySquare(rubySquareArray) {
  const length = rubySquareArray.length;

  rubySquare.innerHTML = '';
  rubySquare.style.width = `${50 * length}px`;

  for (let i = 0; i < length; ++i) {
    for (let j = 0; j < length; ++j) {
      const square = document.createElement('div');
      square.id = `${i}-${j}`
      square.classList.add('square');
      square.classList.add(colors[rubySquareArray[i][j].color]);
      rubySquare.appendChild(square);
    }
  }
}
