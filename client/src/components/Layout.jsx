import styled from "styled-components";
import Logo from "../assets/logo.png";

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

const Layout = ({ children }) => (
  <Body>
    {children}
    {/* <img src={Logo} /> */}
  </Body>
);

export default Layout;
