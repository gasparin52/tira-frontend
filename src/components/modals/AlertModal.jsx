import React from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 1.5rem;
`;

const AlertButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  font-weight: 500;
  &:hover { background: #3b78c1; }

  &[data-cancel] {
    background: #ea4252;
    &:hover { background: #b71c1c; }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AlertModal = ({ isOpen, title = 'Alert', message, onAccept, onCancel, showCancel = false }) => (
  <ModalContainer isOpen={isOpen} onClose={onCancel} title={title}>
    <ModalContent>
      <div style={{ fontSize: '1.1em', margin: '1.5rem 0 0.5rem 0', color: '#222', textAlign: 'center' }}>{message}</div>
      <ButtonRow>
        {showCancel && (
          <AlertButton data-cancel onClick={onCancel}>Cancel</AlertButton>
        )}
        <AlertButton onClick={onAccept}>Accept</AlertButton>
      </ButtonRow>
    </ModalContent>
  </ModalContainer>
);

export default AlertModal;
