/* get HTML Elements */
const initialRubySquareDiv = document.querySelector('#ruby-square-initial');
const finalRubySquareDiv = document.querySelector('#ruby-square-final');
const commonSquareSizeSelect = document.querySelector('#common-square-size');
const rotatingSquareSizeSelect = document.querySelector('#rotating-square-size');
const searchButton = document.querySelector('#search-button');
const outputTextSpan = document.querySelector('#output-text');
const outputSolutionDiv = document.querySelector('#output-solution');


/* set initial values */
const initialRubySquare = {
  spinX: 1,
  spinY: 1,
  spinDirection: null,
  square: [],
};

const finalRubySquare = {
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
 * @return {Void}
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
 * @return {Void}
 */
function drawSolution(solution, rotatingSquareSize, outputTextSpan, outputSolutionDiv) {
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
 * @param {Array} initialRubySquare
 * @param {Array} finalRubySquare
 * @param {Number} rotatingSquareSize
 * @return {Object} solution object
 */
function findSolution(initialRubySquare, finalRubySquare, rotatingSquareSize) {
  const start = 'start';
  console.time(start);

  const solution = {
    outputText: 'Solution Steps',
    steps: [],
  };

  const stringifiedFinalRubySquare = JSON.stringify(finalRubySquare);

  if (JSON.stringify(initialRubySquare) === stringifiedFinalRubySquare) {
    solution.outputText = 'No need to change anything to solve';
    return solution;
  }

  const rotatingSquares = getRotatingSquares(initialRubySquare, rotatingSquareSize);

  const resultOfRevolve = {
    snapshots: {},
    steps: [],
  };

  const rotatingSquaresLength = rotatingSquares.length;
  let level = 1;

  while (level < 5) {
    for (let i = 0; i < rotatingSquaresLength; ++i)  {
      const tempRubySquare = JSON.parse(JSON.stringify(initialRubySquare));

      if (revolve(rotatingSquares, i, level, resultOfRevolve, tempRubySquare, stringifiedFinalRubySquare)) {
        resultOfRevolve.steps.forEach((step) => {
          step.square = JSON.parse(step.square);
          solution.steps.push(step);
        });
        
        console.timeEnd(start);
        return solution;
      }

      resultOfRevolve.steps = [];
    }

    level += 1;
  }

  solution.outputText = 'No solution';

  console.timeEnd(start);
  return solution;
}

/**
 *  iterate over all options
 * 
 * @param {Array} rotatingSquares
 * @param {Number} rotatingSquareNumber
 * @param {Number} currentLevel
 * @param {Object} resultOfRevolve
 * @param {Array} rubySquare
 * @param {String} finalRubySquare
 * @return {Boolean}
 */
function revolve(rotatingSquares, rotatingSquareNumber, currentLevel, resultOfRevolve, rubySquare, finalRubySquare) {
  if (currentLevel <= 0) return false;

  if (resultOfRevolve.snapshots[rubySquare] && resultOfRevolve.snapshots[rubySquare] > currentLevel) {
    return false;
  }

  resultOfRevolve.snapshots[rubySquare] = currentLevel;

  // const dependentLength = rotatingSquares[rotatingSquareNumber].dependent.length;
  let spinDirection = 'right';
  const stringifiedFirstSpinRubySquare = JSON.stringify(rubySquare);

  for (let i = 0; i < 4; ++i) {
    const stringifiedRubySquare = JSON.stringify(rubySquare);

    if (stringifiedRubySquare === finalRubySquare) {
      resultOfRevolve.steps.push({
        spinX: -1,
        spinY: -1,
        spinDirection: null,
        square: stringifiedRubySquare,
      });

      return true;
    }

    if (i === 2) {
      resultOfRevolve.steps.splice(-2);
      spinDirection = 'left';
    } else if (i === 3) {
      resultOfRevolve.steps.pop();
    }

    if (i < 3) {
      resultOfRevolve.steps.push({
        spinX: rotatingSquares[rotatingSquareNumber].coordinates[0][0],
        spinY: rotatingSquares[rotatingSquareNumber].coordinates[0][1],
        spinDirection,
        square: i === 2 ? stringifiedFirstSpinRubySquare : stringifiedRubySquare,
      });
    }

    turnSquare(rotatingSquares[rotatingSquareNumber], rubySquare);

    for (let j = 0; j < 9 /* dependentLength */; ++j) {
      if (j === rotatingSquareNumber) continue;

      const returnValue = revolve(
        rotatingSquares,
        j, // rotatingSquares[rotatingSquareNumber].dependent[j],
        (currentLevel - 1),
        resultOfRevolve,
        JSON.parse(JSON.stringify(rubySquare)),
        finalRubySquare,
      );

      if (returnValue) return true;
    }
  }
  
  return false;
}

/**
 *  get rotating square state
 * 
 * @param {Array} rotatingSquare
 * @param {Array} rubySquare
 * @return {Void}
 */
function turnSquare(rotatingSquare, rubySquare) {
  const side = rotatingSquare.side;

  const y = rotatingSquare.coordinates[0][0];
  const x = rotatingSquare.coordinates[0][1];

  for (let r = 0; r < side / 2; ++r) {
    for (let c = r; c < side - r - 1; ++c) {
      const temp = rubySquare[r + y][c + x];
      rubySquare[r + y][c + x] = rubySquare[side - c - 1 + y][r + x];
      rubySquare[side - c - 1 + y][r + x] = rubySquare[side - r - 1 + y][side - c -1 + x];
      rubySquare[side - r - 1 + y][side - c - 1 + x] = rubySquare[c + y][side - r - 1 + x];
      rubySquare[c + y][side - r - 1 + x] = temp;
    }
  }
}

/**
 * get all the squares with their dependents
 * 
 * @param {Array} rubySquare
 * @param {Number} rotatingSquareSize
 * @return {Array} rotatingSquares
 */
function getRotatingSquares(rubySquare, rotatingSquareSize) {
  const rotatingSquares = [];

  const numberOfRotatingSquaresPerLine = rubySquare.length - rotatingSquareSize + 1;

  for (let rotatingRow = 0; rotatingRow < numberOfRotatingSquaresPerLine; ++rotatingRow) {
    for (let rotatingCol = 0; rotatingCol < numberOfRotatingSquaresPerLine; ++rotatingCol) {
      const coordinates = [];

      for (let row = 0; row < rotatingSquareSize; ++row) {
        for (let col = 0; col < rotatingSquareSize; ++col) {
          coordinates.push([rotatingRow + row, rotatingCol + col]);
        }
      }

      rotatingSquares.push({
        coordinates,
        side: rotatingSquareSize,
        dependent: [],
      });
    }
  }

  const rotatingSquaresLength = rotatingSquares.length;
  const rotatingSquareCoordinatesLength = rotatingSquares[0].coordinates.length;

  for (let r1 = 0; r1 < rotatingSquaresLength; ++r1) {
    nextRotatingSquare:
    for (let r2 = 0; r2 < rotatingSquaresLength; ++r2) {

      for (let c1 = 0; c1 < rotatingSquareCoordinatesLength; ++c1) {
        for (let c2 = 0; c2 < rotatingSquareCoordinatesLength; ++c2) {
          if (r1 !== r2
            && rotatingSquares[r1].coordinates[c1][0] === rotatingSquares[r2].coordinates[c2][0]
            && rotatingSquares[r1].coordinates[c1][1] === rotatingSquares[r2].coordinates[c2][1]) {
            //
            rotatingSquares[r1].dependent.push(r2);
            continue nextRotatingSquare;
          }
        }
      }
    }
  }

  return rotatingSquares;
}
