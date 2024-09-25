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
  isEnemyPiece,
  isOccupiedByPiece,
  isSquareUnderAttack,
} from "./index";

type Board = Array<PieceType>;

type Direction = { index: number; direction: DIRECTIONS };

export const getDirectionsByPiece = (piece: PieceType) => {
  const directions: Array<Direction> = [];

  const bishopMoves = [
    {
      index:
        getDirectionIndexes(piece.color, DIRECTIONS.RIGHT) +
        getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT),
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
        getDirectionIndexes(piece.color, DIRECTIONS.LEFT) +
        getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -1,
      direction: DIRECTIONS.LEFT,
    },
    {
      index:
        getDirectionIndexes(piece.color, DIRECTIONS.RIGHT) +
        getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * -1,
      direction: DIRECTIONS.RIGHT,
    },
  ];

  const rookMoves = [
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
  ];

  // Добавляем движения слона
  if (piece.type === "bishop" || piece.type === "queen") {
    directions.push(...bishopMoves);
  }

  // Добавляем движения ладьи
  if (piece.type === "rook" || piece.type === "queen") {
    directions.push(...rookMoves);
  }

  return piece.color === COLORS.black
    ? directions.map((dir) => ({ ...dir, index: -dir.index }))
    : directions;
};
export const getBishopMoves = (
  piece: PieceType,
  index: number,
  board: Board
) => {
  const moves: Array<number> = [];

  const directions = getDirectionsByPiece(piece) as Array<Direction>;

  directions.forEach(({ direction, index: targetIndex }) => {
    let target = index + targetIndex;
    while (checkIsInBounds(target)) {
      if (
        isOccupiedByPiece(target, board) &&
        !isEnemyPiece(target, board, piece.color)
      ) {
        // Если на клетке своя фигура, нужно остановить движение
        return;
      }

      // Если на клетке вражеская фигура, добавляем ее
      if (
        isOccupiedByPiece(target, board) &&
        isEnemyPiece(target, board, piece.color)
      ) {
        moves.push(target);
        return; // В этом случае мы выходим из цикла
      }

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
  });
  return moves;
};

// Функция для получения доступных ходов для ладьи
export const getRookMoves = (piece: PieceType, index: number, board: Board) => {
  const moves: Array<number> = [];

  const directions = getDirectionsByPiece(piece) as Array<Direction>;

  directions.forEach(({ index: targetIndex, direction }) => {
    let target = index + targetIndex;
    while (checkIsInBounds(target)) {
      if (
        isOccupiedByPiece(target, board) &&
        !isEnemyPiece(target, board, piece.color)
      ) {
        // Если на клетке своя фигура, нужно остановить движение
        return;
      }

      // Если на клетке вражеская фигура, добавляем ее
      if (
        isOccupiedByPiece(target, board) &&
        isEnemyPiece(target, board, piece.color)
      ) {
        moves.push(target);
        return; // В этом случае мы выходим из цикла
      }

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
  });
  return moves;
};

export const getPawnMoves = (piece: PieceType, index: number, board: Board) => {
  const moves: Array<number> = [];
  const firstMoveDirection =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2;
  const direction = getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT);
  const attackLeft =
    index + direction + getDirectionIndexes(piece.color, DIRECTIONS.LEFT);
  const attackRight =
    index + direction + getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);

  const target = index + direction;
  const firstMoveTarget = index + firstMoveDirection;
  if (!checkIsInBounds(target)) return moves;
  if (
    isOccupiedByPiece(target, board) &&
    !isEnemyPiece(target, board, piece.color)
  )
    return moves;

  const isEnemyLeft = isEnemyPiece(attackLeft, board, piece.color);
  const isEnemyRight = isEnemyPiece(attackRight, board, piece.color);

  if (
    (isOccupiedByPiece(target, board) ||
      isOccupiedByPiece(attackRight, board) ||
      isOccupiedByPiece(attackLeft, board)) &&
    (isEnemyLeft || isEnemyRight)
  ) {
    if (isEnemyRight) {
      moves.push(attackRight);
    }
    if (isEnemyLeft) moves.push(attackLeft);
  }
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
      isOccupiedByPiece(move, board) &&
      !isEnemyPiece(move, board, piece.color)
    ) {
      // Если на клетке своя фигура, нужно остановить движение
      return;
    }

    // Если на клетке вражеская фигура, добавляем ее
    if (
      isOccupiedByPiece(move, board) &&
      isEnemyPiece(move, board, piece.color)
    ) {
      endMoves.push(move);
      return; // В этом случае мы выходим из цикла
    }

    if (
      Math.abs(currentRow - targetRow) === Math.abs(rowChange) &&
      Math.abs(currentCol - targetCol) === Math.abs(colChange) &&
      checkIsInBounds(move)
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
    if (isSquareUnderAttack(target, enemyColor, board)) return;

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
