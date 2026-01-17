import { BoardState, CellState, Player } from '../types';

const BOARD_SIZE = 4; // New board size

/**
 * Checks if a cell contains at least one piece owned by the specified player.
 * @param cell The state of the cell.
 * @param player The player to check for.
 * @returns True if the cell contains any piece of the player, false otherwise.
 */
const hasAnyPieceOfPlayer = (cell: CellState, player: Player): boolean => {
  return cell.some(piece => piece && piece.player === player);
};

/**
 * Checks for a "Board Win" (4 in a row, column, or diagonal).
 * This is based on whether any piece in a cell belongs to the player.
 * @param board The current board state.
 * @param player The player to check for a win.
 * @returns True if the player has won, false otherwise.
 */
const checkBoardWin = (board: BoardState, player: Player): boolean => {
  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c <= BOARD_SIZE - 4; c++) {
      if (
        hasAnyPieceOfPlayer(board[r][c], player) &&
        hasAnyPieceOfPlayer(board[r][c + 1], player) &&
        hasAnyPieceOfPlayer(board[r][c + 2], player) &&
        hasAnyPieceOfPlayer(board[r][c + 3], player)
      ) {
        return true;
      }
    }
  }

  // Check columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r <= BOARD_SIZE - 4; r++) {
      if (
        hasAnyPieceOfPlayer(board[r][c], player) &&
        hasAnyPieceOfPlayer(board[r + 1][c], player) &&
        hasAnyPieceOfPlayer(board[r + 2][c], player) &&
        hasAnyPieceOfPlayer(board[r + 3][c], player)
      ) {
        return true;
      }
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let r = 0; r <= BOARD_SIZE - 4; r++) {
    for (let c = 0; c <= BOARD_SIZE - 4; c++) {
      if (
        hasAnyPieceOfPlayer(board[r][c], player) &&
        hasAnyPieceOfPlayer(board[r + 1][c + 1], player) &&
        hasAnyPieceOfPlayer(board[r + 2][c + 2], player) &&
        hasAnyPieceOfPlayer(board[r + 3][c + 3], player)
      ) {
        return true;
      }
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let r = 0; r <= BOARD_SIZE - 4; r++) {
    for (let c = 3; c < BOARD_SIZE; c++) { // Start c from 3 for 4x4
      if (
        hasAnyPieceOfPlayer(board[r][c], player) &&
        hasAnyPieceOfPlayer(board[r + 1][c - 1], player) &&
        hasAnyPieceOfPlayer(board[r + 2][c - 2], player) &&
        hasAnyPieceOfPlayer(board[r + 3][c - 3], player)
      ) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks for a "Cell Win" (all 3 sizes in a single cell).
 * @param cell The cell to check.
 * @param player The player to check for a win.
 * @returns True if the player has won in that cell, false otherwise.
 */
const checkCellWin = (cell: CellState, player: Player): boolean => {
  return cell.every(piece => piece && piece.player === player);
};

/**
 * Checks all win conditions for a given player after a move.
 * @param board The new board state after a move.
 * @param player The player who just made a move.
 * @param moveCoords The coordinates of the move {row, col}.
 * @returns The winning player's name, or null if there is no winner yet.
 */
export const checkWinner = (board: BoardState, player: Player, moveCoords: {row: number, col: number}): Player | null => {
  // 1. Check for a Cell Win in the cell that was just played in.
  const movedCell = board[moveCoords.row][moveCoords.col];
  if (checkCellWin(movedCell, player)) {
    return player;
  }

  // 2. Check for a Board Win (4-in-a-row).
  if (checkBoardWin(board, player)) {
    return player;
  }
  
  // No winner yet
  return null;
};
