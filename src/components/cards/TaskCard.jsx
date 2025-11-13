import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: .8rem;
  margin: .4rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  border: 1px solid #ccc;
  background-color: #ffffff;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 8px rgba(0,0,0,.1);
    cursor: pointer;
    transform: translateX(-1px) scale(1.02);
    transition: .3s ease-in-out;
  }
`;

const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const BtnEdit = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: .2rem .5rem;
  border-radius: 4px;

  &:hover {
    background-color: #4c72afa2;
  }
`;

const BtnDelete = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: .2rem .5rem;
  font-size: 1.2em;
  border-radius: 4px;

  &:hover {
    background-color: #b74e4ee8;
  }
`;

const TaskCardBody = styled.div`
  margin-top: 12px;
`;

const TaskDescription = styled.p`
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .75rem;
  flex-wrap: wrap;
  font-size: .9em;
`;

const LeftMeta = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const RightMeta = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const TaskStatus = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;

  &.pending {
    background-color: #fff3cd;
    color: #856404;
  }

  &.in_progress, &.in-progress, &.ongoing {
    background-color: #cce5ff;
    color: #004085;
  }

  &.done, &.completed {
    background-color: #d4edda;
    color: #155724;
  }

  &.canceled {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

const PriorityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: #1a1a1a;
  background: ${({ level }) => level === 'high' ? '#ffd6d6' : level === 'medium' ? '#ffeec2' : '#e6f3ff'};
  border: 1px solid ${({ level }) => level === 'high' ? '#e08b8b' : level === 'medium' ? '#e2c27a' : '#9cc3e8'};
`;

const MetaText = styled.span`
  color: #888;
`;

const ImgIcon = styled.img`
  width: 20px;
  transition: filter .15s ease;

  ${BtnEdit}:hover &, ${BtnDelete}:hover & {
    filter: brightness(0) invert(1);
  }
`;

const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    'in-progress': 'In Progress',
    ongoing: 'Ongoing',
    done: 'Done',
    completed: 'Completed',
    canceled: 'Canceled'
};

const statusLabel = (status) => STATUS_LABELS[status] || 'Pending';

const fmtDate = (value) => {
    if (!value) return '';
    try {
        return new Date(value).toLocaleDateString();
    } catch {
        return '';
    }
};

const TaskCard = ({ task, onEdit, onDelete, onClick }) => {
    const status = task?.status || 'pending';
    const sLabel = statusLabel(status);
    const priority = task?.priority || 'medium';

    const handleCardClick = () => {
        if (onClick) onClick(task);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(task);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(task?.task_id ?? task?.id);
    };

    return (
        <Card onClick={handleCardClick}>
            <TaskCardHeader>
                <TaskTitle>{task?.title || 'Untitled'}</TaskTitle>
                <TaskActions>
                    <BtnEdit onClick={handleEditClick} aria-label="Edit task" title="Edit">
                        <ImgIcon src="/icons/edit.svg" alt="Edit" />
                    </BtnEdit>
                    <BtnDelete onClick={handleDeleteClick} aria-label="Delete task" title="Delete">
                        <ImgIcon src="/icons/delete.svg" alt="Delete" />
                    </BtnDelete>
                </TaskActions>
            </TaskCardHeader>
            <TaskCardBody>
                <TaskDescription>{task?.description || 'No description'}</TaskDescription>
                <TaskMeta>
                    <LeftMeta>
                        <TaskStatus className={status}>{sLabel}</TaskStatus>
                        <PriorityBadge level={priority}>Priority: {priority}</PriorityBadge>
                    </LeftMeta>
                    <RightMeta>
                        {task?.deadline && (
                            <MetaText title={task.deadline}>Due: {fmtDate(task.deadline)}</MetaText>
                        )}
                        {task?.created_at && (
                            <MetaText title={task.created_at}>Created: {fmtDate(task.created_at)}</MetaText>
                        )}
                        {task?.updated_at && (
                            <MetaText title={task.updated_at}>Updated: {fmtDate(task.updated_at)}</MetaText>
                        )}
                    </RightMeta>
                </TaskMeta>
            </TaskCardBody>
        </Card>
    );
};

export default TaskCard;
