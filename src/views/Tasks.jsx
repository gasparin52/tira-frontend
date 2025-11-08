// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import TaskCard from '../components/cards/TaskCard';
import ModalContainer from '../components/modals/ModalContainer';
import TaskDetailModal from '../components/modals/TaskDetailModal';
import EditTaskModal from '../components/modals/EditTaskModal';
import { useSearchParams } from 'react-router-dom';
import { callAPI } from '../utils/api';

const Page = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
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

const Input = styled.input`
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;

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

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #cf1818;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #e23f3f;

  &:hover {
    background-color: #ce2525;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;

  &:hover {
    background-color: #3b78c1;
  }
`;

export default function Tasks() {
  const [search] = useSearchParams();
  const qpTeam = search.get('team_id') || '';
  const [teamId, setTeamId] = useState(qpTeam || localStorage.getItem('team_id') || '');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [formData, setFormData] = useState({ title:'', description:'', status:'pending', priority:'medium', deadline:'', assigned_to:'' });
  const [createErr, setCreateErr] = useState('');

  useEffect(() => { if (qpTeam) { setTeamId(qpTeam); localStorage.setItem('team_id', qpTeam); } }, [qpTeam]);

  const loadTasks = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/tasks?team_id=${encodeURIComponent(teamId)}`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleTaskClick = (task) => { setSelectedTask(task); setIsDetailOpen(true); };
  const handleCloseDetail = () => { setIsDetailOpen(false); setSelectedTask(null); };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!teamId || !userId) {
      setCreateErr('Team ID and User ID are required');
      return;
    }
    setCreateErr('');
    try {
      await callAPI('/tasks', 'POST', {
        team_id: teamId,
        created_by: userId,
        assigned_to: formData.assigned_to || userId,
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        content: null
      });
      setIsNewOpen(false);
      setFormData({ title:'', description:'', status:'pending', priority:'medium', deadline:'', assigned_to:'' });
      loadTasks();
    } catch (e) {
      setCreateErr(e.message);
    }
  };

  const handleEditTask = async (task) => {
    setTaskToEdit(task);
    setIsEditOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await callAPI(`/tasks/${taskId}`, 'DELETE');
      loadTasks();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const userId = localStorage.getItem('user_id') || '';

  return (
    <Wrapper>
      <Page>
        <HeaderRow>
          <Title>Tasks</Title>
          <AddButton onClick={() => setIsNewOpen(true)} aria-label="Create task">+</AddButton>
        </HeaderRow>

        {!teamId && <div>Select a team first.</div>}
        {teamId && loading && <div>Loading tasks…</div>}
        {teamId && !loading && err && <div style={{ color: 'crimson' }}>Error: {err}</div>}
        {teamId && !loading && !err && tasks.length === 0 && <div>No tasks for this team.</div>}

        {tasks.map(task => (
          <TaskCard 
            key={task.task_id} 
            task={task} 
            onClick={handleTaskClick}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}

        <ModalContainer isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} title="New task">
          <Form onSubmit={handleCreateTask}>
            <Label>
              Title
              <Input type="text" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required minLength={3} maxLength={100} />
            </Label>
            <Label>
              Description
              <Textarea rows={4} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
            </Label>
            <Label>
              Status
              <select style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>
            </Label>
            <Label>
              Priority
              <select style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} value={formData.priority} onChange={e => setFormData(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Label>
            <Label>
              Deadline
              <Input type="datetime-local" value={formData.deadline} onChange={e => setFormData(f => ({ ...f, deadline: e.target.value }))} />
            </Label>
            <Label>
              Assigned To (User ID)
              <Input type="text" placeholder="Leave empty to assign to yourself" value={formData.assigned_to} onChange={e => setFormData(f => ({ ...f, assigned_to: e.target.value }))} />
            </Label>
            {createErr && <div style={{ color: 'crimson', fontSize: '0.9em' }}>{createErr}</div>}
            <ButtonRow>
              <Button type="button" onClick={() => setIsNewOpen(false)}>Cancel</Button>
              <PrimaryButton type="submit">Create</PrimaryButton>
            </ButtonRow>
          </Form>
        </ModalContainer>

        <TaskDetailModal isOpen={isDetailOpen} onClose={handleCloseDetail} task={selectedTask} />
        <EditTaskModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} task={taskToEdit} onSuccess={loadTasks} />
      </Page>
    </Wrapper>
  );
}
