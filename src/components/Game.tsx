import React, { useReducer, useEffect } from 'react';
import { PieceSize, PLAYERS, Player, AI_PLAYERS } from '../types';
import { gameReducer, createInitialGameState } from '../logic/gameReducer';
import { findBestMove } from '../logic/ai';
import BoardComponent from './Board';
import PlayerHandComponent from './PlayerHand';
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
    if (AI_PLAYERS.includes(currentPlayer)) return; // Disable user interaction during AI turn
    dispatch({ type: 'SELECT_SIZE', payload: size });
  };

  const handleCellClick = (row: number, col: number) => {
    if (AI_PLAYERS.includes(currentPlayer)) return; // Disable user interaction during AI turn
    dispatch({ type: 'PLACE_PIECE', payload: { row, col } });
  };
  
  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  const isAITurn = AI_PLAYERS.includes(currentPlayer) && !winner;

  // Player names for display
  const getPlayerName = (player: Player) => {
    if (player === USER_PLAYER) return 'You';
    if (player === 'BLUE') return 'AI A';
    if (player === 'YELLOW') return 'AI B';
    if (player === 'GREEN') return 'AI C';
    return 'Unknown'; // Should not happen
  };

  const getUserPlayerHand = () => (
    <PlayerHandComponent
      player={USER_PLAYER}
      hand={hands[USER_PLAYER]}
      selectedSize={selectedSize}
      onSelectSize={handleSelectSize}
      isCurrentPlayer={currentPlayer === USER_PLAYER}
      isOpponent={false}
      playerName={getPlayerName(USER_PLAYER)}
      position='bottom' // 明示的にpositionを渡す
    />
  );

  const getAIPlayerHand = (aiPlayer: Player, position: 'top' | 'left' | 'right') => (
    <PlayerHandComponent
      player={aiPlayer}
      hand={hands[aiPlayer]}
      selectedSize={selectedSize} // AI doesn't have a selectedSize in the UI, but required by prop
      onSelectSize={() => {}} // AI doesn't interact with hand UI
      isCurrentPlayer={currentPlayer === aiPlayer}
      isOpponent={true}
      playerName={getPlayerName(aiPlayer)}
      position={position} // Custom prop for positioning
    />
  );

  return (
    <div className={`${styles.gameContainer} ${isAITurn ? styles.aiTurn : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>CircleTactics (4-Player AI)</h1>
        <button onClick={handleRestart} className={styles.restartButton}>Play Again</button>
      </header>
      
      {getAIPlayerHand('BLUE', 'left')} {/* AI A (Left) */}
      {getAIPlayerHand('YELLOW', 'top')} {/* AI B (Top) */}
      {getAIPlayerHand('GREEN', 'right')} {/* AI C (Right) */}

      <main className={styles.mainArea}>
        <BoardComponent board={board} onCellClick={handleCellClick} />
        <div className={styles.gameStatus}>
          {winner ? (
            <h2 className={styles.winnerText}>{`${getPlayerName(winner)} WINS!`}</h2>
          ) : (
            <h2 className={styles.turnText}>
              {isAITurn ? `${getPlayerName(currentPlayer)} is thinking...` : `Turn: ${getPlayerName(currentPlayer)}`}
            </h2>
          )}
        </div>
      </main>

      {getUserPlayerHand()} {/* User (Bottom) */}

      {winner && (
        <div className={styles.modalOverlay}>
          <div className={styles.winnerModal}>
            <h2>{`${getPlayerName(winner)} Wins!`}</h2>
            <button className={styles.resetButton} onClick={handleRestart}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameComponent;
