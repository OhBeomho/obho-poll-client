import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

export default function ({ children }: PropsWithChildren) {
  return (
    <Wrapper>
      <header>
        <Navbar>
          <Link to="/" className="brand">
            Obho Poll
          </Link>
          <div>
            <Link to="/create">Create Poll</Link>
          </div>
        </Navbar>
      </header>
      <Main>{children}</Main>
      <Footer>
        <p>
          Made by <a href="https://github.com/OhBeomho">OhBeomho</a>
        </p>
        <p>
          Source on <a href="https://github.com/OhBeomho/obho-poll-client">GitHub</a>
        </p>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  & .brand {
    color: black;
    font-size: 25px;
  }

  &:hover {
    box-shadow: 0 8px 10px rgba(0, 0, 0, 0.12);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.footer`
  background-color: darkgray;
  text-align: center;
`;
