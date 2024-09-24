import React from "react";
import { ReactSVG } from "react-svg";
import { COLORS } from "../../constants";
import { CellContainer } from "./styles";
import Piece from "../piece";
import { Pieces } from "../../types";

export type PieceType = {
  id: string | null;
  color: COLORS | null;
  type: Pieces | null;
  isFirstMove?: boolean;
  index?: number;
};

type Props = {
  color: COLORS;
  piece: PieceType | null;
  selectedPiece: PieceType | null;
  showMove?: boolean;
};

const Cell: React.FC<Props> = ({ color, piece, selectedPiece, showMove }) => {
  return (
    <CellContainer color={color} selected={selectedPiece?.id === piece?.id}>
      {piece && <Piece {...piece} />}
      {showMove && <ReactSVG src="public/dot.svg" />}
    </CellContainer>
  );
};

export default Cell;
