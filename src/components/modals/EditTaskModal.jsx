import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';

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
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4a90e2;
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

  &:hover {
    background: #a51c19;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;

  &:hover {
    background: #3b78c1;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: .9em;
  padding: 8px;
  background: #f8d7da;
  border-radius: 4px;
`;

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const EditTaskModal = ({ isOpen, onClose, task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    deadline: '',
    assigned_to: ''
  });
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        deadline: task.deadline ? formatDateTimeLocal(task.deadline) : '',
        assigned_to: task.assigned_to || ''
      });
    }
  }, [task]);

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day}T${h}:${min}`;
    } catch {
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task?.task_id) return;

    setSubmitting(true);
    setErr('');

    try {
      const payload = {};
      if (formData.title !== task.title) payload.title = formData.title;
      if (formData.description !== task.description) payload.description = formData.description || null;
      if (formData.status !== task.status) payload.status = formData.status;
      if (formData.priority !== task.priority) payload.priority = formData.priority;
      if (formData.assigned_to !== task.assigned_to) payload.assigned_to = formData.assigned_to;

      const newDeadline = formData.deadline ? new Date(formData.deadline).toISOString() : null;
      const oldDeadline = task.deadline ? new Date(task.deadline).toISOString() : null;
      if (newDeadline !== oldDeadline) payload.deadline = newDeadline;

      if (Object.keys(payload).length === 0) {
        setErr('No changes detected');
        setSubmitting(false);
        return;
      }

      const res = await fetch(`${API_BASE}/tasks/${task.task_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Failed to update task');
        throw new Error(errText);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title="Edit Task">
      <Form onSubmit={handleSubmit}>
        <Label>
          Title
          <Input
            type="text"
            value={formData.title}
            onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
            required
            minLength={3}
            maxLength={100}
          />
        </Label>

        <Label>
          Description
          <Textarea
            value={formData.description}
            onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
          />
        </Label>

        <Label>
          Status
          <Select
            value={formData.status}
            onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
          >
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Label>

        <Label>
          Priority
          <Select
            value={formData.priority}
            onChange={e => setFormData(f => ({ ...f, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Label>

        <Label>
          Deadline
          <Input
            type="datetime-local"
            value={formData.deadline}
            onChange={e => setFormData(f => ({ ...f, deadline: e.target.value }))}
          />
        </Label>

        <Label>
          Assigned To (User ID)
          <Input
            type="text"
            value={formData.assigned_to}
            onChange={e => setFormData(f => ({ ...f, assigned_to: e.target.value }))}
          />
        </Label>

        {err && <ErrorMessage>{err}</ErrorMessage>}

        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </SubmitButton>
        </ButtonRow>
      </Form>
    </ModalContainer>
  );
};

export default EditTaskModal;
