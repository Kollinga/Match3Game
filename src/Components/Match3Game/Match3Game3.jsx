import React, { useState, useEffect } from 'react';
import redBell from '../Assets/red_color.png';
import greenBell from '../Assets/green_color.png';
import blueBell from '../Assets/blue_color.png';
import './Math3Game.css'

export const Match3Game3 = () => {
  const [grid, setGrid] = useState([]);
  const [revealedCells, setRevealedCells] = useState([]);
  const [win, setWin] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);
  const [initialPrize, setInitialPrize] = useState(null);
  
  const generateRandomGrid = () => {
    const gridWithImages = [];
    const totalCells = 16; // 4x4 grid

    const blueCount = 11;
    const greenCount = 2;
    const redCount = 3;

    const images = [
      ...new Array(blueCount).fill('blue'),
      ...new Array(greenCount).fill('green'),
      ...new Array(redCount).fill('red'),
    ];

    const shuffledImages = shuffleArray(images);

    for (let i = 0; i < totalCells; i += 4) {
      gridWithImages.push(shuffledImages.slice(i, i + 4));
    }

    return gridWithImages;
  };

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const resetGrid = () => {
    const newGrid = generateRandomGrid();
    setGrid(newGrid);
    setRevealedCells([]);
    setWin(false); // Reset win state
    setWinningPrize(null); // Reset winning prize
    setInitialPrize(null); // Reset initial prize
  };

  const revealCell = (rowIndex, colIndex) => {
    if (!revealedCells.includes(`${rowIndex}-${colIndex}`)) {
      const updatedRevealedCells = [...revealedCells, `${rowIndex}-${colIndex}`];
      setRevealedCells(updatedRevealedCells);

      const revealedColors = updatedRevealedCells.map((cell) => {
        const [row, col] = cell.split('-');
        return grid[parseInt(row)][parseInt(col)];
      });

      const colorCounts = {
        red: revealedColors.filter((color) => color === 'red').length,
        green: revealedColors.filter((color) => color === 'green').length,
        blue: revealedColors.filter((color) => color === 'blue').length,
      };

      if (colorCounts.red === 3 || colorCounts.green === 3 || colorCounts.blue === 3) {
        setWin(true);
      }
    }
  };

  const checkWin = () => {
    const revealedColors = revealedCells.map((cell) => {
      const [row, col] = cell.split('-');
      return grid[parseInt(row)][parseInt(col)];
      
    });

    const redCount = revealedColors.filter((color) => color === 'red').length;
    const greenCount = revealedColors.filter((color) => color === 'green').length;
    const blueCount = revealedColors.filter((color) => color === 'blue').length;

    

    let currentPrize = null;

  if (winningPrize === null) {
    if (redCount === 3) {
      currentPrize = '$500 cash';
    } else if (greenCount === 1) {
      currentPrize = '$100 cash';
    } else if (blueCount === 3) {
      currentPrize = '$50 free play';
    }

    if (currentPrize !== null) {
      setWin(true);
      setWinningPrize(currentPrize);
      if (initialPrize === null) {
        setInitialPrize(currentPrize);
      }
    }
  }
    
  };

  useEffect(() => {
    resetGrid();
  }, []);

  useEffect(() => {
    if (revealedCells.length >= 1) {
      checkWin();
    }
  }, [revealedCells]);

  const revealAllBoxes = () => {
    const allCells = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        allCells.push(`${i}-${j}`);
      }
    }
    const revealed = revealedCells.slice(); // Make a copy of revealed cells
    allCells.forEach((cell) => {
      if (!revealed.includes(cell)) {
        revealed.push(cell); // Add unopened boxes to revealed cells
      }
    });
    setRevealedCells(revealed);
  }; 

  return (
    <div className="container">
      <h1 className="title">Bells Mania</h1>
      <button className="reset" onClick={resetGrid}>
        New Game
      </button>
      
      <div className="board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={`row${rowIndex + 1}`}>
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
      {win && (
        <div className="winner">
          <p>CONGRATULATIONS! </p>
          <p>You have matched the Bells!</p>
          <p>PRIZE: {initialPrize !== null ? initialPrize : winningPrize}</p>
          <div>
          <button className='reveal' onClick={revealAllBoxes}>Reveal All</button>  
          </div>
          
        </div>
      )}

    </div>
  );
};

export default Match3Game3;
