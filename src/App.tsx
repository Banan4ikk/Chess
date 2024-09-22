import { Layout } from "./BaseStyles";
import Desk from "./components/desk";
import { PieceType } from "./components/cell";
import { generateId } from "./utils";
import { COLORS } from "./constants";

function App() {
  const initialBoardSetup: Array<PieceType> = [
    { id: generateId(), color: COLORS.black, type: "rook" },
    { id: generateId(), color: COLORS.black, type: "knight" },
    { id: generateId(), color: COLORS.black, type: "bishop" },
    { id: generateId(), color: COLORS.black, type: "queen" },
    { id: generateId(), color: COLORS.black, type: "king" },
    { id: generateId(), color: COLORS.black, type: "bishop" },
    { id: generateId(), color: COLORS.black, type: "knight" },
    { id: generateId(), color: COLORS.black, type: "rook" },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.black, type: "pawn", isFirstMove: true },
    ...new Array(32).fill({ id: generateId(), color: null, type: null }), // Пустые клетки
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "pawn", isFirstMove: true },
    { id: generateId(), color: COLORS.white, type: "rook" },
    { id: generateId(), color: COLORS.white, type: "knight" },
    { id: generateId(), color: COLORS.white, type: "bishop" },
    { id: generateId(), color: COLORS.white, type: "queen" },
    { id: generateId(), color: COLORS.white, type: "king" },
    { id: generateId(), color: COLORS.white, type: "bishop" },
    { id: generateId(), color: COLORS.white, type: "knight" },
    { id: generateId(), color: COLORS.white, type: "rook" },
  ];

  return (
    <Layout>
      <Desk board={initialBoardSetup} />
    </Layout>
  );
}

export default App;
