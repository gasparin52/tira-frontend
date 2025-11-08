import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BaseButton from '../components/buttons/BaseButton';
import PasswordInput from '../components/buttons/PasswordInput';
import { callAPI, normalizeUsers } from '../utils/api';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(90vh - 10vh);
  gap: 2rem;
`;

const LogoImg = styled.img`
  width: 7rem;
  height: auto;
  margin-bottom: 1.6rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: .6rem;
`;

const Input = styled.input`
  padding: .6rem .8rem;
  min-width: 26vw;
  border-radius: .2rem;
  border: 1px solid #c1c1c1;
  outline: none;
`;

const RegisterLink = styled.a`
  margin-left: .5rem;
  color: #34579c;
  font-size: .7rem;
  &:hover { text-decoration: underline; }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9em;
  padding: 8px;
  background: #f8d7da;
  border-radius: 4px;
  margin-top: 8px;
  text-align: center;
`;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userTrim = username.trim();
    const passTrim = password.trim();

    if (!userTrim && !passTrim) {
      setErr('Username and password are required');
      return;
    } else if (!userTrim) {
      setErr('Username is required');
      return;
    } else if (!passTrim) {
      setErr('Password is required');
      return;
    }

    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/users?username=${encodeURIComponent(username.trim())}`);
      const users = normalizeUsers(data);
      if (users.length === 0) throw new Error('Invalid username or password');
      const user = users[0];
      localStorage.setItem('user_id', user.user_id);
      localStorage.setItem('username', user.username);
      navigate('/teams');
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LogoImg src="/logo.png" alt="Logo" />
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={loading}
        />
        <RegisterLink href="/register">Don't have an account?</RegisterLink>
        {err && <ErrorMessage>{err}</ErrorMessage>}
      </Form>
      <BaseButton 
        text={loading ? 'Logging in...' : 'Login'} 
        styleType='primary' 
        onClick={handleSubmit}
      />
    </LoginContainer>
  );
}

export default Login;
