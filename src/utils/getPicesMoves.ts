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
  getEnemyColor,
  isEnemyPiece,
  isOccupiedByPiece,
  isSquareProtected,
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
  board: Board,
  withMyFigures?: boolean
) => {
  const moves: Array<number> = [];

  const directions = getDirectionsByPiece(piece) as Array<Direction>;

  directions.forEach(({ direction, index: targetIndex }) => {
    let target = index + targetIndex;
    while (checkIsInBounds(target)) {
      // Если флаг включен, добавляем все клетки (включая свои)
      if (withMyFigures) {
        moves.push(target);
        // Если на клетке есть своя фигура, выходим из цикла
        if (
          isOccupiedByPiece(target, board) &&
          !isEnemyPiece(target, board, piece.color)
        ) {
          return;
        }
      } else {
        // Если на клетке своя фигура, нужно остановить движение
        if (
          isOccupiedByPiece(target, board) &&
          !isEnemyPiece(target, board, piece.color)
        ) {
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
      }

      // Проверка границ доски
      if (
        (direction === DIRECTIONS.RIGHT && checkIsRightEdge(target)) ||
        (direction === DIRECTIONS.LEFT && checkIsLeftEdge(target))
      ) {
        return;
      }

      moves.push(target);
      target += targetIndex;
    }
  });
  return moves;
};

// Функция для получения доступных ходов для ладьи
export const getRookMoves = (
  piece: PieceType,
  index: number,
  board: Board,
  withMyFigures?: boolean
) => {
  const moves: Array<number> = [];

  const directions = getDirectionsByPiece(piece) as Array<Direction>;

  directions.forEach(({ index: targetIndex, direction }) => {
    let target = index + targetIndex;
    while (checkIsInBounds(target)) {
      // Если флаг включен, добавляем все клетки (включая свои)
      if (withMyFigures) {
        moves.push(target);
        // Если на клетке есть своя фигура, выходим из цикла
        if (
          isOccupiedByPiece(target, board) &&
          !isEnemyPiece(target, board, piece.color)
        ) {
          return;
        }
      } else {
        // Если на клетке своя фигура, нужно остановить движение
        if (
          isOccupiedByPiece(target, board) &&
          !isEnemyPiece(target, board, piece.color)
        ) {
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
      }

      // Проверка границ доски
      if (
        (direction === DIRECTIONS.RIGHT && checkIsRightEdge(target)) ||
        (direction === DIRECTIONS.LEFT && checkIsLeftEdge(target)) ||
        (direction === DIRECTIONS.BOTTOM && checkIsBottomEdge(target)) ||
        (direction === DIRECTIONS.STRAIGHT && checkIsTopEdge(target))
      ) {
        return;
      }

      moves.push(target);
      target += targetIndex;
    }
  });
  return moves;
};

export const getPawnMoves = (
  piece: PieceType,
  index: number,
  board: Board,
  includeAttack?: boolean,
  withOnlyAttack?: boolean,
  withMyFigures?: boolean // Добавлен новый флаг
) => {
  let moves: Array<number> = [];
  const firstMoveDirection =
    getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2;
  const direction = getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT);
  const attackLeft =
    index + direction + getDirectionIndexes(piece.color, DIRECTIONS.LEFT);
  const attackRight =
    index + direction + getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);

  const target = index + direction;
  const firstMoveTarget = index + firstMoveDirection;

  // Проверяем, что целевая клетка в пределах доски
  if (!checkIsInBounds(target)) return moves;

  // Если на целевой клетке своя фигура, выходим
  if (isOccupiedByPiece(target, board) && !withMyFigures) return moves;

  const isEnemyLeft = isEnemyPiece(attackLeft, board, piece.color);
  const isEnemyRight = isEnemyPiece(attackRight, board, piece.color);

  // Проверяем, есть ли вражеские фигуры на клетках атаки
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

  const rightMove = index + getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const leftMove = index + getDirectionIndexes(piece.color, DIRECTIONS.LEFT);

  const isEnemyPawnRight = isEnemyPiece(rightMove, board, piece.color);
  const isEnemyPawnLeft = isEnemyPiece(leftMove, board, piece.color);

  // Проверяем возможность взятия на проходе
  if (isEnemyPawnRight && board[rightMove].lastMove?.wasFirst) {
    moves.push(attackRight);
  }
  if (isEnemyPawnLeft && board[leftMove].lastMove?.wasFirst) {
    moves.push(attackLeft);
  }

  // Добавляем стандартный ход вперёд
  if (!isOccupiedByPiece(target, board) || withMyFigures) {
    moves.push(target);
  }

  // Добавляем двойной ход, если это первый ход
  if (
    !isOccupiedByPiece(firstMoveTarget, board) &&
    piece.isFirstMove === true &&
    checkIsInBounds(firstMoveTarget)
  ) {
    moves.push(firstMoveTarget);
  }

  // Если только атака, очищаем массив ходов
  if (withOnlyAttack) moves = [];

  // Добавляем возможные атаки, если это разрешено
  if (includeAttack) {
    if (isEnemyLeft) moves.push(attackLeft);
    if (isEnemyRight) moves.push(attackRight);
  }

  return moves;
};

export const getKnightMoves = (
  piece: PieceType,
  index: number,
  board: Board,
  withMyFigures?: boolean
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
    -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    2 * getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
  const directionBackLeftLine =
    -getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) +
    2 * getDirectionIndexes(piece.color, DIRECTIONS.LEFT);

  const moves = [
    index + directionRight,
    index + directionLeft,
    index + directionBackRight,
    index + directionBackLeft,
    index + directionRightLine,
    index + directionLeftLine,
    index + directionBackRightLine,
    index + directionBackLeftLine,
  ];

  // Получаем текущий столбец фигуры
  const currentCol = index % 8;

  // Проверяем, чтобы ход не перескакивал через края доски
  moves.forEach((move) => {
    const targetCol = move % 8;

    // Проверяем, что ход не перескочил через края доски
    if (Math.abs(currentCol - targetCol) > 2) return; // Ход недействителен, если перескочил больше чем на 2 столбца

    // Проверяем границы доски
    if (!checkIsInBounds(move)) return;

    if (withMyFigures) {
      moves.push(move);
      return;
    }

    // Пропускаем, если на клетке своя фигура
    if (
      isOccupiedByPiece(move, board) &&
      !isEnemyPiece(move, board, piece.color)
    )
      return;

    // Добавляем ход, если клетка допустима
    endMoves.push(move);
  });

  return endMoves;
};

export const getQueenMoves = (
  piece: PieceType,
  index: number,
  board: Board,
  withMyFigures?: boolean
) => {
  return [
    ...getBishopMoves(piece, index, board, withMyFigures),
    ...getRookMoves(piece, index, board, withMyFigures),
  ];
};

export const getKingMoves = (
  piece: PieceType,
  index: number,
  board: Board,
  withMyFigures?: boolean
) => {
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

  const enemyColor = getEnemyColor(piece.color);
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
    if (!checkIsInBounds(target)) return;

    // Проверка на радиус вражеского короля
    if (enemyKingMoves.includes(target)) return; // Пропускаем, если клетка рядом с вражеским королем

    // Проверяем, под атакой ли клетка
    if (isSquareUnderAttack(target, enemyColor, board)) return;

    if (
      isOccupiedByPiece(target, board) &&
      isSquareProtected(target, enemyColor, board)
    )
      return;

    if (
      isOccupiedByPiece(target, board) &&
      isEnemyPiece(target, board, piece.color)
    ) {
      moves.push(target);
    }

    if (withMyFigures) {
      moves.push(target);
      return;
    }
    if (
      isOccupiedByPiece(target, board) &&
      !isEnemyPiece(target, board, piece.color)
    )
      return;

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
