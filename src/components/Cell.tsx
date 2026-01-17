import React from 'react';
import { CellState, SIZES } from '../types';
import PieceComponent from './Piece';
import styles from './Cell.module.css';

interface CellProps {
  state: CellState;
  onClick: () => void;
}

const CellComponent: React.FC<CellProps> = ({ state, onClick }) => {
  return (
    <div className={styles.cell} onClick={onClick}>
      {state.map((piece, index) => {
        if (!piece) return null;
        const size = SIZES[index];
        return <PieceComponent key={index} player={piece.player} size={size} />;
      })}
    </div>
  );
};

export default CellComponent;
