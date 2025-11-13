import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SideBarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  color: black;
  border-right: 1px solid #bcbcbc;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #bcbcbc;
`;

const ToggleButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
  color: #333;
  &:hover { background: #f2f2f2; }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
`;
const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1.2rem;
`;

const ItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: .8rem 1.2rem;
  padding-left: .8rem;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  transition: background .2s;
  justify-content: flex-start;
  &.active { background: #4a90e2; color: white; }
  &:hover { background: #3b78c1; color: white; }
  &.active ${IconImg}, &:hover ${IconImg} { filter: brightness(0) invert(1); }
`;
const Label = styled.span`
  display: inline;
`;
const CollapsibleContainer = styled(SideBarContainer)`
  width: 15vw;
  transition: width 0.3s ease;
  &.collapsed { width: 60px; }
  &.collapsed ${ItemLink} { justify-content: center; }
  &.collapsed ${IconImg} { margin-right: 0; }
  &.collapsed ${Label} { display: none; }
`;

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('sidebar_collapsed', collapsed ? '1' : '0'); } catch (error) { console.error('Failed to save sidebar state:', error); }
  }, [collapsed]);
  const toggleCollapsed = () => setCollapsed((c) => !c);
  return (
    <CollapsibleContainer className={collapsed ? 'collapsed' : ''}>
      <TopBar>
        <ToggleButton onClick={toggleCollapsed} title={collapsed ? 'Expandir' : 'Colapsar'} aria-label="Toggle sidebar">☰</ToggleButton>
      </TopBar>
      <List>
        <li>
          <ItemLink to="/teams" end title="Teams">
            <IconImg src="/icons/users-groupb.svg" alt="Teams" />
            <Label>Teams</Label>
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/tasks" end title="Tasks">
            <IconImg src="/icons/list-detailsb.svg" alt="Tasks" />
            <Label>Tasks</Label>
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/users" end title="Users">
            <IconImg src="/icons/user.svg" alt="Users" />
            <Label>Users</Label>
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/kanban" end title="Kanban">
            <IconImg src="/icons/table.svg" alt="Kanban" />
            <Label>Kanban</Label>
          </ItemLink>
        </li>
      </List>
    </CollapsibleContainer>
  );
}
