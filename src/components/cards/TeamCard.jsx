// @ts-nocheck
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledTeamCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 16px;
  width: 25vw;
  cursor: pointer;
  background-color: white;
  position: relative;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 8px rgba(0,0,0,.1);
    transform: translateX(-1px) scale(1.02);
    transition: .3s ease-in-out;
  }

  &.selected {
    border-color: #007bff;
    background-color: #f0f8ff;
  }

  .team-card-content {
    .team-name {
      font-size: 1.2em;
      margin: 0;
      border-bottom: 2px solid #103f9c9d;
      padding-right: 1rem;
    }

    .team-description {
      font-size: 1em;
      color: #666;
    }
  }
`;

const TeamActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
`;

const ActionBtn = styled.button`
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: .75em;

  &:hover {
    opacity: .8;
    background: ${p => p.danger ? '#ea4252' : '#39556e'};

    img {
      filter: brightness(0) invert(1);
    }
  }
`;

const MembersToggle = styled.button`
  margin-top: 8px;
  background: transparent;
  border: none;
  color: #111;
  cursor: pointer;
  padding: 0;
  font-size: .9em;
  text-decoration: none;
  margin: .8rem 0;

  &:hover {
    color: #080809c7;
  }
`;

const MembersList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 18px;
  max-height: 140px;
  overflow-y: auto;
  color: #333;
  font-size: .9em;
  list-style: square;
`;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TeamCard = ({ team, onClick, selected, onDelete, onManageMembers }) => {
  const handleCardClick = () => {
    if (onClick) onClick(team);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(team.team_id);
  };

  const handleMembers = (e) => {
    e.stopPropagation();
    if (onManageMembers) onManageMembers(team);
  };

  const [membersOpen, setMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersErr, setMembersErr] = useState('');

  useEffect(() => {
    if (!membersOpen) return;
    if (members.length > 0) return;
    
    let cancelled = false;

    const load = async () => {
      setLoadingMembers(true);
      setMembersErr('');
      
      try {
        const res = await fetch(`${API_BASE}/teams/${team.team_id}/members`);
        if (!res.ok) throw new Error('Failed to load members');
        
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        
        if (!cancelled) setMembers(list);
      } catch (e) {
        if (!cancelled) setMembersErr(e.message || 'Error loading members');
      } finally {
        if (!cancelled) setLoadingMembers(false);
      }
    };

    load();
    
    return () => {
      cancelled = true;
    };
  }, [membersOpen, team?.team_id, members.length]);

  return (
    <StyledTeamCard 
      className={`team-card ${selected ? 'selected' : ''}`} 
      onClick={handleCardClick}
    >
      <TeamActions>
        {onManageMembers && (
          <ActionBtn onClick={handleMembers} title="Manage members">
            <img src="/icons/users.svg" alt="users" />
          </ActionBtn>
        )}
        {onDelete && (
          <ActionBtn danger onClick={handleDelete} title="Delete team">
            <img src="/icons/delete.svg" alt="delete" />
          </ActionBtn>
        )}
      </TeamActions>
      
      <div className="team-card-content">
        <h3 className="team-name">{team.name}</h3>
        <p className="team-description">{team.description}</p>
        
        <MembersToggle 
          onClick={(e) => {
            e.stopPropagation();
            setMembersOpen(o => !o);
          }}
        >
          {membersOpen ? 'Hide members' : 'Show members'}
          {members.length > 0 ? ` (${members.length})` : ''}
        </MembersToggle>
        
        {membersOpen && (
          <div>
            {loadingMembers && <div>Loading members…</div>}
            {membersErr && <div style={{ color: 'crimson' }}>{membersErr}</div>}
            {!loadingMembers && !membersErr && (
              <MembersList>
                {members.map(m => (
                  <li key={m.user_id}>
                    {m.username || m.email || m.user_id}
                  </li>
                ))}
              </MembersList>
            )}
          </div>
        )}
      </div>
    </StyledTeamCard>
  );
};

export default TeamCard;
