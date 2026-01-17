import { GameState, Action, SIZES, Player, BoardState, HandState, PLAYERS } from '../types';
import { checkWinner } from './winConditions';

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SELECT_SIZE': {
      // Cannot select size if they have no pieces of that size or if game is over
      if (state.winner || state.hands[state.currentPlayer][action.payload] === 0) {
        return state;
      }
      return {
        ...state,
        selectedSize: state.selectedSize === action.payload ? null : action.payload,
      };
    }

    case 'PLACE_PIECE': {
      const { row, col } = action.payload;
      const { selectedSize, currentPlayer, board, hands, winner } = state;

      if (!selectedSize || winner) return state;
      if (hands[currentPlayer][selectedSize] <= 0) return state;
      
      const sizeIndex = SIZES.indexOf(selectedSize);
      // Check if the exact size slot is already occupied
      if (board[row][col][sizeIndex] !== null) return state;

      const newBoard = board.map(r => r.map(c => [...c])) as BoardState;
      const newHands = JSON.parse(JSON.stringify(hands)) as Record<Player, HandState>;

      newBoard[row][col][sizeIndex] = { player: currentPlayer, size: selectedSize };
      newHands[currentPlayer][selectedSize]--;

      const newWinner = checkWinner(newBoard, currentPlayer, { row, col });
      if (newWinner) {
        return { ...state, board: newBoard, hands: newHands, winner: newWinner, selectedSize: null };
      }

      // Determine next player in counter-clockwise order for 4 players
      const currentPlayerIndex = PLAYERS.indexOf(currentPlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
      const nextPlayer = PLAYERS[nextPlayerIndex];
      
      return { ...state, board: newBoard, hands: newHands, currentPlayer: nextPlayer, selectedSize: null };
    }

    case 'RESTART_GAME': {
      // Always restart in AI_4PLAYER mode
      return createInitialGameState();
    }

    default:
      return state;
  }
}

export const createInitialGameState = (): GameState => {
    const initialHand: HandState = { SMALL: 5, MEDIUM: 5, LARGE: 5 };
    const initialHands: Record<Player, HandState> = {
      RED: { ...initialHand },
      BLUE: { ...initialHand },
      YELLOW: { ...initialHand },
      GREEN: { ...initialHand },
    };

    return {
        board: Array(4).fill(null).map(() => Array(4).fill(null).map(() => [null, null, null])) as BoardState,
        hands: initialHands,
        currentPlayer: PLAYERS[Math.floor(Math.random() * PLAYERS.length)], // Random starting player
        winner: null,
        selectedSize: null,
        gameMode: 'AI_4PLAYER',
    };
};

