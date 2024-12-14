import React, { useState, useEffect } from 'react';
import redBell from '../Assets/red_color.png';
import greenBell from '../Assets/green_color.png';
import blueBell from '../Assets/blue_color.png';
import videoBell from '../Assets/bellsManiaBG.mp4';
import elfBell from '../Assets/elfBell.png';
import grinchBell from '../Assets/grinchBell.png';
import './Math3Game.css';

export const Match3Game3 = () => {
  const [grid, setGrid] = useState([]);
  const [revealedCells, setRevealedCells] = useState([]);
  const [win, setWin] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);
  const [redBellCount, setRedBellCount] = useState(0);
  const [showSecondMatrix, setShowSecondMatrix] = useState(false);
  const [secondMatrix, setSecondMatrix] = useState([]);
  const [secondMatrixRevealed, setSecondMatrixRevealed] = useState([]); // Tracks revealed cells
  const [triggerMessageVisible, setTriggerMessageVisible] = useState(false);

  // Generate the first matrix grid
  const generateRandomGrid = () => {
    const blueCount = 6;
    const greenCount = 1;
    const redCount = 9;
    const images = [
      ...new Array(blueCount).fill('blue'),
      ...new Array(greenCount).fill('green'),
      ...new Array(redCount).fill('red'),
    ];
    return chunkArray(shuffleArray(images), 4);
  };

  // Initialize the second matrix
  const initializeSecondMatrix = () => {
    const secondMatrixData = shuffleArray(['red', 'red', 'elf', 'grinch']);
    setSecondMatrix(chunkArray(secondMatrixData, 2));
    setSecondMatrixRevealed([]); // Reset revealed cells
  };

  // Helper functions
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Reset the game grid
  const resetGrid = () => {
    setGrid(generateRandomGrid());
    setRevealedCells([]);
    setWin(false);
    setWinningPrize(null);
    setRedBellCount(0);
    setShowSecondMatrix(false);
  };

  // Reveal a cell in the first matrix
  const revealCell = (rowIndex, colIndex) => {
    if (win || revealedCells.includes(`${rowIndex}-${colIndex}`)) return;

    const updatedRevealedCells = [...revealedCells, `${rowIndex}-${colIndex}`];
    setRevealedCells(updatedRevealedCells);

    const selectedColor = grid[rowIndex][colIndex];
    if (selectedColor === 'red') {
      setRedBellCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 3) {
          setTriggerMessageVisible(true);
          initializeSecondMatrix();
          setShowSecondMatrix(true);
          setTimeout(() => setTriggerMessageVisible(false), 5000);
        }
        return newCount;
      });
    }
  };

  // Reveal a cell in the second matrix
  const revealSecondMatrixCell = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    if (secondMatrixRevealed.includes(cellKey)) return;

    // Reveal the clicked cell
    setSecondMatrixRevealed((prevRevealed) => [...prevRevealed, cellKey]);

    const selectedColor = secondMatrix[rowIndex][colIndex];

    // Display prize message after the cell is revealed
    setTimeout(() => {
      let prizeMessage = '';
      if (selectedColor === 'red') {
        prizeMessage = 'You found a Red Bell! You win $500 cash!';
      } else if (selectedColor === 'elf') {
        prizeMessage = 'You found the Elf! You win $1000 cash!';
      } else if (selectedColor === 'grinch') {
        prizeMessage = 'You found the Grinch! You win $50 Free Play!';
      }

      setWinningPrize(prizeMessage);
      alert(prizeMessage);

      // Reveal all cells after the alert
      setSecondMatrixRevealed(['0-0', '0-1', '1-0', '1-1']);
    }, 500);
  };

  // Check for wins in the first matrix
  useEffect(() => {
    const colorCounts = revealedCells.reduce(
      (counts, cell) => {
        const [row, col] = cell.split('-').map(Number);
        const color = grid[row][col];
        counts[color] = (counts[color] || 0) + 1;
        return counts;
      },
      { red: 0, green: 0, blue: 0 }
    );

    if (colorCounts.green === 1) {
      setWin(true);
      setWinningPrize('$100 Cash');
    } else if (colorCounts.blue === 3) {
      setWin(true);
      setWinningPrize('$50 Free Play');
    }
  }, [revealedCells, grid]);

  // Initialize the game grid on load
  useEffect(() => {
    resetGrid();
  }, []);

  return (
    <div className="bgContainer">
      <div className="overlay">
        <video src={videoBell} autoPlay loop muted />
        <div className="container">
          <h1 className="title">TWINKLES</h1>
          <button className="reset" onClick={resetGrid}>
            NEW GAME
          </button>

          {triggerMessageVisible && (
            <div className="trigger-message">
              <h2>Second Matrix Triggered! Get Ready!</h2>
            </div>
          )}

          {showSecondMatrix ? (
            <div className="second-matrix-popup">
              <h2>Second Matrix</h2>
              <div className="board">
                {secondMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="row">
                    {row.map((color, colIndex) => {
                      const cellKey = `${rowIndex}-${colIndex}`;
                      return (
                        <div
                          key={colIndex}
                          className={`boxes ${secondMatrixRevealed.includes(cellKey) ? 'revealed' : ''}`}
                          onClick={() => revealSecondMatrixCell(rowIndex, colIndex)}
                        >
                          {secondMatrixRevealed.includes(cellKey) && (
                            <img
                              src={
                                color === 'red'
                                  ? redBell
                                  : color === 'elf'
                                  ? elfBell
                                  : grinchBell
                              }
                              alt={`${color} bell`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="board">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                  {row.map((color, colIndex) => (
                    <div
                      key={colIndex}
                      className={`boxes ${revealedCells.includes(`${rowIndex}-${colIndex}`) ? 'revealed' : ''}`}
                      onClick={() => revealCell(rowIndex, colIndex)}
                    >
                      {revealedCells.includes(`${rowIndex}-${colIndex}`) && (
                        <img
                          src={color === 'red' ? redBell : color === 'green' ? greenBell : blueBell}
                          alt={`${color} bell`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {win && (
            <div className="winner">
              <p>CONGRATULATIONS!</p>
              <p>You have matched the Bells!</p>
              <p className="prize">PRIZE: {winningPrize}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Match3Game3;
