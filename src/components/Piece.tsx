import React from 'react';
import { Player, PieceSize } from '../types';
import styles from './Piece.module.css';

interface PieceProps {
  player: Player;
  size: PieceSize;
}

const PieceComponent: React.FC<PieceProps> = ({ player, size }) => {
  const className = `${styles.piece} ${styles[player.toLowerCase()]} ${styles[size.toLowerCase()]}`;
  return <div className={className}></div>;
};

export default PieceComponent;
