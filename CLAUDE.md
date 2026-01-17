# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CircleTactics is a 4-player strategic board game built with React + TypeScript + Vite. It evolves Tic-Tac-Toe into a more complex game with a 4×4 board, 3-sized pieces (SMALL/MEDIUM/LARGE), and 2 victory conditions.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Type-check with tsc, then build with Vite
npm run lint     # ESLint check (--max-warnings 0)
npm run preview  # Preview production build
```

## Architecture

### State Management
The game uses `useReducer` pattern in [Game.tsx](src/components/Game.tsx) with actions defined in [types/index.ts](src/types/index.ts):
- `SELECT_SIZE` - Select a piece size to place
- `PLACE_PIECE` - Place selected piece on board
- `RESTART_GAME` - Reset game state

### Core Types ([types/index.ts](src/types/index.ts))
- `Player`: 'RED' (human) | 'BLUE' | 'YELLOW' | 'GREEN' (AI)
- `PieceSize`: 'SMALL' | 'MEDIUM' | 'LARGE'
- `CellState`: Tuple `[SMALL, MEDIUM, LARGE]` - each cell can hold one piece of each size
- `BoardState`: 4×4 grid of CellState

### Game Logic ([logic/](src/logic/))
- `gameReducer.ts` - State transitions, turn order (RED→BLUE→YELLOW→GREEN), random starting player
- `winConditions.ts` - Two win conditions:
  - **Cell Win**: One cell contains all 3 sizes from same player
  - **Board Win**: 4 cells in a row/column/diagonal with player's pieces
- `ai.ts` - AI priority: (1) Win if possible → (2) Block opponent win → (3) Random valid move

### Component Flow
```
App.tsx → Game.tsx (useReducer + AI useEffect)
         ├── OpponentHandsSummary (AI hands display)
         ├── Board → Cell → Piece
         └── PlayerHand (human's hand)
```

### Styling
CSS Modules (`.module.css` files) with CSS Custom Properties for theming.

## Game Constants
- Board size: 4×4
- Pieces per player: 5 of each size (15 total)
- AI thinking delay: 1000ms
- Human player: always RED
