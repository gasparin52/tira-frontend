import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import TeamCard from '../components/cards/TeamCard';
import ModalContainer from '../components/modals/ModalContainer';
import TeamMembersModal from '../components/modals/TeamMembersModal';
import TeamTagsModal from '../components/modals/TeamTagsModal';
import AlertModal from '../components/modals/AlertModal';
import { useNavigate } from 'react-router-dom';
import { callAPI, normalizePaginatedResponse } from '../utils/api';
import {
  Form, Label, Input as FormInput, ButtonRow,
  CancelButton, PrimaryButton as SubmitButton
} from '../components/common/StyledFormComponents';

const TeamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 1rem;
`;

const TeamCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 1200px;
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
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('alert'); // 'alert' | 'confirm'
  const alertOnAcceptRef = useRef(() => {});
  const alertOnCancelRef = useRef(() => {});

  const loadTeams = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/teams/user/${userId}`);
      const normalized = normalizePaginatedResponse(data);
      setTeams(normalized.items);
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
    setAlertType('confirm');
    setAlertMessage('Delete this team? This action cannot be undone.');
    setAlertOpen(true);
    alertOnAcceptRef.current = async () => {
      setAlertOpen(false);
      try {
        await callAPI(`/teams/${teamId}`, 'DELETE');
        loadTeams();
      } catch (e) {
        setAlertType('alert');
        setAlertMessage(`Error: ${e.message}`);
        setAlertOpen(true);
        alertOnAcceptRef.current = () => setAlertOpen(false);
        alertOnCancelRef.current = () => setAlertOpen(false);
      }
    };
    alertOnCancelRef.current = () => setAlertOpen(false);
  };

  const handleManageMembers = (team) => {
    setSelectedTeam(team);
    setIsMembersOpen(true);
  };

  const handleManageTags = (team) => {
    setSelectedTeam(team);
    setIsTagsOpen(true);
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
              onManageTags={handleManageTags}
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

        <TeamTagsModal
          isOpen={isTagsOpen}
          onClose={() => setIsTagsOpen(false)}
          team={selectedTeam}
        />

        <AlertModal
          isOpen={alertOpen}
          title={alertType === 'confirm' ? 'Confirm' : 'Alert'}
          message={alertMessage}
          onAccept={alertOnAcceptRef.current}
          onCancel={alertOnCancelRef.current}
          showCancel={alertType === 'confirm'}
        />
      </TeamsContainer>
    </Wrapper>
  );
}

export default Teams;
