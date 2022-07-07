import styled from "styled-components";

const Body = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-content: center;
  font-size: clamp(1rem, 2vw, 2rem);
`;
const Layout = ({ children }) => <Body>{children}</Body>;

export default Layout;
