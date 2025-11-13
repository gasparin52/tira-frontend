import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  padding: .8rem;
  background-color: #103f9cc1;
  color: white;
  font-size: .8rem;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  border-bottom: 2px solid #23415c;
`;

function FooterComponent() {
  return <Footer> ® Tira - 2025 </Footer>;
}

export default FooterComponent;
