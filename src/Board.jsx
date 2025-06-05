import { useState, useEffect } from 'react';
import './index.css';

/* —— tiny square —— */
function Square({ value, onClick, disabled }) {
  return (
    <button className="square" onClick={onClick} disabled={disabled}>
      {value}
    </button>
  );
}

/* —— winner helper —— */
function calculateWinner(s) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines)
    if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a];
  return null;
}

/* —— board component —— */
export default function Board({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xNext, setXNext]     = useState(true);

  function handleClick(i) {
    if (!started) return;
    if (squares[i] || calculateWinner(squares)) return;

    const next = squares.slice();
    next[i] = xNext ? 'X' : 'O';
    setSquares(next);
    setXNext(!xNext);
  }

  /* soft reset after win/draw */
  function softReset() {
    setSquares(Array(9).fill(null));
    setXNext(true);
    setStarted(false);
  }

  const winner = calculateWinner(squares);
  const draw   = squares.every(Boolean) && !winner;

  /* tell parent (Game) who won */
  useEffect(() => {
    if (winner)    onFinish(winner);
    else if (draw) onFinish('draw');
  }, [winner, draw]); // eslint-disable-line

  const status = !started
    ? 'Ready to play Tic-Tac-Toe?'
    : winner ? `🏆 Winner: ${winner}!`
    : draw   ? '😎 Draw!'
    : `Next player: ${xNext ? 'X' : 'O'}`;

  return (
    <>
      <h2>{status}</h2>

      <div className="board">
        {squares.map((v,i) => (
          <Square
            key={i}
            value={v}
            onClick={() => handleClick(i)}
            disabled={!started || winner}
          />
        ))}
      </div>

      {!started && (
        <button className="play-btn" onClick={() => setStarted(true)}>
          Start Game
        </button>
      )}

      {(winner || draw) && started && (
        <button className="play-btn" onClick={softReset}>
          Play Again
        </button>
      )}
    </>
  );
}
