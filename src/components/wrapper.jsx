import React from 'react';
import styled from 'styled-components';
import SideBar from './SideBar';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ sidebarCollapsed }) => sidebarCollapsed ? '60px 1fr' : '15vw 1fr'};
  height: calc(100vh - 10vh);
  width: 100%;
  transition: grid-template-columns 0.3s ease;
`;

function Wrapper({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1'; } catch { return false; }
  });

  return (
    <Container sidebarCollapsed={sidebarCollapsed}>
      <SideBar onCollapsedChange={setSidebarCollapsed} />
      {children}
    </Container>
  );
}

export default Wrapper;
