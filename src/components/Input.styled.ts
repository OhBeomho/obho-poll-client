import styled from "styled-components";

const Input = styled.input`
  outline: none;
  border: 2px solid transparent;
  border-bottom-color: gray;
  border-radius: 0;
  padding: 8px;
  transition: all 0.2s;

  &:hover {
    border-bottom-color: black;
  }

  &:focus {
    border-radius: 8px;
    border: 1.7px solid gray;
  }
`;

export default Input;
