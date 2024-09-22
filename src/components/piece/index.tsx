import React from "react";
import { ReactSVG } from "react-svg";
import { type PieceType } from "../cell";
import { COLORS } from "../../constants";

const Piece: React.FC<PieceType> = ({ type, color }) => {
  const getPiece = () => {
    return `public/pieces/${type}-${color === COLORS.white ? "w" : "b"}.svg`;
  };
  return <ReactSVG src={getPiece()} />;
};

export default Piece;
