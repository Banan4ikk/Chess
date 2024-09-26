import styled from "styled-components";
import { COLORS } from "../../constants";

type Props = {
  color: COLORS;
  selected: boolean;
  highlight?: any;
};

export const CellContainer = styled.div<Props>`
  width: 50px;
  height: 50px;
  background-color: ${(props) => {
    if (props.highlight) return "red";

    if (props.selected) return "rgba(30, 81, 123, 0.2)";

    return props.color === COLORS.white ? "#fff" : "#B2BEB5";
  }};
`;
