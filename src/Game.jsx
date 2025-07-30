import { useState, useCallback } from 'react';
import Board from './Board';
import './index.css';

// --- Scoreboard Component (Unchanged) ---
function ScoreBoard({ x, o, draw }) {
  return (
    <div className="scoreboard">
      <div>X wins: {x}</div>
      <div>O wins: {o}</div>
      <div>Draws: {draw}</div>
    </div>
  );
}

// --- Main Game Component (This is the "parent" component) ---
export default function Game() {
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [boardKey, setBoardKey] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null); // NEW: State for AI difficulty

  const handleFinish = useCallback((result) => {
    setScores(s => ({
      x:    s.x    + (result === 'X'    ? 1 : 0),
      o:    s.o    + (result === 'O'    ? 1 : 0),
      draw: s.draw + (result === 'draw' ? 1 : 0)
    }));
  }, []);

  function playAgain()  { setBoardKey(k => k + 1); }

  function resetScores() {
    setScores({ x: 0, o: 0, draw: 0 });
    setBoardKey(k => k + 1);
  }
  
  function selectGameMode(mode) {
    setGameMode(mode);
    setScores({ x: 0, o: 0, draw: 0 });
    setBoardKey(k => k + 1);
  }
  
  // NEW: Sets the chosen difficulty
  function selectDifficulty(level) {
    setDifficulty(level);
  }

  // Resets the game back to the main menu
  function changeMode() {
    setGameMode(null);
    setDifficulty(null); // Also reset difficulty
  }

  // --- Render Logic ---
  // This determines which screen to show: Main Menu, Difficulty Select, or Game Board
  let currentView;

  if (!gameMode) {
    // View 1: Main Menu
    currentView = (
      <div className="mode-selection">
        <h2 className="mode-title">Select Game Mode</h2>
        <button className="mode-btn player" onClick={() => selectGameMode('player')}>Player vs Player</button>
        <button className="mode-btn computer" onClick={() => selectGameMode('computer')}>Player vs Computer</button>
      </div>
    );
  } else if (gameMode === 'computer' && !difficulty) {
    // View 2: Difficulty Selection Screen
    currentView = (
      <div className="difficulty-selection">
        <h2 className="mode-title">Select Difficulty</h2>
        <button className="difficulty-btn easy" onClick={() => selectDifficulty('easy')}>Easy</button>
        <button className="difficulty-btn medium" onClick={() => selectDifficulty('medium')}>Medium</button>
        <button className="difficulty-btn hard" onClick={() => selectDifficulty('hard')}>Hard</button>
        <button className="mode-btn change" onClick={changeMode} style={{marginTop: '1rem', backgroundColor: '#6c757d'}}>Back</button>
      </div>
    );
  } else {
    // View 3: The Game Board
    currentView = (
      <>
        <ScoreBoard {...scores} />
        <Board 
          key={boardKey} 
          onFinish={handleFinish} 
          gameMode={gameMode} 
          difficulty={difficulty} // Pass difficulty to the board
        />
        <div className="button-row">
          <button className="play-btn" onClick={playAgain}>Play Again</button>
          <button className="reset-btn" onClick={resetScores}>Reset Scores</button>
          <button className="mode-btn change" onClick={changeMode}>Change Mode</button>
        </div>
      </>
    );
  }

  return (
    <div className="app-container">
      <img src="game-logo.jpg" alt="Logo" className="logo" />
      {currentView}
    </div>
  );
}