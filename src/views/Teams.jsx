import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import TeamCard from '../components/cards/TeamCard';
import ModalContainer from '../components/modals/ModalContainer';
import TeamMembersModal from '../components/modals/TeamMembersModal';
import { useNavigate } from 'react-router-dom';
import { callAPI } from '../utils/api';

const TeamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 2rem;
`;

const TeamCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0 2rem;
  width: 100%;
`;

const TeamTitle = styled.h2`
  display: flex;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
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
  box-shadow: 0 2px 6px rgba(0,0,0,.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #3b78c1; }
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
  &:focus { outline: none; border-color: #4a90e2; }
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
  &:hover { background: #a51c19; }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  &:hover { background: #3b78c1; }
`;

function Teams() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id') || '';
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [createErr, setCreateErr] = useState('');

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const loadTeams = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/teams/user/${userId}`);
      setTeams(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Error loading teams');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadTeams(); }, [loadTeams]);

  const handleSelect = (team) => {
    setSelectedId(team.team_id);
    localStorage.setItem('team_id', team.team_id);
    navigate(`/tasks?team_id=${team.team_id}`);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!userId) {
      setCreateErr('You must log in to create a team.');
      return;
    }
    setCreateErr('');
    try {
      await callAPI('/teams', 'POST', {
        owner_id: userId,
        name
      });
      setIsCreateOpen(false);
      setName('');
      loadTeams();
    } catch (e) {
      setCreateErr(e.message || 'Error creating team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Delete this team? This action cannot be undone.')) return;
    try {
      await callAPI(`/teams/${teamId}`, 'DELETE');
      loadTeams();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const handleManageMembers = (team) => {
    setSelectedTeam(team);
    setIsMembersOpen(true);
  };

  return (
    <Wrapper>
      <TeamsContainer>
        <HeaderRow>
          <TeamTitle>Teams</TeamTitle>
          <AddButton onClick={() => setIsCreateOpen(true)} aria-label="Create team">+</AddButton>
        </HeaderRow>

        {!userId && <div>Iniciá sesión para ver tus equipos.</div>}
        {userId && loading && <div>Cargando equipos…</div>}
        {userId && !loading && err && <div style={{ color: 'crimson' }}>Error: {err}</div>}
        {userId && !loading && !err && teams.length === 0 && (
          <div>No tenés equipos aún.</div>
        )}

        <TeamCardContainer>
          {teams.map(team => (
            <TeamCard
              key={team.team_id}
              team={team}
              selected={selectedId === team.team_id}
              onClick={() => handleSelect(team)}
              onDelete={handleDeleteTeam}
              onManageMembers={handleManageMembers}
            />
          ))}
        </TeamCardContainer>

        <ModalContainer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Team">
          <Form onSubmit={handleCreate}>
            <Label>
              Name
              <FormInput value={name} onChange={e => setName(e.target.value)} required minLength={1} />
            </Label>
            {createErr && <div style={{ color: 'crimson' }}>{createErr}</div>}
            <ButtonRow>
              <CancelButton type="button" onClick={() => setIsCreateOpen(false)}>Cancel</CancelButton>
              <SubmitButton type="submit">Create</SubmitButton>
            </ButtonRow>
          </Form>
        </ModalContainer>

        <TeamMembersModal
          isOpen={isMembersOpen}
          onClose={() => setIsMembersOpen(false)}
          team={selectedTeam}
        />
      </TeamsContainer>
    </Wrapper>
  );
}

export default Teams;
