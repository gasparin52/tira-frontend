import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { callAPI } from '../../utils/api';
import { formatDate } from '../../utils/dateUtils';

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #ffffff;
  
  &:hover {
    border-color: #4a90e2;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transition: all 0.2s ease;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ActivityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TaskId = styled.div`
  font-size: 0.8rem;
  color: #888;
  font-family: monospace;
`;

const TaskName = styled.div`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const DateTime = styled.div`
  font-size: 0.85rem;
  color: #666;
  text-align: right;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  
  &.pending {
    background-color: #fff3cd;
    color: #856404;
  }
  &.ongoing {
    background-color: #cce5ff;
    color: #004085;
  }
  &.done {
    background-color: #d4edda;
    color: #155724;
  }
  &.canceled {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

const ActionText = styled.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
`;



const AuditCard = ({ activity }) => {
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    const fetchTaskTitle = async () => {
      if (activity?.task_id) {
        try {
          const data = await callAPI(`/tasks/${activity.task_id}`, 'GET');
          setTaskTitle(data?.title || '');
        } catch {
          setTaskTitle('');
        }
      }
    };
    fetchTaskTitle();
  }, [activity?.task_id]);

  return (
    <Card>
      <CardHeader>
        <ActivityInfo>
          <TaskName>
            {taskTitle || ''}
          </TaskName>
        </ActivityInfo>
        <DateTime>{formatDate(activity?.changed_at) || 'N/A'}</DateTime>
      </CardHeader>
      <CardBody>
        <ActionText>
          <span>
            <strong>{activity?.change_type}</strong>
            {' on '}
            <strong>{activity?.entity}</strong>
          </span>
        </ActionText>
        {activity?.change_type === 'UPDATE' && (
          <ActionText>
            <span style={{ color: '#888' }}>From: </span>
            <span style={{ color: '#c00', fontWeight: 500 }}>{activity.old_value ?? '—'}</span>
            <span style={{ margin: '0 8px', color: '#888' }}>→</span>
            <span style={{ color: '#090', fontWeight: 500 }}>{activity.new_value ?? '—'}</span>
          </ActionText>
        )}
        {activity?.change_type === 'CREATE' && (
          <ActionText>
            <span style={{ color: '#090', fontWeight: 500 }}>New value: {activity.new_value ?? '—'}</span>
          </ActionText>
        )}
        {activity?.change_type === 'DELETE' && (
          <ActionText>
            <span style={{ color: '#c00', fontWeight: 500 }}>Deleted value: {activity.old_value ?? '—'}</span>
          </ActionText>
        )}
      </CardBody>
    </Card>
  );
};

export default AuditCard;
