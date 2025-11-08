import React, { useState } from 'react';
import styled from 'styled-components';

const PasswordFieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 40px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &:focus { outline: none; border-color: #4a90e2; }
`;
const ToggleIconButton = styled.button`
  position: absolute;
  right: 8px;
  top: 10%;
  background: transparent;
  border: none;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  border-radius: 4px;

  &:hover { color: #333;}
  &:focus { outline: 2px solid #4a90e2; }
`;



const EyeIcon = ({ off = false }) => (
  <img 
    src={off ? '/icons/eye-closed.svg' : '/icons/eye.svg'} 
    alt={off ? 'Ocultar' : 'Mostrar'} 
    width="20" 
    height="20"
  />
);

export default function PasswordInput({
  value,
  onChange,
  placeholder = '',
  required = false,
  autoComplete = 'current-password',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <PasswordFieldWrapper>
      <StyledInput
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />
      <ToggleIconButton
        type="button"
        onClick={() => setShowPassword(s => !s)}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <EyeIcon off={showPassword} />
      </ToggleIconButton>
    </PasswordFieldWrapper>
  );
}
