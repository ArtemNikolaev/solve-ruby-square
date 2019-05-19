/* get HTML Elements */
const initialRubySquareDiv = document.querySelector('#ruby-square-initial');
const finalRubySquareDiv = document.querySelector('#ruby-square-final');
const commonSquareSizeSelect = document.querySelector('#common-square-size');
const rotatingSquareSizeSelect = document.querySelector('#rotating-square-size');
const searchButton = document.querySelector('#search-button');
const outputTextSpan = document.querySelector('#output-text');
const outputSolutionDiv = document.querySelector('#output-solution');


/* set initial values */
let initialRubySquare = {
  spinX: 1,
  spinY: 1,
  spinDirection: null,
  square: [],
};

let finalRubySquare = {
  spinX: -1,
  spinY: -1,
  spinDirection: null,
  square: [],
};

const solution = {
  error: false,
  outputText: 'To see the solution, click the search button',
  steps: [],
};

const colors = ['violet', 'orange', 'green', 'yellow', 'blue'];

let commonSquareSize = 4;
let rotatingSquareSize = 2;


/* initialization */
commonSquareSizeSelect.value = commonSquareSize;
rotatingSquareSizeSelect.value = rotatingSquareSize;

initialRubySquare.square = getRubySquare(commonSquareSize);
drawRubySquare(initialRubySquare, rotatingSquareSize, initialRubySquareDiv);

finalRubySquare.square = getRubySquare(commonSquareSize);
drawRubySquare(finalRubySquare, rotatingSquareSize, finalRubySquareDiv);

drawSolution(solution, rotatingSquareSize, outputTextSpan, outputSolutionDiv);


/* create event listeners */
commonSquareSizeSelect.addEventListener('change', (e) => {
  commonSquareSize = Number(e.target.value);

  initialRubySquare.square = getRubySquare(commonSquareSize);
  drawRubySquare(initialRubySquare, rotatingSquareSize, initialRubySquareDiv);
  
  finalRubySquare.square = getRubySquare(commonSquareSize);
  drawRubySquare(finalRubySquare, rotatingSquareSize, finalRubySquareDiv);
});

rotatingSquareSizeSelect.addEventListener('change', (e) => {
  rotatingSquareSize = Number(e.target.value);

  drawRubySquare(initialRubySquare, rotatingSquareSize, initialRubySquareDiv);
});

initialRubySquareDiv.addEventListener('click', (e) => {
  if (e.target === initialRubySquareDiv) return;

  const square = e.target;
  const ids = square.id.split('-');

  const i = Number(ids[0]);
  const j = Number(ids[1]);
  
  const oldColor = colors[initialRubySquare.square[i][j]];

  initialRubySquare.square[i][j] = initialRubySquare.square[i][j] === (colors.length - 1) 
    ? 0
    : initialRubySquare.square[i][j] + 1;

  const newColor = colors[initialRubySquare.square[i][j]];

  square.classList.replace(oldColor, newColor);
});

finalRubySquareDiv.addEventListener('click', (e) => {
  if (e.target === finalRubySquareDiv) return;

  const square = e.target;
  const ids = square.id.split('-');

  const i = Number(ids[0]);
  const j = Number(ids[1]);
  
  const oldColor = colors[finalRubySquare.square[i][j]];

  finalRubySquare.square[i][j] = finalRubySquare.square[i][j] === (colors.length - 1) 
    ? 0
    : finalRubySquare.square[i][j] + 1;

  const newColor = colors[finalRubySquare.square[i][j]];

  square.classList.replace(oldColor, newColor);
});

searchButton.addEventListener('click', () => {
  searchButton.disabled = true;
  commonSquareSizeSelect.disabled = true;
  rotatingSquareSizeSelect.disabled = true;

  const solution = findSolution(initialRubySquare.square, finalRubySquare.square, rotatingSquareSize);
  drawSolution(solution, rotatingSquareSize, outputTextSpan, outputSolutionDiv);

  searchButton.disabled = false;
  commonSquareSizeSelect.disabled = false;
  rotatingSquareSizeSelect.disabled = false;
});


/**
 * get ruby square
 * 
 * @param {Number} squareSize - side of square
 * @return {Array} ruby square
 */
function getRubySquare(squareSize) {
  const rubySquare = [];

  for (let i = 0; i < squareSize; ++i) {
    rubySquare[i] = [];

    const isTop = !Math.floor(i / (squareSize / 2));

    for (let j = 0; j < squareSize; ++j) {
      const isLeft = !Math.floor(j / (squareSize / 2));

      /* set color of square */
      let color;

      if (isTop && isLeft) color = 0;
      else if (isTop && !isLeft) color = 1;
      else if (isLeft) color = 2;
      else color = 3;

      rubySquare[i][j] = color;
    }
  }

  return rubySquare;
}

/**
 * draw ruby square
 * 
 * @param {Object} rubySquare
 * @param {Number} rotatingSquareSize
 * @param {Element} rubySquareDiv
 * @return {void}
 */
function drawRubySquare(rubySquare, rotatingSquareSize, rubySquareDiv) {
  const length = rubySquare.square.length;

  rubySquareDiv.innerHTML = '';
  rubySquareDiv.style.width = `${50 * length + 2 * length}px`;

  /* draw rotating square */
  if (~rubySquare.spinX && ~rubySquare.spinY) {
    const rotatingSquare = document.createElement('div');
    rotatingSquare.classList.add('rotating-square');

    rotatingSquare.style.width = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;
    rotatingSquare.style.height = `${50 * rotatingSquareSize + 2 * rotatingSquareSize - 2}px`;

    if (rubySquare.spinDirection) {
      rotatingSquare.style.top = `${50 * rubySquare.spinX + 2 * rotatingSquareSize - 2}px`;
      rotatingSquare.style.left = `${50 * rubySquare.spinY + 2 * rotatingSquareSize - 2}px`;
      rotatingSquare.style.zIndex = '1';

      const direction = document.createElement('span');

      switch (rubySquare.spinDirection) {
        case 'left':
          direction.innerText = '↶';
          break;
        case 'right':
          direction.innerText = '↷';
          break;
        default:
          break;
      }

      rotatingSquare.appendChild(direction);
    }

    rubySquareDiv.appendChild(rotatingSquare);
  }

  /* draw ruby square */
  for (let i = 0; i < length; ++i) {
    for (let j = 0; j < length; ++j) {
      const square = document.createElement('div');
      square.id = `${i}-${j}`
      square.classList.add('square');
      square.classList.add(colors[rubySquare.square[i][j]]);

      rubySquareDiv.appendChild(square);
    }
  }
}

/**
 * draw solution
 * 
 * @param {Object} solution
 * @param {Number} rotatingSquareSize
 * @param {Element} outputTextSpan
 * @param {Element} outputSolutionDiv
 * @return {void}
 */
function drawSolution(solution, rotatingSquareSize, outputTextSpan, outputSolutionDiv) {
  if (solution.error) {
    // do smth
  }

  outputTextSpan.innerText = solution.outputText;
  outputSolutionDiv.innerHTML = '';

  solution.steps.forEach(rubySquare => {
    const rubySquareDiv = document.createElement('div');
    rubySquareDiv.classList.add('ruby-square');
    rubySquareDiv.classList.add('solution-step');

    drawRubySquare(rubySquare, rotatingSquareSize, rubySquareDiv);

    outputSolutionDiv.appendChild(rubySquareDiv);
  });
}

/**
 * find solution
 * 
 * @param {Array} intialRubySquare
 * @param {Array} finalRubySquare
 * @param {Number} rotatingSquareSize
 * @return {Object} solution object
 */
function findSolution(intialRubySquare, finalRubySquare, rotatingSquareSize) {
  // this is just to display an example

  const solution = {
    error: false,
    outputText: 'Solution Steps',
    steps: [],
  };

  solution.steps.push({
    spinX: 1,
    spinY: 1,
    spinDirection: 'left',
    square: JSON.parse(JSON.stringify(intialRubySquare)),
  });


  // just manual rotate
  const temp =  intialRubySquare[1][1];
  intialRubySquare[1][1] = intialRubySquare[1][2];
  intialRubySquare[1][2] = intialRubySquare[2][2];
  intialRubySquare[2][2] = intialRubySquare[2][1];
  intialRubySquare[2][1] = temp;


  solution.steps.push({
    spinX: -1,
    spinY: -1,
    spinDirection: null,
    square: JSON.parse(JSON.stringify(intialRubySquare)),
  });

  console.log(JSON.stringify(intialRubySquare) === JSON.stringify(finalRubySquare));

  return solution;
}
