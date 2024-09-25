import { COLORS, DIRECTIONS } from "../constants";
import { PieceType } from "../components/cell";
import {
  getBishopMoves,
  getDirectionsByPiece,
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
//
// export const calculateAttackLine = (
//   attacker: PieceType,
//   board: Array<PieceType>
// ): Array<number> => {
//   const attackLine: Array<number> = [];
//   const attackerPos = attacker.index;
//   const kingPos = findKingIndex(getEnemyColor(attacker.color), board);
//
//   if (!attackerPos) return [];
//
//   // Проверяем корректность позиций
//   if (!checkIsInBounds(attackerPos) || kingPos === -1) return [];
//
//   // Проверяем, является ли атакующая фигура конем
//   if (attacker.type === "knight") {
//     const knightMoves = getKnightMoves(attacker, attackerPos, board);
//
//     if (knightMoves.some((move) => checkIsInBounds(move) && move === kingPos)) {
//       return [kingPos]; // Если король под угрозой от коня
//     }
//     return []; // Нет линии атаки для коня
//   }
//
//   // Проверяем, является ли атакующая фигура пешкой
//   if (attacker.type === "pawn") {
//     const pawnMoves = getPawnMoves(attacker, attackerPos, board);
//
//     if (pawnMoves.some((move) => checkIsInBounds(move) && move === kingPos)) {
//       return [kingPos]; // Если король под угрозой от пешки
//     }
//   }
//
//   // Получаем направления для других фигур
//   const directions = getDirectionsByPiece(attacker);
//
//   // Используем forEach для обработки каждого направления
//   directions.forEach(({ index }) => {
//     let currentPos = attackerPos;
//
//     while (checkIsInBounds(currentPos)) {
//       currentPos += index;
//
//       if (isOccupiedByPiece(currentPos, board)) {
//         if (isEnemyPiece(currentPos, board, attacker.color)) {
//           // Если встречаем фигуру противника, добавляем в линию атаки
//           attackLine.push(currentPos);
//         }
//         break; // Выходим, если встретили любую фигуру
//       }
//
//       attackLine.push(currentPos); // Добавляем свободную клетку
//       if (currentPos === kingPos) break; // Если дошли до короля, выходим
//     }
//   });
//
//   // Добавляем короля в линию атаки, если он находится в пределах доски
//   if (checkIsInBounds(kingPos)) {
//     attackLine.push(kingPos);
//   }
//
//   return attackLine;
// };
//
// export const canPieceBlockCheck = (
//   piece: PieceType,
//   attacker: PieceType,
//   board: Array<PieceType>
// ) => {
//   if (!piece.index || !attacker.index) return false;
//
//   // const attackLine = calculateAttackLine(attacker, board);
//   const attackLine = getAvailableMovesForPiece(attacker, attacker.index, board);
//   // console.log("attack", attackLine);
//   const availableMoves = getAvailableMovesForPiece(piece, piece.index, board);
//   const intersection = attackLine.filter((value) =>
//     availableMoves.includes(value)
//   );
//   console.log("attack", attackLine);
//   console.log("intecsetion", intersection);
//
//   // Для других фигур проверяем, может ли она занять любую клетку на линии атаки
//   return availableMoves.some((move) => attackLine.includes(move));
// };

export const calculateAttackLine = (
  attacker: PieceType,
  board: Array<PieceType>
): Array<number> => {
  const attackLine: Array<number> = [];
  const attackerPos = attacker.index;
  const kingPos = findKingIndex(getEnemyColor(attacker.color), board);

  if (!attackerPos || kingPos === -1) return [];

  // Проверяем, является ли атакующая фигура конем
  if (attacker.type === "knight") {
    const knightMoves = getKnightMoves(attacker, attackerPos, board);

    if (knightMoves.includes(kingPos)) {
      return [kingPos]; // Если король под угрозой от коня
    }
    return []; // Нет линии атаки для коня
  }

  // Проверяем, является ли атакующая фигура пешкой
  if (attacker.type === "pawn") {
    const pawnMoves = getPawnMoves(attacker, attackerPos, board);

    if (pawnMoves.includes(kingPos)) {
      return [kingPos]; // Если король под угрозой от пешки
    }
  }

  // Получаем направления для других фигур
  const directions = getDirectionsByPiece(attacker);

  // Используем forEach для обработки каждого направления
  directions.forEach(({ index }) => {
    let currentPos = attackerPos;

    while (checkIsInBounds(currentPos)) {
      currentPos += index;

      if (isOccupiedByPiece(currentPos, board)) {
        if (isEnemyPiece(currentPos, board, attacker.color)) {
          // Если встречаем фигуру противника, добавляем в линию атаки
          attackLine.push(currentPos);
        }
        break; // Выходим, если встретили любую фигуру
      }

      attackLine.push(currentPos); // Добавляем свободную клетку
      if (currentPos === kingPos) break; // Если дошли до короля, выходим
    }
  });

  // Добавляем короля в линию атаки, если он находится в пределах доски
  if (checkIsInBounds(kingPos)) {
    attackLine.push(kingPos);
  }

  return attackLine;
};

export const movesInCheck = (
  piece: PieceType,
  attacker: PieceType,
  board: Array<PieceType>
) => {
  if (!piece.index || !attacker.index) return [] as Array<number>;
  const kingPos = findKingIndex(piece.color, board);

  // Получаем линии атаки
  const attackLine = calculateAttackLine(attacker, board);
  const availableMoves = getAvailableMovesForPiece(piece, piece.index, board);

  // Фильтруем только те клетки, которые могут перекрыть шах
  const blockingMoves = attackLine.filter((linePosition) => {
    const isAdjacentToKing =
      linePosition === findKingIndex(getEnemyColor(piece.color), board);
    return availableMoves.includes(linePosition) && !isAdjacentToKing;
  });

  const kingMoves = getKingMoves(board[kingPos], kingPos, board);

  return piece.type === "king" ? kingMoves : blockingMoves;
};
