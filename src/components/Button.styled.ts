import styled from "styled-components";

const Button = styled.button`
  border: 0;
  background-color: lightgray;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 0 1.5px darkgray;
  }

  &:active {
    box-shadow: 0 0 0 2px gray;
  }
`;

export default Button;
