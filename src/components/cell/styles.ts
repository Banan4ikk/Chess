import styled from "styled-components";
import { COLORS } from "../../constants";

type Props = {
  color: COLORS;
  selected: boolean;
};

export const CellContainer = styled.div<Props>`
  width: 50px;
  height: 50px;
  background-color: ${(props) =>
    props.selected
      ? "rgba(30, 81, 123, 0.2)"
      : props.color === COLORS.white
      ? "#fff"
      : "#B2BEB5"};
`;
