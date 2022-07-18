import styled from "styled-components";
import Logo from "../icons/logo.png";

const Body = styled.div`
  height: 100vh;
  /* width: 100vw; */
  display: grid;
  place-content: center;
  font-size: clamp(1rem, 2vw, 2rem);
  background-color: #333e50;
  overflow: hidden;

  & * {
    font-family: "Rubik", sans-serif;
  }
`;

const Logox = styled.div`
background-image: url('./assets/logo.png');
height: 50px;
width: 100px ;
  /* position: fixed;
  top: 0;
  left: 0; */
`;
const Layout = ({ children }) => (
  <Body>
    {children}
    <Logox />
  </Body>
);

export default Layout;
