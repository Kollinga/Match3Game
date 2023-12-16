import React, { useState, useEffect } from 'react'
import './Math3Game.css'

export const Match3Game2 = () => {
  const [grid, setGrid] = useState([]);
  const [revealedCells, setRevealedCells] = useState([]);
  const [win, setWin] = useState(false);

  const initialImagePaths = [
    ...new Array(8).fill(`${process.env.PUBLIC_URL}/blue_color.png`),
    ...new Array(5).fill(`${process.env.PUBLIC_URL}/green_color.png`),
    ...new Array(3).fill(`${process.env.PUBLIC_URL}/red_color.png`),
  ];

  function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const resetGrid = () => {
    const shuffledPaths = shuffleArray([...initialImagePaths]);

    const rows = 4;
    const cols = 4;
    const newGrid = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        if (shuffledPaths.length > 0) {
          const imagePath = shuffledPaths.pop();
          row.push(imagePath);
        } else {
          row.push(null);
        }
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
    setRevealedCells([]);
    setWin(false);
  };

  const revealCell = (rowIndex, colIndex) => {
    if (!revealedCells.includes(`${rowIndex}-${colIndex}`)) {
      const updatedRevealedCells = [...revealedCells, `${rowIndex}-${colIndex}`];
      setRevealedCells(updatedRevealedCells);

      const revealedImages = updatedRevealedCells.map((cell) => {
        const [row, col] = cell.split('-');
        return grid[parseInt(row)][parseInt(col)];
      });

      const blueCount = revealedImages.filter((image) => image.includes('blue_color.png')).length;
      const greenCount = revealedImages.filter((image) => image.includes('green_color.png')).length;
      const redCount = revealedImages.filter((image) => image.includes('red_color.png')).length;

      if (blueCount === 3 || greenCount === 3 || redCount === 3) {
        setWin(true);
      }
    }
  };

  useEffect(() => {
    resetGrid();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Match 3 Game</h1>
      <button className="reset" onClick={resetGrid}>
        Reset
      </button>
      <div className="board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={`row${rowIndex + 1}`}>
            {row.map((imagePath, colIndex) => (
              <div
                key={colIndex}
                className={`boxes ${revealedCells.includes(`${rowIndex}-${colIndex}`) ? 'revealed' : ''}`}
                onClick={() => revealCell(rowIndex, colIndex)}
              >
                {revealedCells.includes(`${rowIndex}-${colIndex}`) && (
                  <img src={imagePath} alt="Colorful Bell" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {win && <div className="winner">Congratulations! You have matched 3 images!</div>}
    </div>
  );
};

export default Match3Game2;