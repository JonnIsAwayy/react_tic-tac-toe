import { useState } from 'react';
import Board from './Board';           // the same Board you already have
import './index.css';

/* ——— little scoreboard component ——— */
function ScoreBoard({ x, o, draw }) {
  return (
    <div className="scoreboard">
      <div>X wins  : {x}</div>
      <div>O wins  : {o}</div>
      <div>Draws    : {draw}</div>
    </div>
  );
}

/* ——— parent that tracks scores ——— */
export default function Game() {
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [boardKey, setBoardKey] = useState(0); // forces Board remount

  /* called BY Board when a round finishes */
  function handleFinish(result) {
    setScores(s => ({
      x:    s.x    + (result === 'X'     ? 1 : 0),
      o:    s.o    + (result === 'O'     ? 1 : 0),
      draw: s.draw + (result === 'draw' ? 1 : 0)
    }));
  }

  /* clears board, keeps score  */
  function playAgain()  { setBoardKey(k => k + 1); }

  /* clears board AND scores */
  function resetScores() {
    setScores({ x: 0, o: 0, draw: 0 });
    setBoardKey(k => k + 1);
  }

  return (
    <div className="app-container">
      <img src="game-logo.jpg" alt="Logo" className="logo" />

      <ScoreBoard {...scores} />

      <Board key={boardKey} onFinish={handleFinish} />

      <div className="button-row">
        <button className="play-btn" onClick={playAgain}>Play Again</button>
        <button className="reset-btn" onClick={resetScores}>Reset Scores</button>
      </div>
    </div>
  );
}