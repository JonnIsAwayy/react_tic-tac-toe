import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './Game.jsx';   // ← renders the wrapper with scoreboard
import './index.css';            // global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
