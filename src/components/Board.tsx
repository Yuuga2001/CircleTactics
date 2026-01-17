import React from 'react';
import { BoardState } from '../types';
import CellComponent from './Cell';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
}

const BoardComponent: React.FC<BoardProps> = ({ board, onCellClick }) => {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cellState, colIndex) => (
          <CellComponent
            key={`${rowIndex}-${colIndex}`}
            state={cellState}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default BoardComponent;
