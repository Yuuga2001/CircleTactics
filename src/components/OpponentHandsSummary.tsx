import React from 'react';
import { Player, HandState, SIZES, AI_PLAYERS } from '../types';
import styles from './OpponentHandsSummary.module.css';

interface OpponentHandsSummaryProps {
  hands: Record<Player, HandState>;
  currentPlayer: Player;
}

const OpponentHandsSummary: React.FC<OpponentHandsSummaryProps> = ({ hands, currentPlayer }) => {
  const getPlayerName = (player: Player) => {
    if (AI_PLAYERS.includes(player)) {
      return player; // Return the color name directly, e.g., "BLUE"
    }
    return '';
  };

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.gridHeader}>
        <div>Player</div>
        <div>Small</div>
        <div>Medium</div>
        <div>Large</div>
      </div>
      {AI_PLAYERS.map(player => (
        <div key={player} className={`${styles.gridRow} ${currentPlayer === player ? styles.active : ''}`}>
          <div className={styles.playerNameCell}>
            <span className={`${styles.playerColorIndicator} ${styles[player.toLowerCase()]}`}></span>
            {getPlayerName(player)}
          </div>
          {SIZES.map(size => (
            <div key={size} className={styles.pieceCell}>
              <span className={styles.pieceCount}>{hands[player][size]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OpponentHandsSummary;
