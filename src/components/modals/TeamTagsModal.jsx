import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import { callAPI, normalizePaginatedResponse } from '../../utils/api';
import {
  Label as BaseLabel, Input, PrimaryButton as Button, ErrorMessage
} from '../common/StyledFormComponents';

const Label = styled(BaseLabel)`
  font-size: 0.9em;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
`;

const TagsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 4px;
  background: #f6f8fa;

  &:hover {
    background: #e1e4e8;
  }
`;

const TagInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ColorPreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ color }) => color || '#e3f2fd'};
  border: 2px solid #ddd;
`;

const TagName = styled.span`
  font-weight: 500;
  color: #333;
`;

const TagActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const IconButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9em;

  &:hover {
    background: ${({ danger }) => danger ? '#dc3545' : '#4a90e2'};
    color: white;
  }
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  background: #f6f8fa;
`;

const FormRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const ColorInput = styled.input`
  width: 60px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const TeamTagsModal = ({ isOpen, onClose, team }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [newTag, setNewTag] = useState({ name: '' });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '' });

  useEffect(() => {
    if (!isOpen || !team?.team_id) return;
    loadTags();
  }, [isOpen, team?.team_id]);

  const loadTags = async () => {
    if (!team?.team_id) return;

    setLoading(true);
    setErr('');

    try {
      const data = await callAPI(`/tags/teams/${team.team_id}`, 'GET');
      const normalized = normalizePaginatedResponse(data);
      setTags(normalized.items);
    } catch (e) {
      setErr(e.message || 'Error loading tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();

    if (!newTag.name.trim()) {
      setErr('Tag name is required');
      return;
    }

    setCreating(true);
    setErr('');

    try {
      await callAPI(`/tags/teams/${team.team_id}`, 'POST', {
        name: newTag.name.trim()
      });

      setNewTag({ name: '' });
      await loadTags();
    } catch (e) {
      setErr(e.message || 'Error creating tag');
    } finally {
      setCreating(false);
    }
  };

  const handleEditTag = (tag) => {
    setEditingId(tag.tag_id);
    setEditData({ name: tag.name });
  };

  const handleSaveEdit = async (tagId) => {
    if (!editData.name.trim()) {
      setErr('Tag name is required');
      return;
    }

    try {
      const tag = tags.find(t => t.tag_id === tagId);
      if (!tag) return;

      await callAPI(`/tags/teams/${team.team_id}/${tagId}`, 'PATCH', {
        name: editData.name.trim()
      });

      setEditingId(null);
      await loadTags();
    } catch (e) {
      setErr(e.message || 'Error updating tag');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '' });
  };

  const handleDeleteTag = async (tagId) => {
    if (!confirm('Delete this tag? This will remove it from all tasks.')) return;

    try {
      await callAPI(`/tags/teams/${team.team_id}/${tagId}`, 'DELETE');
      await loadTags();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={`Manage Tags - ${team?.name || ''}`}>
      <Container>
        {/* Create New Tag Form */}
        <CreateForm onSubmit={handleCreateTag}>
          <div style={{ fontSize: '0.95em', fontWeight: 600, marginBottom: '4px' }}>
            Create New Tag
          </div>
          <FormRow>
            <Label>
              Name
              <Input
                type="text"
                value={newTag.name}
                onChange={e => setNewTag(t => ({ ...t, name: e.target.value }))}
                placeholder="e.g. Bug, Feature, Urgent"
                maxLength={50}
                required
              />
            </Label>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </FormRow>
        </CreateForm>

        {err && <ErrorMessage>
          <strong>Error:</strong> {err}
          <br />
          <small>Team ID: {team?.team_id}</small>
          {err.includes('Something went wrong') && (
            <>
              <br /><br />
              <strong>⚠️ Known Backend Issue:</strong>
              <br />
              <small>
                There's a bug in the backend repository (tag.repository.ts line 51).
                <br />
                The SQL query placeholders are incorrect. Contact backend team to fix:
                <br />
                Add <code>values.push(pageSize, offset)</code> before the query.
              </small>
            </>
          )}
        </ErrorMessage>}

        {/* Tags List */}
        {loading && <div style={{ padding: '1rem', textAlign: 'center' }}>Loading tags...</div>}

        {!loading && tags.length === 0 && (
          <EmptyMessage>No tags yet. Create one above!</EmptyMessage>
        )}

        {!loading && tags.length > 0 && (
          <TagsList>
            {tags.map(tag => (
              <TagItem key={tag.tag_id}>
                {editingId === tag.tag_id ? (
                  <>
                    <TagInfo style={{ flex: 1 }}>
                      <Input
                        type="text"
                        value={editData.name}
                        onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                        style={{ flex: 1 }}
                        autoFocus
                      />
                    </TagInfo>
                    <TagActions>
                      <IconButton onClick={() => handleSaveEdit(tag.tag_id)} title="Save">
                        <img src="/icons/edit.svg" alt="save" style={{ width: '16px', height: '16px' }} />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit} title="Cancel" danger>
                        <img src="/icons/delete.svg" alt="cancel" style={{ width: '16px', height: '16px' }} />
                      </IconButton>
                    </TagActions>
                  </>
                ) : (
                  <>
                    <TagInfo>
                      <TagName>{tag.name}</TagName>
                    </TagInfo>
                    <TagActions>
                      <IconButton onClick={() => handleEditTag(tag)} title="Edit">
                        <img src="/icons/edit.svg" alt="edit" style={{ width: '16px', height: '16px' }} />
                      </IconButton>
                      <IconButton danger onClick={() => handleDeleteTag(tag.tag_id)} title="Delete">
                        <img src="/icons/delete.svg" alt="delete" style={{ width: '16px', height: '16px' }} />
                      </IconButton>
                    </TagActions>
                  </>
                )}
              </TagItem>
            ))}
          </TagsList>
        )}
      </Container>
    </ModalContainer>
  );
};

export default TeamTagsModal;
