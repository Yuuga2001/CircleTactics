export type Player = 'RED' | 'BLUE' | 'YELLOW' | 'GREEN';

export type PieceSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export const SIZES: PieceSize[] = ['SMALL', 'MEDIUM', 'LARGE'];
export const PLAYERS: Player[] = ['RED', 'BLUE', 'YELLOW', 'GREEN'];
export const AI_PLAYERS: Player[] = ['BLUE', 'YELLOW', 'GREEN']; // AI A, B, C に相当

export type Piece = {
  player: Player;
  size: PieceSize;
};

// A cell can contain up to three pieces, one of each size.
// The tuple represents [SMALL, MEDIUM, LARGE]. A null indicates no piece of that size.
export type CellState = [Piece | null, Piece | null, Piece | null];

// The board is a 4x4 grid of cells.
export type BoardState = [
  [CellState, CellState, CellState, CellState],
  [CellState, CellState, CellState, CellState],
  [CellState, CellState, CellState, CellState],
  [CellState, CellState, CellState, CellState]
];

// Represents the number of pieces of each size a player has.
export type HandState = Record<PieceSize, number>;

export type GameMode = 'AI_4PLAYER'; // 4人対戦AIモードのみ

export interface GameState {
  board: BoardState;
  hands: Record<Player, HandState>;
  currentPlayer: Player;
  winner: Player | null;
  selectedSize: PieceSize | null;
  gameMode: GameMode;
}

export type Action =
  | { type: 'SELECT_SIZE'; payload: PieceSize }
  | { type: 'PLACE_PIECE'; payload: { row: number; col: number } }
  | { type: 'RESTART_GAME'; payload?: { mode: GameMode } };
