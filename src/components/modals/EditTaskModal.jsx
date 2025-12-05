import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import { callAPI, normalizePaginatedResponse } from '../../utils/api';
import { formatDateTimeLocal } from '../../utils/dateUtils';
import {
  Form, Label, Input, Textarea, Select, ButtonRow,
  CancelButton, PrimaryButton as SubmitButton, ErrorMessage
} from '../common/StyledFormComponents';

const TagsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TagsSectionTitle = styled.div`
  font-weight: 500;
  font-size: 0.95em;
  margin-bottom: 0.25rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  min-height: 40px;
`;

const TagBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1565c0;
  border: 1px solid #90caf9;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const RemoveTagBtn = styled.span`
  cursor: pointer;
  font-weight: bold;

  &:hover {
    transform: scale(1.2);
  }
`;

const AvailableTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  max-height: 100px;
  overflow-y: auto;
`;

const AddTagBadge = styled(TagBadge)`
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

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
  const [availableTags, setAvailableTags] = useState([]);
  const [taskTags, setTaskTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

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

      const loadTags = async () => {
        if (!task?.task_id || !task?.team_id) return;

        setLoadingTags(true);
        try {
          // Load available tags from team
          const teamTagsData = await callAPI(`/tags/teams/${task.team_id}`, 'GET');
          const normalizedTeamTags = normalizePaginatedResponse(teamTagsData);
          setAvailableTags(normalizedTeamTags.items);

          // Load current task tags
          const taskTagsData = await callAPI(`/tags/tasks/${task.task_id}`, 'GET');
          setTaskTags(Array.isArray(taskTagsData) ? taskTagsData : []);
        } catch {
          // Error loading tags - silent fail
        } finally {
          setLoadingTags(false);
        }
      };

      loadTags();
    }
  }, [task]);

  const handleAddTag = async (tag) => {
    try {
      await callAPI(`/tags/tasks/${task.task_id}`, 'POST', { tag_id: tag.tag_id });
      setTaskTags(prev => [...prev, tag]);
    } catch (e) {
      alert(`Error adding tag: ${e.message}`);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await callAPI(`/tags/tasks/${task.task_id}/${tagId}`, 'DELETE');
      setTaskTags(prev => prev.filter(t => t.tag_id !== tagId));
    } catch (e) {
      alert(`Error removing tag: ${e.message}`);
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

      // If assigned_to changed and it looks like an email, search for user first
      if (formData.assigned_to !== task.assigned_to) {
        const assignValue = formData.assigned_to.trim();

        if (assignValue && assignValue.includes('@')) {
          // It's an email, search for the user
          try {
            const { findUserByEmail } = await import('../../utils/api');
            const user = await findUserByEmail(assignValue);

            if (!user) {
              setErr('User not found with that email');
              setSubmitting(false);
              return;
            }

            payload.assigned_to = user.user_id;
          } catch (error) {
            setErr(`Error finding user: ${error.message}`);
            setSubmitting(false);
            return;
          }
        } else {
          // It's a user_id or empty
          payload.assigned_to = assignValue || null;
        }
      }

      const newDeadline = formData.deadline ? new Date(formData.deadline).toISOString() : null;
      const oldDeadline = task.deadline ? new Date(task.deadline).toISOString() : null;
      if (newDeadline !== oldDeadline) payload.deadline = newDeadline;

      if (Object.keys(payload).length === 0) {
        setErr('No changes detected');
        setSubmitting(false);
        return;
      }

      await callAPI(`/tasks/${task.task_id}`, 'PATCH', payload);

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
          Assigned To (Email or User ID)
          <Input
            type="text"
            value={formData.assigned_to}
            onChange={e => setFormData(f => ({ ...f, assigned_to: e.target.value }))}
            placeholder="user@example.com or user_id"
          />
        </Label>

        {/* Tags Section */}
        <TagsSection>
          <TagsSectionTitle>Tags</TagsSectionTitle>

          {/* Current Tags */}
          <TagsContainer>
            {loadingTags && <div style={{ fontSize: '0.85em', color: '#666' }}>Loading tags...</div>}
            {!loadingTags && taskTags.length === 0 && (
              <div style={{ fontSize: '0.85em', color: '#999' }}>No tags assigned</div>
            )}
            {!loadingTags && taskTags.map(tag => (
              <TagBadge key={tag.tag_id}>
                {tag.name}
                <RemoveTagBtn onClick={() => handleRemoveTag(tag.tag_id)}>×</RemoveTagBtn>
              </TagBadge>
            ))}
          </TagsContainer>

          {/* Available Tags */}
          {!loadingTags && availableTags.length > 0 && (
            <>
              <TagsSectionTitle style={{ fontSize: '0.85em', color: '#666' }}>Available Tags (click to add)</TagsSectionTitle>
              <AvailableTagsContainer>
                {availableTags
                  .filter(tag => !taskTags.some(t => t.tag_id === tag.tag_id))
                  .map(tag => (
                    <AddTagBadge key={tag.tag_id} onClick={() => handleAddTag(tag)}>
                      + {tag.name}
                    </AddTagBadge>
                  ))}
                {availableTags.every(tag => taskTags.some(t => t.tag_id === tag.tag_id)) && (
                  <div style={{ fontSize: '0.85em', color: '#999' }}>All tags assigned</div>
                )}
              </AvailableTagsContainer>
            </>
          )}
        </TagsSection>

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
