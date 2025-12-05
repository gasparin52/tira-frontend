import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GET, normalizePaginatedResponse } from '../../utils/api';

const StyledTeamCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: .8rem;
  margin: .4rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
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
  
  img {
    width: 16px;
    height: 16px;
  }

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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #080809c7;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${({ open }) => open ? 'rotate(90deg)' : 'rotate(0deg)'};
  font-weight: bold;
`;

const MembersListWrapper = styled.div`
  overflow: hidden;
  max-height: ${({ open }) => open ? '200px' : '0'};
  transition: max-height 0.3s ease;
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

const TeamCard = ({ team, onClick, selected, onDelete, onManageMembers, onManageTags }) => {
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

  const handleTags = (e) => {
    e.stopPropagation();
    if (onManageTags) onManageTags(team);
  };

  const [membersOpen, setMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersErr, setMembersErr] = useState('');

  useEffect(() => {
    if (members.length > 0) return;
    
    let cancelled = false;

    const load = async () => {
      setLoadingMembers(true);
      setMembersErr('');
      
      try {
        const data = await GET(`/teams/${team.team_id}/members`);
        const normalized = normalizePaginatedResponse(data);
        
        if (!cancelled) setMembers(normalized.items);
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
  }, [team?.team_id, members.length]);

  return (
    <StyledTeamCard 
      className={`team-card ${selected ? 'selected' : ''}`} 
      onClick={handleCardClick}
    >
      <TeamActions>
        {onManageTags && (
          <ActionBtn onClick={handleTags} title="Manage tags">
            <img src="/icons/tag.svg" alt="tags" />
          </ActionBtn>
        )}
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
          <Arrow open={membersOpen}>›</Arrow>
          {membersOpen ? 'Hide members' : 'Show members'}
          {members.length > 0 ? ` (${members.length})` : ''}
        </MembersToggle>
        
        <MembersListWrapper open={membersOpen}>
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
        </MembersListWrapper>
      </div>
    </StyledTeamCard>
  );
};

export default TeamCard;
