import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import ModalContainer from '../components/modals/ModalContainer';
import EditUserModal from '../components/modals/EditUserModal';
import PasswordInput from '../components/buttons/PasswordInput';
import { callAPI, normalizeUsers } from '../utils/api';
import { AnimatedDropdown } from '../components/common';
import {
  Input, Label, Select, Form, Button, ButtonRow,
  CancelButton, PrimaryButton, ErrorMessage
} from '../components/common/StyledFormComponents';

const Page = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  gap: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #4a90e2;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #3b78c1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f6f8fa;
  font-weight: 600;
  border-bottom: 2px solid #e1e4e8;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e1e4e8;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background: ${p => p.danger ? '#dc3545' : '#6c757d'};
  color: white;
  margin-right: 0.25rem;

  &:hover {
    opacity: 0.8;
  }
`;

export default function Users(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [searchType, setSearchType] = useState('username');
  const [searchValue, setSearchValue] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ username:'', email:'', password:'', role:'user' });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async (query='') => {
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/users${query}`);
      const list = normalizeUsers(data);
      setUsers(list);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      loadUsers();
      return;
    }
    const param = searchType === 'user_id' ? 'user_id' : 'username';
    loadUsers(`?${param}=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      await callAPI(`/users/${userId}`, 'DELETE');
      loadUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await callAPI('/users', 'POST', form);
      setIsCreateOpen(false);
      setForm({ username:'', email:'', password:'', role:'user' });
      loadUsers();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Wrapper>
      <Page>
        <HeaderRow>
          <Title>Users</Title>
          <AddButton onClick={() => setIsCreateOpen(true)} aria-label="Add user">+</AddButton>
        </HeaderRow>

        <SearchRow>
          <AnimatedDropdown
            value={searchType}
            onChange={setSearchType}
            placeholder="Search by"
            options={[
              { value: 'username', label: 'Username' },
              { value: 'user_id', label: 'UUID' }
            ]}
          />
          <Input placeholder={`Search by ${searchType}...`} value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={() => { setSearchValue(''); loadUsers(); }}>Clear</Button>
        </SearchRow>

        {loading && <div>Loading...</div>}
        {err && <div style={{ color: 'crimson' }}>{err}</div>}
        {!loading && !err && users.length === 0 && <div>No users found.</div>}

        {users.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <ActionButton onClick={() => openEdit(user)}>Edit</ActionButton>
                    <ActionButton danger onClick={() => handleDelete(user.user_id)}>Delete</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <ModalContainer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create User">
          <Form onSubmit={handleCreate}>
            <Label>Username<Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required /></Label>
            <Label>Email<Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></Label>
            <Label>Password<PasswordInput value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required autoComplete="new-password" /></Label>
            <Label>Role<Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}><option value="user">user</option><option value="leader">leader</option></Select></Label>
            {err && <ErrorMessage>{err}</ErrorMessage>}
            <ButtonRow>
              <CancelButton type="button" onClick={() => setIsCreateOpen(false)}>Cancel</CancelButton>
              <PrimaryButton type="submit">Create</PrimaryButton>
            </ButtonRow>
          </Form>
        </ModalContainer>

        <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={selectedUser} onSuccess={() => { setIsEditOpen(false); loadUsers(); }} />
      </Page>
    </Wrapper>
  );
}
