import React, { useEffect, useState } from "react";
import { DeskContainer } from "./styles";
import Cell, { PieceType } from "../cell";
import { COLORS, DIRECTIONS } from "../../constants";
import {
  movesInCheck,
  generateId,
  getKingCheckPiece,
  isOccupiedByPiece,
  getDirectionIndexes,
} from "../../utils"; // Импортируем isCheckmate
import {
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "../../utils/getPicesMoves";

type Props = {
  board: Array<PieceType>;
};

const Desk: React.FC<Props> = ({ board: initBoard }) => {
  const [currentMove, setCurrentMove] = useState<COLORS>(COLORS.white);
  const [board, setBoard] = useState<Array<PieceType>>([]);
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: PieceType;
    index: number;
  } | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Array<number>>([]);
  const [checkPiece, setCheckPiece] = useState<PieceType | null>(null);
  const [isInCheck, setIsInCheck] = useState<boolean>(false);
  // @ts-ignore
  const [isInCheckMate, setIsInCheckMate] = useState<boolean>(false); // Добавляем состояние мата

  useEffect(() => {
    const updBoard = initBoard.map((item, index) => ({
      ...item,
      ...(item.type !== null && { index }),
    }));
    setBoard(updBoard);
  }, []);

  const getColor = (index: number) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    return (row + col) % 2 === 1 ? COLORS.black : COLORS.white;
  };

  const makeMove = (index: number) => {
    if (!selectedPiece) return;

    const emptyCell = {
      id: generateId(),
      color: null,
      type: null,
      lastMove: {
        index: null,
      },
    };

    const updatedBoard = [...board];
    const { piece } = selectedPiece;

    // Логика рокировки
    if (piece.type === "king" && Math.abs(index - selectedPiece.index) === 2) {
      // Если король переместился на 2 клетки, это рокировка
      const rookStartIndex =
        index > selectedPiece.index ? index + 1 : index - 2; // Определяем индекс начальной позиции ладьи
      const rookTargetIndex =
        index > selectedPiece.index ? index - 1 : index + 1; // Определяем новую позицию ладьи

      // Перемещаем ладью
      updatedBoard[rookTargetIndex] = {
        ...updatedBoard[rookStartIndex], // Копируем информацию о ладье
        lastMove: {
          index: rookStartIndex,
          wasFirst: updatedBoard[rookStartIndex].isFirstMove, // Запоминаем, делала ли ладья первый ход
        },
      };

      // Очищаем начальную позицию ладьи
      updatedBoard[rookStartIndex] = emptyCell;
    }

    // Обновляем позицию короля
    updatedBoard[index] = {
      ...selectedPiece.piece,
      index,
      isFirstMove: false, // Король уже сделал первый ход
      lastMove: {
        index: selectedPiece.index,
        wasFirst: selectedPiece.piece.isFirstMove,
      },
    };

    // Очищаем начальную позицию короля
    updatedBoard[selectedPiece.index] = emptyCell;

    setBoard(updatedBoard);
    setCurrentMove((prevState) =>
      prevState === COLORS.white ? COLORS.black : COLORS.white
    );
    setAvailableMoves([]);
    setSelectedPiece(null);

    // Проверяем, не поставлен ли шах королю после хода
    const kingCheckPiece = getKingCheckPiece(currentMove, updatedBoard);

    if (kingCheckPiece) {
      console.log("check");
      setCheckPiece(kingCheckPiece);
      setIsInCheck(true);
    } else {
      setIsInCheck(false);
      setCheckPiece(null);
    }
  };

  const getAvailableMoves = (piece: PieceType, index: number) => {
    switch (piece.type) {
      case "pawn":
        setAvailableMoves(getPawnMoves(piece, index, board));
        break;
      case "knight":
        setAvailableMoves(getKnightMoves(piece, index, board));
        break;
      case "bishop":
        setAvailableMoves(getBishopMoves(piece, index, board));
        break;
      case "rook":
        setAvailableMoves(getRookMoves(piece, index, board));
        break;
      case "queen":
        setAvailableMoves(getQueenMoves(piece, index, board));
        break;
      case "king":
        setAvailableMoves(getKingMoves(piece, index, board));
        break;
      default:
        setAvailableMoves([]);
    }
  };

  const onClick = (index: number, piece: PieceType) => {
    // Проверяем, принадлежит ли фигура текущему ходу
    if (
      (currentMove === COLORS.black && piece.color === COLORS.black) ||
      (currentMove === COLORS.white && piece.color === COLORS.white)
    ) {
      setAvailableMoves([]);
      setSelectedPiece({ piece, index });
      getAvailableMoves(piece, index);
    }
    // Если шах, проверяем, может ли фигура перекрыть шах
    if (isInCheck && checkPiece && piece) {
      const moves = movesInCheck(piece, checkPiece, board);
      setAvailableMoves(moves);
    }

    if (selectedPiece && availableMoves.includes(index)) {
      makeMove(index);
      // Добавлен возврат, чтобы избежать сброса выбранной фигуры
    }
  };

  useEffect(() => {
    // Проверяем мат после каждого хода
    if (isInCheck && !availableMoves.length) {
      console.log("checkmate");
      setIsInCheckMate(true); // Обновляем состояние мата
    }
  }, [isInCheck, board, currentMove]);

  return (
    <DeskContainer>
      {board.map((piece, index) => (
        <div onClick={() => onClick(index, piece)} key={generateId()}>
          <Cell
            color={getColor(index)}
            piece={piece}
            selectedPiece={selectedPiece?.piece || null}
            showMove={
              availableMoves.includes(index) && !isOccupiedByPiece(index, board)
            }
          />
        </div>
      ))}
    </DeskContainer>
  );
};

export default Desk;
