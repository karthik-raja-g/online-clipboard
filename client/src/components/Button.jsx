import styled from "styled-components";

const Btn = styled.button`
  height: 1em;
  width: 100%;
  background-color: #d94255;
  color: #d1dfec;
  height: 40px;
  border-radius: 2px;
  border: none;
  font-size: 1em ;
`;

const Button = ({ clickHandler, label }) => (
  <Btn onClick={clickHandler}>{label}</Btn>
);

export default Button;
