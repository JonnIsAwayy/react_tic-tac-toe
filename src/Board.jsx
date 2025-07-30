import { useState, useEffect, useCallback, useMemo } from 'react'; // BUG FIX: Import useMemo
import './index.css';

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function calculateWinner(s) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines)
    if (s[a] && s[a] === s[b] && s[a] === s[c]) return { winner: s[a], line: [a, b, c] };
  return null;
}

export default function Board({ onFinish, gameMode, difficulty }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setXNext]   = useState(true);

  // BUG FIX: useMemo prevents winnerInfo from being a new object on every render.
  // This stops the useEffect hook from re-running unnecessarily.
  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => squares.every(Boolean) && !winnerInfo, [squares, winnerInfo]);

  const computerMove = useCallback((currentBoard) => {
    const player = 'X';
    const ai = 'O';

    const findWinningMove = (board, playerSymbol) => {
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          const tempBoard = [...board];
          tempBoard[i] = playerSymbol;
          if (calculateWinner(tempBoard)?.winner === playerSymbol) return i;
        }
      }
      return null;
    };
    
    const getRandomMove = (board) => {
      const available = board.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
      if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
      return null;
    };

    switch (difficulty) {
      case 'easy':
        return getRandomMove(currentBoard);
      case 'medium': {
        const playerWinMove = findWinningMove(currentBoard, player);
        if (playerWinMove !== null) return playerWinMove;
        return getRandomMove(currentBoard);
      }
      case 'hard':
      default: {
        const aiWinMove = findWinningMove(currentBoard, ai);
        if (aiWinMove !== null) return aiWinMove;
        const playerWinMove = findWinningMove(currentBoard, player);
        if (playerWinMove !== null) return playerWinMove;
        if (currentBoard[4] === null) return 4;
        const corners = [0, 2, 6, 8].filter(i => currentBoard[i] === null);
        if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
        return getRandomMove(currentBoard);
      }
    }
  }, [difficulty]);

  function handleClick(i) {
    if (winnerInfo || squares[i] || (gameMode === 'computer' && !isXNext)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXNext(!isXNext);
  }

  useEffect(() => {
    if (winnerInfo) {
      onFinish(winnerInfo.winner);
    } else if (isDraw) {
      onFinish('draw');
    }
  }, [winnerInfo, isDraw, onFinish]);

  useEffect(() => {
    if (gameMode === 'computer' && !isXNext && !winnerInfo && !isDraw) {
      const timer = setTimeout(() => {
        const move = computerMove(squares);
        if (move !== null) {
          const nextSquares = squares.slice();
          nextSquares[move] = 'O';
          setSquares(nextSquares);
          setXNext(true);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, squares, winnerInfo, isDraw, computerMove]);

  const status = winnerInfo 
    ? `🏆 Winner: ${winnerInfo.winner}!`
    : isDraw
    ? '😎 Draw!'
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="board-container">
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}