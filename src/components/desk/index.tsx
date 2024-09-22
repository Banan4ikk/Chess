import React, { useState } from "react";
import { DeskContainer } from "./styles";
import Cell, { PieceType } from "../cell";
import { COLORS, DIRECTIONS } from "../../constants";
import {
  checkIsBottomEdge,
  checkIsInBounds,
  checkIsLeftEdge,
  checkIsRightEdge,
  checkIsTopEdge,
  generateId,
  getDirectionIndexes,
  isOccupiedByPiece,
} from "../../utils";

type Props = {
  board: Array<PieceType>;
};

const Desk: React.FC<Props> = ({ board: initBoard }) => {
  const [currentMove, setCurrentMove] = useState<COLORS>(COLORS.white);
  const [board, setBoard] = useState<Array<PieceType>>(initBoard);
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: PieceType;
    index: number;
  } | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Array<number>>([]);

  const getColor = (index: number) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    return (row + col) % 2 === 1 ? COLORS.black : COLORS.white;
  };

  const makeMove = (index: number) => {
    if (!selectedPiece) return;
    const updatedBoard = [...board];
    updatedBoard[index] =
      selectedPiece.piece.type === "pawn"
        ? {
            ...selectedPiece.piece,
            isFirstMove: selectedPiece.piece.isFirstMove === true && false,
          }
        : selectedPiece.piece;
    updatedBoard[selectedPiece.index] = {
      id: generateId(),
      color: null,
      type: null,
    };
    setBoard(updatedBoard);
    setCurrentMove((prevState) =>
      prevState === COLORS.white ? COLORS.black : COLORS.white
    );
    setAvailableMoves([]);
  };

  // Функция для получения доступных ходов для слона
  function getBishopMoves(piece: PieceType, index: number) {
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
    const moves: Array<number> = [];

    directions.forEach(({ direction, index: targetIndex }) => {
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
    });
    return moves;
  }

  // Функция для получения доступных ходов для ладьи
  function getRookMoves(piece: PieceType, index: number) {
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
  }

  const getAvailableMoves = (piece: PieceType, index: number) => {
    switch (piece.type) {
      case "pawn":
        {
          const firstMoveDirection =
            getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT) * 2;
          const direction = getDirectionIndexes(
            piece.color,
            DIRECTIONS.STRAIGHT
          );
          const target = index + direction;
          const firstMoveTarget = index + firstMoveDirection;
          if (!isOccupiedByPiece(target, board) && checkIsInBounds(target))
            setAvailableMoves((prev) => [...prev, target]);
          if (
            !isOccupiedByPiece(firstMoveTarget, board) &&
            piece.isFirstMove === true &&
            checkIsInBounds(firstMoveTarget)
          ) {
            setAvailableMoves((prev) => [...prev, firstMoveTarget]);
          }
        }
        break;
      case "knight":
        {
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
              setAvailableMoves((prev) => [...prev, move]);
            }
          });
        }
        break;
      case "bishop":
        setAvailableMoves(getBishopMoves(piece, index));
        break;
      case "rook":
        setAvailableMoves(getRookMoves(piece, index));
        break;
      case "queen":
        setAvailableMoves([
          ...getBishopMoves(piece, index),
          ...getRookMoves(piece, index),
        ]);

        break;
      case "king":
        {
          const top = getDirectionIndexes(piece.color, DIRECTIONS.STRAIGHT);
          const back = -getDirectionIndexes(piece.color, DIRECTIONS.BOTTOM);
          const right = -getDirectionIndexes(piece.color, DIRECTIONS.RIGHT);
          const left = -getDirectionIndexes(piece.color, DIRECTIONS.LEFT);

          const directions = [top, back, right, left];

          directions.forEach((direction) => {
            const target = index + direction;

            if (!isOccupiedByPiece(target, board) && checkIsInBounds(target))
              setAvailableMoves((prev) => [...prev, target]);
          });
        }
        break;
      default:
        setAvailableMoves([]);
    }
  };

  const onClick = (index: number, piece: PieceType) => {
    if (selectedPiece && availableMoves.includes(index)) {
      makeMove(index);
      setSelectedPiece(null);
    } else if (
      (currentMove === COLORS.black && piece.color === COLORS.black) ||
      (currentMove === COLORS.white && piece.color === COLORS.white)
    ) {
      setAvailableMoves([]);
      setSelectedPiece({ piece, index });
      getAvailableMoves(piece, index);
    }
  };

  return (
    <DeskContainer>
      {board.map((piece, index) => (
        <div onClick={() => onClick(index, piece)} key={generateId()}>
          <Cell
            color={getColor(index)}
            piece={piece}
            selectedPiece={selectedPiece?.piece || null}
            availableMoves={availableMoves}
            index={index}
          />
        </div>
      ))}
    </DeskContainer>
  );
};

export default Desk;
