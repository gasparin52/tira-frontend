import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import ModalContainer from '../components/modals/ModalContainer';
import EditUserModal from '../components/modals/EditUserModal';
import PasswordInput from '../components/buttons/PasswordInput';
import { callAPI, normalizeUsers } from '../utils/api';

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

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #4a90e2;
  color: white;

  &:hover {
    background: #3b78c1;
  }
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

const FormInput = styled.input`
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
          <Select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="username">Username</option>
            <option value="user_id">UUID</option>
          </Select>
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
              {users.map(u => (
                <tr key={u.user_id}>
                  <Td>{u.username}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.role}</Td>
                  <Td>
                    <ActionButton onClick={() => openEdit(u)}>Edit</ActionButton>
                    <ActionButton danger onClick={() => handleDelete(u.user_id)}>Delete</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <ModalContainer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create User">
          <Form onSubmit={handleCreate}>
            <Label>Username<FormInput value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required /></Label>
            <Label>Email<FormInput type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></Label>
            <Label>Password<PasswordInput value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required autoComplete="new-password" /></Label>
            <Label>Role<Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}><option value="user">user</option><option value="leader">leader</option></Select></Label>
            {err && <div style={{ color: 'crimson' }}>{err}</div>}
            <ButtonRow>
              <CancelButton type="button" onClick={() => setIsCreateOpen(false)}>Cancel</CancelButton>
              <SubmitButton type="submit">Create</SubmitButton>
            </ButtonRow>
          </Form>
        </ModalContainer>

        <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={selectedUser} onSuccess={() => { setIsEditOpen(false); loadUsers(); }} />
      </Page>
    </Wrapper>
  );
}
