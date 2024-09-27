import { COLORS, DIRECTIONS, DIRECTIONS_TYPE } from "../constants";
import { PieceType } from "../components/cell";
import {
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "./getPicesMoves";

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

export const getDirectionType = (
  index1: number,
  index2: number
): DIRECTIONS_TYPE | null => {
  const x1 = index1 % 8;
  const y1 = Math.floor(index1 / 8);
  const x2 = index2 % 8;
  const y2 = Math.floor(index2 / 8);

  // Проверка горизонтального направления
  if (y1 === y2) {
    return DIRECTIONS_TYPE.horizontal;
  }

  // Проверка вертикального направления
  if (x1 === x2) {
    return DIRECTIONS_TYPE.vertical;
  }

  // Проверка диагональных направлений
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  // Если абсолютные значения разностей равны, это диагональ
  if (Math.abs(deltaX) === Math.abs(deltaY)) {
    if (deltaX > 0) {
      return DIRECTIONS_TYPE.rightDiagonal; // диагональ вправо
    }
    return DIRECTIONS_TYPE.leftDiagonal; // диагональ влево
  }

  // Если не попадает ни под одну категорию
  return null;
};

export const findKingIndex = (
  color: COLORS | null,
  board: Array<PieceType>
) => {
  if (!color) return -1;
  return board.findIndex(
    (item) => item.color === color && item.type === "king"
  );
};

export const getEnemyColor = (color: COLORS | null) => {
  return color === "BLACK" ? COLORS.white : COLORS.black;
};

export const getAvailableMovesForPiece = (
  piece: PieceType,
  index: number,
  board: Array<PieceType>,
  withMyFigures?: boolean,
  onlyPawnAttack?: boolean
) => {
  let moves: Array<number> = [];
  // Определяем ходы для каждой фигуры в зависимости от её типа
  switch (piece.type) {
    case "bishop":
      moves = getBishopMoves(piece, index, board, withMyFigures);
      break;
    case "rook":
      moves = getRookMoves(piece, index, board, withMyFigures);
      break;
    case "queen":
      moves = getQueenMoves(piece, index, board, withMyFigures);
      break;
    case "knight":
      moves = getKnightMoves(piece, index, board, withMyFigures);
      break;
    case "pawn":
      moves = getPawnMoves(piece, index, board, true, onlyPawnAttack);
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

export const getAttackingPiece = (
  square: number,
  enemyColor: COLORS,
  board: Array<PieceType>
) => {
  for (const piece of board) {
    let moves: Array<number> = [];
    if (piece.index)
      moves = getAvailableMovesForPiece(piece, piece.index, board);
    if (piece.color === enemyColor && moves.includes(square)) {
      return piece;
    }
  }
  return null;
};

export const getKingCheckPiece = (
  color: COLORS | null,
  board: Array<PieceType>
) => {
  if (!color) return null;
  const kingIndex = findKingIndex(getEnemyColor(color), board);

  if (kingIndex === -1) return null; // Если король не найден

  return getAttackingPiece(kingIndex, color, board);
};

const getDirectionToKing = (
  attackerPos: number,
  kingPos: number,
  pieceType: string
): number | null => {
  const boardSize = 8;

  // Вычисляем разницу по строкам и колонкам
  const rowDiff =
    Math.floor(kingPos / boardSize) - Math.floor(attackerPos / boardSize);
  const colDiff = (kingPos % boardSize) - (attackerPos % boardSize);

  // Для ладьи (горизонтальное или вертикальное направление)
  if (pieceType === "rook" || pieceType === "queen") {
    if (rowDiff === 0) return colDiff > 0 ? 1 : -1; // По горизонтали
    if (colDiff === 0) return rowDiff > 0 ? boardSize : -boardSize; // По вертикали
  }

  let direction: number | null = null;

  // Для слона (диагональное направление)
  if (pieceType === "bishop" || pieceType === "queen") {
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return null;

    if (rowDiff > 0 && colDiff > 0) {
      direction = boardSize + 1;
    } else if (rowDiff > 0 && colDiff <= 0) {
      direction = boardSize - 1;
    } else if (rowDiff <= 0 && colDiff > 0) {
      direction = -(boardSize - 1);
    } else {
      direction = -(boardSize + 1);
    }
  }

  return direction;
};

export const calculateAttackLine = (
  attacker: PieceType,
  board: Array<PieceType>
): Array<number> => {
  const attackLine: Array<number> = [];
  const attackerPos = attacker.index;
  const kingPos = findKingIndex(getEnemyColor(attacker.color), board);

  if (kingPos === -1 || !attackerPos) return [];

  // Проверяем тип фигуры
  if (
    attacker.type === "queen" ||
    attacker.type === "rook" ||
    attacker.type === "bishop"
  ) {
    const direction = getDirectionToKing(attackerPos, kingPos, attacker.type);

    if (!direction) return [];

    let currentPos = attackerPos + direction;
    while (currentPos !== kingPos) {
      attackLine.push(currentPos);
      currentPos += direction;
    }

    attackLine.push(kingPos); // Добавляем короля в линию атаки
  } else if (attacker.type === "pawn" || attacker.type === "knight") {
    if (
      getAvailableMovesForPiece(attacker, attackerPos, board).includes(kingPos)
    ) {
      attackLine.push(attackerPos, kingPos); // Если угрожает королю, добавить только атакующую клетку и короля
    }
  }

  return attackLine;
};
export const movesInCheck = (
  piece: PieceType,
  attacker: PieceType,
  board: Array<PieceType>
): Array<number> => {
  if (!piece.index || !attacker.index) return [];

  const kingPos = findKingIndex(piece.color, board);
  const attackLine = calculateAttackLine(attacker, board);
  const availableMoves = getAvailableMovesForPiece(piece, piece.index, board);

  // Фильтруем ходы, которые могут заблокировать или взять атакующую фигуру
  const validMoves = availableMoves.filter((move) => {
    return attackLine.includes(move) || move === attacker.index;
  });

  // Получаем возможные ходы короля
  const kingMoves = getKingMoves(board[kingPos], kingPos, board);

  // Определяем направление атаки
  const attackDirection =
    attackLine.length > 1
      ? getDirectionType(attackLine[0], attackLine[1])
      : null;

  // Если это король, фильтруем его ходы
  if (piece.type === "king") {
    const filteredKingMoves = kingMoves.filter(
      (move) => !attackLine.includes(move)
    ); // Исключаем ходы, находящиеся в линии атаки

    // Дополнительно исключаем ходы назад по линии атаки
    return filteredKingMoves.filter((move) => {
      if (!attackDirection) return true; // Если направление атаки не определено, допускаем ход

      const isHorizontal = attackDirection === DIRECTIONS_TYPE.horizontal;
      const isVertical = attackDirection === DIRECTIONS_TYPE.vertical;
      const isLeftDiagonal = attackDirection === DIRECTIONS_TYPE.leftDiagonal;
      const isRightDiagonal = attackDirection === DIRECTIONS_TYPE.rightDiagonal;

      // Проверяем направление атаки
      return (
        (isHorizontal && move !== kingPos + 1 && move !== kingPos - 1) ||
        (isVertical && move !== kingPos + 8 && move !== kingPos - 8) ||
        (isLeftDiagonal && move !== kingPos - 7 && move !== kingPos + 7) ||
        (isRightDiagonal && move !== kingPos - 9 && move !== kingPos + 9)
      ); // Ход допустим
    }); // Возвращаем только допустимые ходы короля
  }

  // Для остальных фигур возвращаем только допустимые ходы
  return validMoves;
};

export const isSquareProtected = (
  target: number,
  enemyColor: COLORS,
  board: Array<PieceType>
): boolean => {
  return board.some((piece, index) => {
    // Проверяем, что это вражеская фигура
    if (!piece || piece.color !== enemyColor) return false;

    // Получаем доступные ходы для этой фигуры
    const availableMoves = getAvailableMovesForPiece(piece, index, board, true);

    // Проверяем, может ли эта фигура атаковать целевую клетку
    return availableMoves.includes(target);
  });
};

// Функция для проверки, что путь от `start` до `end` свободен от фигур
export const checkPathIsClear = (
  start: number,
  end: number,
  board: Array<PieceType>,
  direction: number
): boolean => {
  let currentIndex = start + direction;

  // Проходим по клеткам между королем и ладьей
  while (currentIndex !== end) {
    if (isOccupiedByPiece(currentIndex, board)) {
      return false; // Если есть фигура, путь не свободен
    }
    currentIndex += direction;
  }

  return true; // Путь свободен
};

// Функция для проверки, что клетки на пути рокировки не под атакой
export const checkPathIsSafe = (
  start: number,
  end: number,
  board: Array<PieceType>,
  enemyColor: COLORS,
  direction: number
): boolean => {
  let currentIndex = start;

  // Проверяем каждую клетку на пути рокировки
  while (currentIndex !== end + direction) {
    if (isSquareUnderAttack(currentIndex, enemyColor, board)) {
      return false; // Если клетка под атакой, путь не безопасен
    }
    currentIndex += direction;
  }

  return true; // Путь безопасен
};
