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
  const [customAlert, setCustomAlert] = useState(null); // Handles all prize alerts
  const [redBellCount, setRedBellCount] = useState(0);
  const [showSecondMatrix, setShowSecondMatrix] = useState(false);
  const [secondMatrix, setSecondMatrix] = useState([]);
  const [secondMatrixRevealed, setSecondMatrixRevealed] = useState([]); // Tracks revealed cells in the second matrix
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
    setCustomAlert(null);
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

    // Handle first matrix prize logic
    if (selectedColor === 'green') {
      setWin(true);
      setCustomAlert('You matched 1 Green Bell! You win $100 Cash!');
    } else if (updatedRevealedCells.filter((cell) => grid[cell.split('-')[0]][cell.split('-')[1]] === 'blue').length === 3) {
      setWin(true);
      setCustomAlert('You matched 3 Blue Bells! You win $50 Free Play!');
    }
  };

  // Reveal a cell in the second matrix
  const revealSecondMatrixCell = (rowIndex, colIndex) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    if (secondMatrixRevealed.includes(cellKey)) return;

    // Reveal the clicked cell
    setSecondMatrixRevealed((prevRevealed) => [...prevRevealed, cellKey]);

    const selectedColor = secondMatrix[rowIndex][colIndex];

    // Display prize message
    let prizeMessage = '';
    if (selectedColor === 'red') {
      prizeMessage = 'You found a Red Bell! You win $500 cash!';
    } else if (selectedColor === 'elf') {
      prizeMessage = 'You found the Elf! You win $1000 cash!';
    } else if (selectedColor === 'grinch') {
      prizeMessage = 'The Grinch just pranked you! You win $50 Free Play!';
    }

    setCustomAlert(prizeMessage);

    // Reveal all cells after the alert
    setSecondMatrixRevealed(['0-0', '0-1', '1-0', '1-1']);
  };

  useEffect(() => {
    resetGrid();
  }, []);

  return (
    <div className="bgContainer">
      <div className="overlay">
        <video src={videoBell} autoPlay loop muted />
        <div className="left-image-container">
          <img src="Twinkle_Elf_Full.png" alt="Rotating Elf" className="rotating-image-left" />
        </div>
        <div className="right-image-container">
          <img src="Twinkle_Elf_Full.png" alt="Rotating Elf" className="rotating-image-right" />
        </div>
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
              <button className="close-button" onClick={() => setShowSecondMatrix(false)}>✖</button>
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

          {customAlert && (
            <div className="custom-alert">
              <div className="custom-alert-content">
                <p>{customAlert}</p>
                <button onClick={() => setCustomAlert(null)}>OK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Match3Game3;
