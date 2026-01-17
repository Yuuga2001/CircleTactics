import React from 'react';
import { Player, HandState, PieceSize, SIZES } from '../types';
import styles from './PlayerHand.module.css';

interface PlayerHandProps {
  player: Player;
  hand: HandState;
  selectedSize: PieceSize | null;
  onSelectSize: (size: PieceSize) => void;
  isCurrentPlayer: boolean;
}

const PlayerHandComponent: React.FC<PlayerHandProps> = ({ player, hand, selectedSize, onSelectSize, isCurrentPlayer }) => {
  const containerClasses = [
    styles.handContainer,
    styles[player.toLowerCase()],
    isCurrentPlayer ? styles.active : '',
  ].join(' ');

  return (
    <div className={containerClasses}>
      <h3 className={styles.playerTitle}>Your Hand</h3>
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
