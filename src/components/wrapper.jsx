// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import SideBar from './SideBar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: grid;
  grid-template-columns: 1fr 80%;
  height: calc(100vh - 10vh);
  width: 100%;
`;

function Wrapper({ children }) {
  return (
    <Container>
      <SideBar />
      {children}
    </Container>
  );
}

export default Wrapper;
