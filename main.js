let rubySquareArray = [];

const initialOutputText = 'To see the solution, click the search button';
const colors = ['violet', 'orange', 'green', 'yellow'];

let commonSquareSize = 4;
let rotatingSquareSize = 2;


const rubySquare = document.querySelector('#ruby-square');

const commonSquareSizeSelect = document.querySelector('#common-square-size');
const rotatingSquareSizeSelect = document.querySelector('#rotating-square-size');
const searchButton = document.querySelector('#search-button');

const outputText = document.querySelector('#output-text');
const outputSolution = document.querySelector('#output-solution');

commonSquareSizeSelect.value = commonSquareSize;
rotatingSquareSizeSelect.value = rotatingSquareSize;

rubySquareArray = getRubySquare(commonSquareSize);
drawRubySquare(rubySquareArray, rotatingSquareSize);

outputText.innerText = initialOutputText;

commonSquareSizeSelect.addEventListener('change', (e) => {
  commonSquareSize = Number(e.target.value);

  rubySquareArray = getRubySquare(commonSquareSize);
  drawRubySquare(rubySquareArray, rotatingSquareSize);
});

rotatingSquareSizeSelect.addEventListener('change', (e) => {
  rotatingSquareSize = Number(e.target.value);

  drawRubySquare(rubySquareArray, rotatingSquareSize);
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
  searchButton.disabled = true;
  commonSquareSizeSelect.disabled = true;
  rotatingSquareSizeSelect.disabled = true;

  const solution = findSolution(rubySquareArray);
  drawSolution(solution, rotatingSquareSize);

  searchButton.disabled = false;
  commonSquareSizeSelect.disabled = false;
  rotatingSquareSizeSelect.disabled = false;
});


/**
 * get ruby square array
 * 
 * @param {number} squareSize - side of square
 * @return {array} ruby square array
 */
function getRubySquare(squareSize) {
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
 * @param {number} rotatingSquareSize
 * @return {void}
 */
function drawRubySquare(rubySquareArray, rotatingSquareSize) {
  const length = rubySquareArray.length;

  rubySquare.innerHTML = '';
  rubySquare.style.width = `${50 * length + 2 * length}px`;

  const rotatingSquare = document.createElement('div');
  rotatingSquare.classList.add('rotating-square');
  rotatingSquare.style.width = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;
  rotatingSquare.style.height = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;

  rubySquare.appendChild(rotatingSquare);

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

/**
 * draw solution
 * 
 * @param {object} solution
 * @param {number} rotatingSquareSize
 * @return {void}
 */
function drawSolution(solution, rotatingSquareSize) {
  if (solution.error) {
    // do smth
  }

  outputText.innerText = solution.outputText;
  outputSolution.innerHTML = '';

  solution.steps.forEach(step => {
    const rubySquare = document.createElement('div');
    rubySquare.classList.add('ruby-square');
    rubySquare.classList.add('solution-step');

    const length = step.rubySquare.length;

    rubySquare.style.width = `${50 * length + 2 * length}px`;
  
    if (~step.spinX && ~step.spinY && step.spinDirection) {
      const rotatingSquare = document.createElement('div');

      rotatingSquare.classList.add('rotating-square');

      rotatingSquare.style.width = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;
      rotatingSquare.style.height = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;

      rotatingSquare.style.top = `${50 * step.spinX + 2 * rotatingSquareSize - 2}px`;
      rotatingSquare.style.left = `${50 * step.spinY + 2 * rotatingSquareSize - 2}px`;
      rotatingSquare.style.zIndex = '1';

      const direction = document.createElement('span');
      direction.innerText = '↶';
      // direction.innerText = '↷';
      rotatingSquare.appendChild(direction);

      rubySquare.appendChild(rotatingSquare);
    }
  
    for (let i = 0; i < length; ++i) {
      for (let j = 0; j < length; ++j) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.classList.add(colors[step.rubySquare[i][j].color]);
        rubySquare.appendChild(square);
      }
    }

    outputSolution.appendChild(rubySquare);
  });
}


/**
 * find solution
 * 
 * @param {array} rubySquare
 * @return {object} solution object
 */
function findSolution(rubySquare) {
  const solution = {
    error: false,
    outputText: 'Steps of short solution',
    steps: [],
  };

  solution.steps.push({
    spinX: 1,
    spinY: 1,
    spinDirection: 'left',
    rubySquare: JSON.parse(JSON.stringify(rubySquare)),
  });


  // manual rotate
  const temp =  rubySquare[1][1];
  rubySquare[1][1] = rubySquare[1][2];
  rubySquare[1][2] = rubySquare[2][2];
  rubySquare[2][2] = rubySquare[2][1];
  rubySquare[2][1] = temp;


  solution.steps.push({
    spinX: -1,
    spinY: -1,
    spinDirection: null,
    rubySquare: rubySquare,
  });

  return solution;
}
