import styled from "styled-components";

const Button = styled.button`
  border: 0;
  background-color: lightgray;
  border-radius: 8px;
  transition: all 0.2s;
  padding: 8px;
  margin: 4px;

  &:hover {
    box-shadow: 0 2px 0 0 darkgray;
  }

  &:active {
    box-shadow: 0 0 0 2px gray;
  }
`;

export default Button;
