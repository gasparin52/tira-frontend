import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import { GET, POST, DELETE } from '../../utils/api';

const List = styled.ul`
  padding-left: 18px;
  max-height: 300px;
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #4a90e2;
  color: white;
  cursor: pointer;

  &:hover {
    background: #3b78c1;
  }
`;

const Danger = styled(Button)`
  background: #e93737;
  margin: .5rem;

  &:hover {
    background: #cb3131;
  }
`;

const TeamMembersModal = ({ isOpen, onClose, team }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isOpen || !team?.team_id) return;
    
    let cancel = false;

    const load = async () => {
      setLoading(true);
      setErr('');

      try {
        const data = await GET(`/teams/${team.team_id}/members`);
        if (!cancel) setMembers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancel) setErr(e.message || 'Error');
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    load();
    
    return () => {
      cancel = true;
    };
  }, [isOpen, team?.team_id]);

  const addMember = async () => {
    if (!email) return;

    try {
      await POST(`/teams/${team.team_id}/members`, { email });

      setEmail('');
      
      const list = await GET(`/teams/${team.team_id}/members`);
      setMembers(Array.isArray(list) ? list : []);
    } catch (e) {
      alert(e.message || 'Error');
    }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove member from team?')) return;

    try {
      await DELETE(`/teams/${team.team_id}/members/${userId}`);
      
      setMembers(m => m.filter(x => x.user_id !== userId));
    } catch (e) {
      alert(e.message || 'Error');
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Members of ${team?.name || ''}`}>
      {loading && <div>Cargando…</div>}
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      {!loading && !err && (
        <>
          <List>
            {members.map(m => (
              <li
                key={m.user_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>{m.username || m.email || m.user_id}</span>
                <Danger onClick={() => removeMember(m.user_id)}>Remove</Danger>
              </li>
            ))}
          </List>
          <Row>
            <Input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button onClick={addMember}>Add</Button>
          </Row>
        </>
      )}
    </ModalContainer>
  );
};

export default TeamMembersModal;
