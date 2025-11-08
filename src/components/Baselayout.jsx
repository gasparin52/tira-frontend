// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const BaseLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background-color: #f0f0f0;
  color: black;
`;

function BaseLayoutComponent({ children }) {
  return (
    <BaseLayout>
      <Header />
      {children}
      <Footer />
    </BaseLayout>
  );
}

export default BaseLayoutComponent;
