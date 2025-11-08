// @ts-nocheck
import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  padding: 0.5rem 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease;

  ${({ styleType }) => styleType === 'primary' && css`
    background: linear-gradient(45deg, #407aed, #3f73a1);
    color: white;

    &:hover {
      background: linear-gradient(45deg, #263f70, #324e67);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.149);
      transform: translateX(-1px);
      color: #fff;
    }
  `}

  ${({ styleType }) => styleType === 'secondary' && css`
    background: linear-gradient(45deg, #40edb0, #3fa15b);
    color: white;

    &:hover {
      background: linear-gradient(45deg, #267055, #326754);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.149);
      transform: translateX(-1px);
      color: #fff;
    }
  `}

  ${({ styleType }) => styleType === 'danger' && css`
    background: linear-gradient(45deg, #33a0d3, #2b8bc7);
    color: white;

    &:hover {
      background: linear-gradient(45deg, #702626, #673232);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.149);
      transform: translateX(-1px);
      color: #fff;
    }
  `}
`;

function BaseButton({ text, onClick, styleType = 'primary' }) {
  return (
    <StyledButton styleType={styleType} onClick={onClick}>
      {text}
    </StyledButton>
  );
}

export default BaseButton;
