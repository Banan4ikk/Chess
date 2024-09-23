// Функция для получения доступных ходов для слона
import { PieceType } from "../components/cell";
import { COLORS, DIRECTIONS } from "../constants";
import {
  checkIsBottomEdge,
  checkIsInBounds,
  checkIsLeftEdge,
  checkIsRightEdge,
  checkIsTopEdge,
  findKingIndex,
  getDirectionIndexes,
  isOccupiedByPiece,
  isSquareUnderAttack,
} from "./index";

type Board = Array<PieceType>;

export const getBishopMoves = (
  piece: PieceType,
  index: number,
  board: Board
) => {
  const topRight = {
    index:
      getDirectionIndexes(piece.color, DIRECTIONS.RIGHT) +
      getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
    direction: DIRECTIONS.RIGHT,
  };
  const topLeft = {
    index:
      getDirectionIndexes(piece.color, DIRECTIONS.LEFT) +
      getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
    direction: DIRECTIONS.LEFT,
  };
  const bottomLeft = {
    index:
      getDirectionIndexes(piece.color, DIRECTIONS.LEFT) +
      getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -1,
    direction: DIRECTIONS.LEFT,
  };
  const bottomRight = {
    index:
      getDirectionIndexes(piece.color, DIRECTIONS.RIGHT) +
      getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -1,
    direction: DIRECTIONS.RIGHT,
  };

  const directions = [bottomLeft, topRight, topLeft, bottomRight];
  const blackMoves = directions.map((item) => ({
    ...item,
    index: -item.index,
  }));
  const moves: Array<number> = [];

  (piece.color === COLORS.white ? directions : blackMoves).forEach(
    ({ direction, index: targetIndex }) => {
      let target = index + targetIndex;
      while (checkIsInBounds(target)) {
        if (isOccupiedByPiece(target, board)) return;

        if (
          (direction === DIRECTIONS.RIGHT && checkIsRightEdge(index)) ||
          (direction === DIRECTIONS.LEFT && checkIsLeftEdge(index))
        )
          return;
        moves.push(target);
        if (
          (direction === DIRECTIONS.RIGHT && checkIsRightEdge(target)) ||
          (direction === DIRECTIONS.LEFT && checkIsLeftEdge(target))
        )
          return;
        target += targetIndex;
      }
    }
  );
  return moves;
};

// Функция для получения доступных ходов для ладьи
export const getRookMoves = (piece: PieceType, index: number, board: Board) => {
  const topMove = {
    index: getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
    direction: DIRECTIONS.STRAIGHT,
  };
  const backMove = {
    index: -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
    direction: DIRECTIONS.BOTTOM,
  };

  const rightMove = {
    index: getDirectionIndexes(piece.color, DIRECTIONS.RIGHT),
    direction: DIRECTIONS.RIGHT,
  };
  const leftMove = {
    index: getDirectionIndexes(piece.color, DIRECTIONS.LEFT),
    direction: DIRECTIONS.LEFT,
  };

  const directions = [topMove, backMove, rightMove, leftMove];
  const blackDirections = directions.map((dir) => ({
    ...dir,
    index: -dir.index,
  }));

  const moves: Array<number> = [];

  (piece.color === COLORS.white ? directions : blackDirections).forEach(
    ({ index: targetIndex, direction }) => {
      let target = index + targetIndex;
      while (checkIsInBounds(target)) {
        if (isOccupiedByPiece(target, board)) break;

        if (
          (direction === DIRECTIONS.RIGHT && checkIsRightEdge(index)) ||
          (direction === DIRECTIONS.LEFT && checkIsLeftEdge(index)) ||
          (direction === DIRECTIONS.BOTTOM && checkIsBottomEdge(index)) ||
          (direction === DIRECTIONS.STRAIGHT && checkIsTopEdge(index))
        )
          return;

        moves.push(target);
        if (
          (direction === DIRECTIONS.RIGHT && checkIsRightEdge(target)) ||
          (direction === DIRECTIONS.LEFT && checkIsLeftEdge(target)) ||
          (direction === DIRECTIONS.BOTTOM && checkIsBottomEdge(target)) ||
          (direction === DIRECTIONS.STRAIGHT && checkIsTopEdge(target))
        )
          return;
        target += targetIndex;
      }
    }
  );
  return moves;
};

export const getPawnMoves = (piece: PieceType, index: number, board: Board) => {
  const moves: Array<number> = [];
  const firstMoveDirection =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2;
  const direction = getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT);
  const target = index + direction;
  const firstMoveTarget = index + firstMoveDirection;
  if (isOccupiedByPiece(target, board) || !checkIsInBounds(target)) return [];
  moves.push(target);
  if (
    !isOccupiedByPiece(firstMoveTarget, board) &&
    piece.isFirstMove === true &&
    checkIsInBounds(firstMoveTarget)
  ) {
    moves.push(firstMoveTarget);
  }
  return moves;
};

export const getKnightMoves = (
  piece: PieceType,
  index: number,
  board: Board
) => {
  const endMoves: Array<number> = [];
  const directionRight =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2 +
    getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const directionLeft =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2 +
    getDirectionIndexes(piece.color, DIRECTIONS.LEFT);
  const directionBackRight =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -2 +
    getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const directionBackLeft =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -2 +
    getDirectionIndexes(piece.color, DIRECTIONS.LEFT);

  const directionRightLine =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    2 * getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const directionLeftLine =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    2 * getDirectionIndexes(piece.color, DIRECTIONS.LEFT);
  const directionBackRightLine =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    -2 * getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const directionBackLeftLine =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    -2 * getDirectionIndexes(piece.color, DIRECTIONS.LEFT);

  const targetStraightRight = index + directionRight;
  const targetStraightLeft = index + directionLeft;
  const targetBackRight = index + directionBackRight;
  const targetBackLeft = index + directionBackLeft;
  const targetStraightRightLine = index + directionRightLine;
  const targetStraightLeftLine = index + directionLeftLine;
  const targetBackRightLine = index + directionBackRightLine;
  const targetBackLeftLine = index + directionBackLeftLine;

  const moves = [
    { move: targetStraightRight, rowChange: 2, colChange: 1 },
    { move: targetStraightLeft, rowChange: 2, colChange: -1 },
    { move: targetBackRight, rowChange: -2, colChange: 1 },
    { move: targetBackLeft, rowChange: -2, colChange: -1 },
    { move: targetStraightRightLine, rowChange: 1, colChange: 2 },
    { move: targetStraightLeftLine, rowChange: 1, colChange: -2 },
    { move: targetBackRightLine, rowChange: -1, colChange: 2 },
    { move: targetBackLeftLine, rowChange: -1, colChange: -2 },
  ];

  moves.forEach(({ move, rowChange, colChange }) => {
    const currentRow = Math.floor(index / 8);
    const currentCol = index % 8;
    const targetRow = Math.floor(move / 8);
    const targetCol = move % 8;

    if (
      Math.abs(currentRow - targetRow) === Math.abs(rowChange) &&
      Math.abs(currentCol - targetCol) === Math.abs(colChange) &&
      checkIsInBounds(move) &&
      !isOccupiedByPiece(move, board)
    ) {
      endMoves.push(move);
    }
  });
  return endMoves;
};

export const getQueenMoves = (
  piece: PieceType,
  index: number,
  board: Board
) => {
  return [
    ...getBishopMoves(piece, index, board),
    ...getRookMoves(piece, index, board),
  ];
};

export const getKingMoves = (piece: PieceType, index: number, board: Board) => {
  const moves: Array<number> = [];
  const directions = [
    {
      index: getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
      direction: DIRECTIONS.STRAIGHT,
    },
    {
      index: -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
      direction: DIRECTIONS.BOTTOM,
    },
    {
      index: getDirectionIndexes(piece.color, DIRECTIONS.RIGHT),
      direction: DIRECTIONS.RIGHT,
    },
    {
      index: getDirectionIndexes(piece.color, DIRECTIONS.LEFT),
      direction: DIRECTIONS.LEFT,
    },
    {
      index:
        getDirectionIndexes(piece.color, DIRECTIONS.RIGHT) +
        getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
      direction: DIRECTIONS.RIGHT,
    },
    {
      index:
        -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
        getDirectionIndexes(piece.color, DIRECTIONS.RIGHT),
      direction: DIRECTIONS.RIGHT,
    },
    {
      index:
        getDirectionIndexes(piece.color, DIRECTIONS.LEFT) +
        getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
      direction: DIRECTIONS.LEFT,
    },
    {
      index:
        -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
        getDirectionIndexes(piece.color, DIRECTIONS.LEFT),
      direction: DIRECTIONS.LEFT,
    },
  ];

  const enemyColor = piece.color === COLORS.black ? COLORS.white : COLORS.black;
  const enemyKingIndex = findKingIndex(enemyColor, board);
  const enemyKingMoves: Array<number> = [];

  // Собираем возможные ходы вражеского короля
  directions.forEach(({ index: enemyTargetIndex }) => {
    const enemyTarget = enemyKingIndex + enemyTargetIndex;
    if (
      checkIsInBounds(enemyTarget) &&
      !isOccupiedByPiece(enemyTarget, board)
    ) {
      enemyKingMoves.push(enemyTarget);
    }
  });

  // Проверяем ходы текущего короля
  directions.forEach(({ direction, index: targetIndex }) => {
    const target = index + targetIndex;

    // Проверка на радиус вражеского короля
    if (enemyKingMoves.includes(target)) return; // Пропускаем, если клетка рядом с вражеским королем

    // Проверяем, под атакой ли клетка
    if (isSquareUnderAttack(target, enemyColor, board, index)) return;

    // Проверяем границы доски
    if (!checkIsInBounds(target) || isOccupiedByPiece(target, board)) return;

    // Проверка краёв доски
    if (
      (direction === DIRECTIONS.RIGHT && checkIsRightEdge(index)) ||
      (direction === DIRECTIONS.LEFT && checkIsLeftEdge(index)) ||
      (direction === DIRECTIONS.BOTTOM && checkIsBottomEdge(index)) ||
      (direction === DIRECTIONS.STRAIGHT && checkIsTopEdge(index))
    )
      return;

    // Добавляем допустимый ход
    moves.push(target);
  });

  return moves;
};
