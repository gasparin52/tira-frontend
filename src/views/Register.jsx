import React, { useState } from 'react';
import Wrapper from '../components/wrapper';
import styled from 'styled-components';
import PasswordInput from '../components/buttons/PasswordInput';
import { callAPI } from '../utils/api';

const Container = styled.div`
  padding:2rem; 
  display:flex; 
  flex-direction:column;
  gap:3rem; 
  max-width:420px; 
  width:100%;
  height: calc(90vh - 10vh);

  .register-form {
    display:flex;
    flex-direction:column;
    gap:1.5rem;
  }

  h1 {
    text-align: center;
  }
`;

const Label = styled.label`
  display:flex; 
  flex-direction:column; 
  gap:4px;
`;

const Input = styled.input`
  padding:.5rem .75rem; 
  border:1px solid #ddd; 
  border-radius:4px;
`;

const Button = styled.button`
  padding:.5rem 1rem; 
  border:none; 
  border-radius:4px; 
  background:#4a90e2; 
  color:#fff; 
  cursor:pointer;
`;

const Error = styled.div`
  color:crimson;
`;

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('');

    try {
      await callAPI('/users', 'POST', { ...form, role: 'user' });
      alert('User registered, now you can login.');
      setForm({ username: '', email: '', password: '' });
    } catch (e) { setErr(e.message || 'Error'); }
  };
  return (
    <Container>
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <Label>
          Username
          <Input 
            value={form.username} 
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))} 
            required
          />
        </Label>
        <Label>
          Email
          <Input 
            type="email" 
            value={form.email} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            required 
          />
        </Label>
        <Label>
          Password
          <PasswordInput 
            value={form.password} 
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
            required 
          />
        </Label>
        {err && <Error>{err}</Error>}
        <Button type="submit">Create Account</Button>
      </form>
    </Container>
  );
}
