import React, { useReducer, useEffect } from 'react';
import { PieceSize, Player, AI_PLAYERS } from '../types';
import { gameReducer, createInitialGameState } from '../logic/gameReducer';
import { findBestMove } from '../logic/ai';
import BoardComponent from './Board';
import PlayerHandComponent from './PlayerHand';
import OpponentHandsSummary from './OpponentHandsSummary';
import styles from './Game.module.css';

const AI_THINKING_TIME = 1000;
const USER_PLAYER: Player = 'RED';

const GameComponent: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, createInitialGameState());
  const { board, hands, currentPlayer, winner, selectedSize } = gameState;

  useEffect(() => {
    if (AI_PLAYERS.includes(currentPlayer) && !winner) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(gameState);
        if (bestMove) {
          dispatch({ type: 'SELECT_SIZE', payload: bestMove.size });
          setTimeout(() => {
            dispatch({ type: 'PLACE_PIECE', payload: { row: bestMove.row, col: bestMove.col } });
          }, 200);
        }
      }, AI_THINKING_TIME);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, winner, gameState]);

  const handleSelectSize = (size: PieceSize) => {
    if (AI_PLAYERS.includes(currentPlayer)) return;
    dispatch({ type: 'SELECT_SIZE', payload: size });
  };

  const handleCellClick = (row: number, col: number) => {
    if (AI_PLAYERS.includes(currentPlayer)) return;
    dispatch({ type: 'PLACE_PIECE', payload: { row, col } });
  };
  
  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  const isAITurn = AI_PLAYERS.includes(currentPlayer) && !winner;

  const getPlayerName = (player: Player) => {
    if (player === USER_PLAYER) return 'You';
    if (AI_PLAYERS.includes(player)) {
      return player;
    }
    return 'Unknown';
  };

  const gameContainerClasses = `${styles.gameContainer} ${winner ? styles[winner.toLowerCase()] : ''}`;

  return (
    <div className={gameContainerClasses}>
      {winner && [...Array(50)].map((_, i) => <div key={i} className={styles.confetti} style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * -5}s` }}></div>)}

      <header className={styles.header}>
        {winner ? (
          <>
            <h1 className={`${styles.title} ${styles.victoryTitle}`}>{`${getPlayerName(winner)} WINS!`}</h1>
            <button onClick={handleRestart} className={styles.restartButton}>Play Again</button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>CircleTactics</h1>
            <button onClick={handleRestart} className={styles.restartButton}>New Game</button>
          </>
        )}
      </header>
      
      <div className={styles.opponentHandsContainer}>
        <OpponentHandsSummary hands={hands} currentPlayer={currentPlayer} />
      </div>

      <main className={styles.mainArea}>
        <BoardComponent board={board} onCellClick={handleCellClick} />
        <div className={styles.gameStatus}>
          {!winner && (
            <h2 className={styles.turnText}>
              {isAITurn ? `${getPlayerName(currentPlayer)} is thinking...` : `Turn: ${getPlayerName(currentPlayer)}`}
            </h2>
          )}
        </div>
      </main>

      <PlayerHandComponent
        player={USER_PLAYER}
        hand={hands[USER_PLAYER]}
        selectedSize={selectedSize}
        onSelectSize={handleSelectSize}
        isCurrentPlayer={currentPlayer === USER_PLAYER}
      />
    </div>
  );
};

export default GameComponent;

