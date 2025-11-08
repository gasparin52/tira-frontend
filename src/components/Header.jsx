// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import BaseButton from './buttons/BaseButton';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  padding: .6rem 1.5rem .6rem .6rem;
  background-color: #103f9cc1;
  border-bottom: 1.2px solid #103f9c67;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.349);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
`;

const HeaderImage = styled.img`
  height: 2.6rem;
  width: auto;
  margin-right: .8rem;
  border-radius: 50%;
  transition: transform 0.2s;
  &:hover { transform: scale(1.1); cursor: pointer; }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

function HeaderComponent() {
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      localStorage.removeItem('team_id');
      document.cookie = 'token=; Max-Age=0; path=/;';
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error', err);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Header>
      <LogoLink to="/" title="Ir al inicio">
        <HeaderImage src="/logo.png" alt="Logo" />
        Tira
      </LogoLink>
      <BaseButton text="Cerrar Sesión" styleType="danger" onClick={handleLogout} />
    </Header>
  );
}

export default HeaderComponent;
