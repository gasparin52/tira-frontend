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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#4a90e2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  min-width: 40px;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#3b78c1' : '#f0f0f0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 5;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  useEffect(() => { if (qpTeam) { setTeamId(qpTeam); localStorage.setItem('team_id', qpTeam); } }, [qpTeam]);

  const loadTasks = useCallback(async (page = 1) => {
    if (!teamId) return;
    setLoading(true);
    setErr('');
    try {
      const offset = (page - 1) * tasksPerPage;
      const data = await callAPI(
        `/tasks?team_id=${encodeURIComponent(teamId)}&limit=${tasksPerPage}&offset=${offset}`
      );
      
      if (data && data.tasks && typeof data.total === 'number') {
        setTasks(data.tasks);
        setTotalTasks(data.total);
      } else if (Array.isArray(data)) {
        setTasks(data);
        if (data.length === tasksPerPage) {
          setTotalTasks(offset + data.length + 1);
        } else {
          setTotalTasks(offset + data.length);
        }
      } else {
        setTasks([]);
        setTotalTasks(0);
      }
      setCurrentPage(page);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [teamId, tasksPerPage]);

  useEffect(() => {
    loadTasks(1);
  }, [teamId]);

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
      loadTasks(1);
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
      
      if (tasks.length === 1 && currentPage > 1) {
        loadTasks(currentPage - 1);
      } else {
        loadTasks(currentPage);
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadTasks(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
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

        {tasks.length > 0 && tasks.map(task => (
          <TaskCard 
            key={task.task_id} 
            task={task} 
            onClick={handleTaskClick}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}

        {/* Paginación */}
        {teamId && (
          <PaginationContainer>
            <PageButton 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </PageButton>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} style={{ padding: '0 0.5rem' }}>...</span>
              ) : (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </PageButton>
              )
            ))}
            
            <PageButton 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ›
            </PageButton>
          
          </PaginationContainer>
        )}

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
              <Select value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </Select>
            </Label>
            <Label>
              Priority
              <Select value={formData.priority} onChange={e => setFormData(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
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
