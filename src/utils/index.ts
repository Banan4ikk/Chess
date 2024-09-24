import { COLORS, DIRECTIONS } from "../constants";
import { PieceType } from "../components/cell";
import {
  getBishopMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "./getPicesMoves.ts";

export const generateId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getDirectionIndexes = (
  color: COLORS | null,
  direction: DIRECTIONS
) => {
  switch (direction) {
    case DIRECTIONS.LEFT:
      return color === COLORS.white ? -1 : 1;
    case DIRECTIONS.RIGHT:
      return color === COLORS.white ? 1 : -1;
    case DIRECTIONS.STRAIGHT:
      return color === COLORS.white ? -8 : 8;
    default:
      return 0;
  }
};

export const checkIsInBounds = (target: number) => {
  return target >= 0 && target < 64;
};
export const isOccupiedByPiece = (index: number, board: Array<PieceType>) => {
  return board[index] && board[index].type !== null;
};
export const isEnemyPiece = (
  index: number,
  board: Array<PieceType>,
  color: COLORS | null
) => {
  if (!color) return false;
  return (
    board[index] && board[index].color !== color && board[index].color !== null
  );
};
export const checkIsLeftEdge = (index: number) => {
  return index % 8 === 0;
};

export const checkIsRightEdge = (index: number) => {
  return index % 8 === 7;
};

export const checkIsTopEdge = (index: number) => {
  return Math.floor(index / 8) === 0;
};

export const checkIsBottomEdge = (index: number) => {
  return Math.floor(index / 8) === 7;
};

export const findKingIndex = (color: COLORS, board: Array<PieceType>) => {
  return board.findIndex(
    (item) => item.color === color && item.type === "king"
  );
};

export const getAvailableMovesForPiece = (
  piece: PieceType,
  index: number,
  board: Array<PieceType>
) => {
  let moves: Array<number> = [];
  // Определяем ходы для каждой фигуры в зависимости от её типа
  switch (piece.type) {
    case "bishop":
      moves = getBishopMoves(piece, index, board);
      break;
    case "rook":
      moves = getRookMoves(piece, index, board);
      break;
    case "queen":
      moves = getQueenMoves(piece, index, board);
      break;
    case "knight":
      moves = getKnightMoves(piece, index, board);
      break;
    case "pawn":
      moves = getPawnMoves(piece, index, board);
      break;
    default:
      moves = [];
  }
  return moves;
};

export const isSquareUnderAttack = (
  square: number,
  enemyColor: COLORS,
  board: Array<PieceType>
) => {
  for (const piece of board) {
    let moves: Array<number> = [];
    if (piece.index)
      moves = getAvailableMovesForPiece(piece, piece.index, board);
    if (piece.color === enemyColor && moves.includes(square)) {
      return true;
    }
  }
  return false;
};

// Проверка, находится ли король под шахом
export const isKingInCheck = (
  color: COLORS | null,
  board: Array<PieceType>
) => {
  if (!color) return false;
  const kingIndex = board.findIndex(
    (piece) => piece.type === "king" && piece.color === color
  );
  if (kingIndex === -1) return false; // Если король не найден

  return board.some((piece, index) => {
    if (piece.color !== color) {
      const availableMoves = getAvailableMovesForPiece(piece, index, board);
      return availableMoves.includes(kingIndex);
    }
    return false;
  });
};
