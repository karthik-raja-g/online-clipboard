import styled from "styled-components";

const Body = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-content: center;
  font-size: clamp(1rem, 2vw, 2rem);
  background-color: #333e50;

  & * {
    font-family: 'Rubik', sans-serif;
  }
`;
const Layout = ({ children }) => <Body>{children}</Body>;

export default Layout;
