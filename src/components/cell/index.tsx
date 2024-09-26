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
  lastMove: {
    index: number | null;
    wasFirst?: boolean;
  };
  isFirstMove?: boolean;
  index?: number;
};

type Props = {
  color: COLORS;
  piece: PieceType | null;
  selectedPiece: PieceType | null;
  showMove?: boolean;
  highlight?: any;
  index?: number;
};

const Cell: React.FC<Props> = ({
  color,
  piece,
  selectedPiece,
  showMove,
  highlight,
  index,
}) => {
  return (
    <CellContainer
      color={color}
      selected={selectedPiece?.id === piece?.id}
      highlight={highlight?.includes(index)}
    >
      {piece && <Piece {...piece} />}
      {showMove && <ReactSVG src="public/dot.svg" />}
    </CellContainer>
  );
};

export default Cell;
