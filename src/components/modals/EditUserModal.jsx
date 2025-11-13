import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: #cd2b2b;
  color: #fff;

  &:hover {
    background: #a51c19;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;

  &:hover {
    background: #3b78c1;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: .9em;
`;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'user'
  });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;
    setErr('');

    try {
      const res = await fetch(`${API_BASE}/users/${user.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to update user'));

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (!user) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title="Edit User">
      <Form onSubmit={handleSubmit}>
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
          Role
          <Select
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="user">user</option>
            <option value="leader">leader</option>
          </Select>
        </Label>

        {err && <ErrorMessage>{err}</ErrorMessage>}

        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">Save</SubmitButton>
        </ButtonRow>
      </Form>
    </ModalContainer>
  );
};

export default EditUserModal;
