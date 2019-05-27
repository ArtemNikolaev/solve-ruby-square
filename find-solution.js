onmessage = (e) => {
  if (e.data[0] === 'start') {
    const solution = findSolution(e.data[1], e.data[2], e.data[3]);
    postMessage(solution);
  }
}

let iterations = 0;
let matches = 0;

/**
 * find solution
 * 
 * @param {Array} initialRubySquare
 * @param {Array} finalRubySquare
 * @param {Number} rotatingSquareSize
 * @return {Object} solution object
 */
function findSolution(initialRubySquare, finalRubySquare, rotatingSquareSize) {
  const time = 'time';
  console.time(time);

  const solution = {
    outputText: 'Solution Steps',
    steps: [],
  };

  const stringifiedInitialRubySquare = JSON.stringify(initialRubySquare);
  const stringifiedFinalRubySquare = JSON.stringify(finalRubySquare);

  if (stringifiedInitialRubySquare === stringifiedFinalRubySquare) {
    solution.outputText = 'No need to change anything to solve';
    return solution;
  }

  const rotatingSquares = getRotatingSquares(initialRubySquare, rotatingSquareSize);
  excludeSolidColors(rotatingSquares, initialRubySquare);

  const rotatingSquaresLength = rotatingSquares.length;

  const snapshots = new Set();
  snapshots.add(stringifiedInitialRubySquare);

  const maxLevel = 7;

  const spinTree = [];

  for (let i = 0; i <= maxLevel + 2; ++i) {
    spinTree[i] = [];
  }

  spinTree[0][0] = {
    rubySquare: stringifiedInitialRubySquare,
    spin: JSON.stringify([-1]),
  };

  const steps = revolve(0, maxLevel, spinTree, snapshots, rotatingSquares, rotatingSquaresLength, stringifiedFinalRubySquare);

  if (steps) {
    steps.forEach((step) => {
      step.square = JSON.parse(step.square);
      solution.steps.push(step);
    });
  } else solution.outputText = 'No solution';
  
  console.log('iterations', iterations);
  console.log('snapshots', snapshots.size);
  console.log('matches', matches);
  console.timeEnd(time);

  return solution;
}

/**
 *  iterate over all options
 * 
 * @param {Number} currentLevel
 * @param {Number} maxLevel
 * @param {Array} spinTree
 * @param {Set} snapshots
 * @param {Array} rotatingSquares
 * @param {Number} rotatingSquaresLength
 * @param {String} stringifiedFinalRubySquare
 * @return {Array || null} array of steps or null
 */
function revolve(currentLevel, maxLevel, spinTree, snapshots, rotatingSquares, rotatingSquaresLength, stringifiedFinalRubySquare) {
  if (currentLevel > maxLevel) return null;
  console.log('level', currentLevel);

  const levelLength = spinTree[currentLevel].length;

  for (let i = 0; i < levelLength; ++i) {
    const rotatedSquareN = JSON.parse(spinTree[currentLevel][i].spin)[0];

    for (let j = 0; j < rotatingSquaresLength; ++j) {
      iterations += 1;

      const rubySquare = JSON.parse(spinTree[currentLevel][i].rubySquare);

      const rotatingSquareState = getSquareState(rotatingSquares[j].coordinates, rubySquare);
      if (rotatingSquares[j].usedStates.has(rotatingSquareState)) continue;
  
      if (~rotatedSquareN && rotatingSquares[j].dependent.every(s => s !== rotatedSquareN) && rotatedSquareN <= j) {
        continue;
      }

      turnSquare(rotatingSquares[j], rubySquare);
      const stringifiedRubySquare1 = JSON.stringify(rubySquare);

      turnSquare(rotatingSquares[j], rubySquare);
      const stringifiedRubySquare2 = JSON.stringify(rubySquare);

      turnSquare(rotatingSquares[j], rubySquare);
      const stringifiedRubySquare3 = JSON.stringify(rubySquare);

      const haveSnapshot1 = snapshots.has(stringifiedRubySquare1);
      const haveSnapshot2 = snapshots.has(stringifiedRubySquare2);
      const haveSnapshot3 = snapshots.has(stringifiedRubySquare3);

      snapshots.add(stringifiedRubySquare1);
      snapshots.add(stringifiedRubySquare2);
      snapshots.add(stringifiedRubySquare3);

      if (!haveSnapshot1) {
        if (stringifiedRubySquare1 === stringifiedFinalRubySquare) {
          return [
            {
              spinX: rotatingSquares[j].coordinates[0][0],
              spinY: rotatingSquares[j].coordinates[0][1],
              spinDirection: 'right',
              square: spinTree[currentLevel][i].rubySquare,
  
              prevSquareN: i,
            },
            {
              spinX: -1,
              spinY: -1,
              spinDirection: null,
              square: stringifiedRubySquare1,
            }
          ];
        }

        spinTree[currentLevel + 1].push({
          rubySquare: stringifiedRubySquare1,
          spin: JSON.stringify([
            j, /* rotatedSquareN */
            i, /* prevSquareN */
            'right',
          ]),
        });
      } else matches += 1;

      if (!haveSnapshot2) {
        if (stringifiedRubySquare2 === stringifiedFinalRubySquare) {
          return [
            {
              spinX: rotatingSquares[j].coordinates[0][0],
              spinY: rotatingSquares[j].coordinates[0][1],
              spinDirection: 'right',
              square: spinTree[currentLevel][i].rubySquare,
  
              prevSquareN: i,
            },
            {
              spinX: rotatingSquares[j].coordinates[0][0],
              spinY: rotatingSquares[j].coordinates[0][1],
              spinDirection: 'right',
              square: stringifiedRubySquare1,
  
              prevSquareN: i,
            },
            {
              spinX: -1,
              spinY: -1,
              spinDirection: null,
              square: stringifiedRubySquare2,
            }
          ];
        }

        spinTree[currentLevel + 2].push({
          rubySquare: stringifiedRubySquare2,
          spin: JSON.stringify([
            j, /* rotatedSquareN */
            spinTree[currentLevel + 1].length - 1, /* prevSquareN */
            'right',
          ]),
        });
      } else matches += 1;

      if (!haveSnapshot3) {
        if (stringifiedRubySquare3 === stringifiedFinalRubySquare) {
          return [
            {
              spinX: rotatingSquares[j].coordinates[0][0],
              spinY: rotatingSquares[j].coordinates[0][1],
              spinDirection: 'left',
              square: spinTree[currentLevel][i].rubySquare,
  
              prevSquareN: i,
            },
            {
              spinX: -1,
              spinY: -1,
              spinDirection: null,
              square: stringifiedRubySquare3,
            }
          ];
        }

        spinTree[currentLevel + 1].push({
          rubySquare: stringifiedRubySquare3,
          spin: JSON.stringify([
            j, /* rotatedSquareN */
            i, /* prevSquareN */
            'left',
          ]),
        });
      } else matches += 1;

      if (!(iterations % 2000000)) {
        console.log('iterations', iterations);
        console.log('snapshots', snapshots.size);
        console.log('matches', matches);
        console.log('length', spinTree[currentLevel].length);
        console.log('next length', spinTree[currentLevel + 1].length);
      }
    }
  }

  const steps = revolve(currentLevel + 1, maxLevel, spinTree, snapshots, rotatingSquares, rotatingSquaresLength, stringifiedFinalRubySquare);

  if (steps) {
    const square = spinTree[currentLevel + 1][steps[0].prevSquareN];
    const rubySquare = JSON.parse(square.rubySquare);
    const spin = JSON.parse(square.spin);

    turnSquare(rotatingSquares[spin[0]], rubySquare);
    turnSquare(rotatingSquares[spin[0]], rubySquare);
    turnSquare(rotatingSquares[spin[0]], rubySquare);

    steps.unshift({
      spinX: rotatingSquares[spin[0]].coordinates[0][0],
      spinY: rotatingSquares[spin[0]].coordinates[0][1],
      spinDirection: spin[2],
      square: JSON.stringify(rubySquare),

      prevSquareN: spin[1],
    });
  }

  return steps;
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
 *  get rotating square state
 * 
 * @param {Array} coordinates
 * @param {Array} rubySquare
 * @return {String} state
 */
function getSquareState(coordinates, rubySquare) {
  const state = [];

  coordinates.forEach((coordinate) => {
    state.push(rubySquare[coordinate[0]][coordinate[1]]);
  });

  return state.join('');
}

/**
 *  exclude solid colors
 * 
 * @param {Array} rotatingSquares
 * @param {Array} rubySquare
 * @return {Void}
 */
function excludeSolidColors(rotatingSquares, rubySquare) {
  /* get number of color */
  const rubySquareSquareLength = rubySquare.length;
  const colors = new Set();

  for (let r = 0; r < rubySquareSquareLength; ++r) {
    for (let c = 0; c < rubySquareSquareLength; ++c) {
      colors.add(rubySquare[r][c]);
    }
  }

  colors.forEach((color) => {
    rotatingSquares.forEach((square => {
      square.usedStates.add(`${color}`.repeat(square.coordinates.length));
    }));
  });
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
        usedStates: new Set(),
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
