import styled from 'styled-components';

// Inputs
export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

// Labels
export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
`;

// Buttons
export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#6c757d'};
  color: white;

  &:hover {
    opacity: 0.9;
    background: ${props => props.variant === 'danger' ? '#c82333' : '#5a6268'};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PrimaryButton = styled(Button)`
  background: #4a90e2;
  border: none;

  &:hover {
    background: #3b78c1;
  }
`;

export const DangerButton = styled(Button)`
  background: #dc3545;

  &:hover {
    background: #c82333;
  }
`;

export const CancelButton = styled(Button)`
  background: #cd2b2b;
  border: 1px solid #ccc;

  &:hover {
    background: #a51c19;
  }
`;

// Forms
export const Form = styled.form`
  display: grid;
  gap: 16px;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

// Mensajes
export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9em;
  padding: 8px;
  background: #f8d7da;
  border-radius: 4px;
`;
