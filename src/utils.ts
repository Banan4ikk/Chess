import { COLORS, DIRECTIONS } from "./constants";
import { PieceType } from "./components/cell";

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
