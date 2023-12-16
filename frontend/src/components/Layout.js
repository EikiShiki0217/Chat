import styled from "styled-components";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  display: block;
  width: auto;
  overflow-x: hidden;
  min-height: 100vh;
  height: 100vh;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const Layout = () => {
  return (
    <Container>
      <Body>
        <Nav />
        <RightSection>
          <Outlet />
        </RightSection>
      </Body>
    </Container>
  );
};
export default Layout;
