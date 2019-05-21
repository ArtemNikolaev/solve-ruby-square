onmessage = (e) => {
  if (e.data[0] === 'start') {
    const solution = findSolution(e.data[1], e.data[2], e.data[3]);
    postMessage(solution);
  }
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
      if (rotatingSquares[rotatingSquareNumber].dependent.every(square => square !== j)
        && j <= rotatingSquareNumber) {
        //
        continue;
      }

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
