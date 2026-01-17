import React from 'react';
import { Player, HandState, PieceSize, SIZES } from '../types';
import styles from './PlayerHand.module.css';

interface PlayerHandProps {
  player: Player;
  hand: HandState;
  selectedSize: PieceSize | null;
  onSelectSize: (size: PieceSize) => void;
  isCurrentPlayer: boolean;
  isOpponent: boolean;
  playerName: string;
  position: 'top' | 'bottom'; // Position is now more specific
}

const PlayerHandComponent: React.FC<PlayerHandProps> = ({ player, hand, selectedSize, onSelectSize, isCurrentPlayer, isOpponent, playerName, position }) => {
  const containerClasses = [
    styles.handContainer,
    isOpponent ? styles.opponent : styles.player,
    styles[player.toLowerCase()],
    isCurrentPlayer && !isOpponent ? styles.active : '',
    styles[position], // Directly use 'top' or 'bottom' class
  ].join(' ');

  return (
    <div className={containerClasses}>
      <h3 className={styles.playerTitle}>{playerName}</h3>
      <div className={styles.pieces}>
        {SIZES.map(size => (
          <div
            key={size}
            className={`${styles.pieceSelector} ${selectedSize === size && isCurrentPlayer ? styles.selected : ''} ${!isCurrentPlayer || hand[size] === 0 ? styles.disabled : ''}`}
            onClick={() => {
              if (isCurrentPlayer && hand[size] > 0) {
                onSelectSize(size);
              }
            }}
          >
            <div className={`${styles.piecePreview} ${styles[player.toLowerCase()]} ${styles[size.toLowerCase()]}`}></div>
            <span className={styles.pieceCount}>x {hand[size]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHandComponent;
