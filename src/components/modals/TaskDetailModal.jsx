import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import { callAPI } from '../../utils/api';

const DetailGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;
const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: start;
`;
const Label = styled.div`
  font-weight: 600;
  color: #555;
`;
const Value = styled.div`
  color: #333;
  word-break: break-word;
`;
const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  &.pending { background-color: #fff3cd; color: #856404; }
  &.in-progress, &.ongoing { background-color: #cce5ff; color: #004085; }
  &.done, &.completed { background-color: #d4edda; color: #155724; }
  &.canceled { background-color: #f8d7da; color: #721c24; }
`;


const PriorityBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 600;
  background: ${({ level }) => level === 'high' ? '#ffd6d6' : level === 'medium' ? '#ffeec2' : '#e6f3ff'};
  border: 1px solid ${({ level }) => level === 'high' ? '#e08b8b' : level === 'medium' ? '#e2c27a' : '#9cc3e8'};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 16px 0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: #333;
`;

const CommentsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  position: relative;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;
const CommentAuthor = styled.div`
  font-weight: 600;
  font-size: 0.9em;
  color: #555;
`;
const CommentDate = styled.div`
  font-size: 0.8em;
  color: #888;
`;
const CommentContent = styled.div`
  font-size: 0.95em;
  color: #333;
  line-height: 1.4;
`;
const DeleteCommentBtn = styled.button`
  background: #e93737;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #f5f5f5;
  &:hover { background-color: #cb3131; }
`;
const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &:focus { outline: none; border-color: #4a90e2; }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  font-size: 14px;
  &:hover { background: #3b78c1; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;
const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
`;
const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9em;
  padding: 8px;
  background: #f8d7da;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const [comments, setComments] = useState([]);
  const [commentAuthors, setCommentAuthors] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedName, setAssignedName] = useState('');
  const [createdName, setCreatedName] = useState('');

  const userId = localStorage.getItem('user_id') || '';

  const loadComments = useCallback(async () => {
    if (!task?.task_id) return;
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/comments?task_id=${task.task_id}`, 'GET');
      const list = Array.isArray(data) ? data : [];
      setComments(list);
      const ids = Array.from(new Set(list.map(c => c.author_id).filter(Boolean)));
      if (ids.length > 0) {
        const authorMap = {};
        await Promise.all(ids.map(async (id) => {
          try {
            const dU = await callAPI(`/users?user_id=${encodeURIComponent(id)}`, 'GET');
            const arr = Array.isArray(dU) ? dU : (Array.isArray(dU?.users) ? dU.users : []);
            if (arr[0]?.username) authorMap[id] = arr[0].username;
          } catch { /* ignore */ }
        }));
        setCommentAuthors(authorMap);
      } else {
        setCommentAuthors({});
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [task?.task_id]);

  useEffect(() => {
    if (isOpen && task?.task_id) {
      loadComments();
    }
  }, [isOpen, task?.task_id, loadComments]);

  useEffect(() => {
    const parseUsers = (data) => Array.isArray(data) ? data : (Array.isArray(data?.users) ? data.users : []);
    const fetchUser = async (userId) => {
      if (!userId) return '';
      try {
        const data = await callAPI(`/users?user_id=${encodeURIComponent(userId)}`, 'GET');
        const list = parseUsers(data);
        return list[0]?.username || '';
      } catch { return ''; }
    };
    let cancelled = false;
    const go = async () => {
      const [an, cn] = await Promise.all([
        fetchUser(task?.assigned_to),
        fetchUser(task?.created_by)
      ]);
      if (cancelled) return;
      setAssignedName(an);
      setCreatedName(cn);
    };
    if (isOpen && (task?.assigned_to || task?.created_by)) {
      go();
    } else {
      setAssignedName('');
      setCreatedName('');
    }
    return () => { cancelled = true; };
  }, [isOpen, task?.assigned_to, task?.created_by]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;
    setSubmitting(true);
    setErr('');
    try {
      await callAPI(`/comments/tasks/${task.task_id}`, 'POST', {
        author_id: userId,
        content: newComment.trim()
      });
      setNewComment('');
      await loadComments();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await callAPI(`/comments/${commentId}`, 'DELETE');
      await loadComments();
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try { return new Date(dateStr).toLocaleString(); } catch { return dateStr; }
  };

  const statusClass = (status) => {
    if (status === 'in_progress') return 'in-progress';
    if (status === 'ongoing') return 'ongoing';
    return status || 'pending';
  };

  if (!task) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} title={task.title || 'Task Details'}>
      <DetailGrid>
        <DetailRow>
          <Label>Status:</Label>
          <Value>
            <StatusBadge className={statusClass(task.status)}>
              {task.status || 'pending'}
            </StatusBadge>
          </Value>
        </DetailRow>
        <DetailRow>
          <Label>Priority:</Label>
          <Value>
            <PriorityBadge level={task.priority || 'medium'}>
              {task.priority || 'medium'}
            </PriorityBadge>
          </Value>
        </DetailRow>
        {task.description && (
          <DetailRow>
            <Label>Description:</Label>
            <Value>{task.description}</Value>
          </DetailRow>
        )}
        {task.deadline && (
          <DetailRow>
            <Label>Deadline:</Label>
            <Value>{formatDate(task.deadline)}</Value>
          </DetailRow>
        )}
        {task.assigned_to && (
          <DetailRow>
            <Label>Assigned To:</Label>
            <Value>{assignedName || task.assigned_to}</Value>
          </DetailRow>
        )}
        {task.created_by && (
          <DetailRow>
            <Label>Created By:</Label>
            <Value>{createdName || task.created_by}</Value>
          </DetailRow>
        )}
        {task.last_modified_at && (
          <DetailRow>
            <Label>Last Modified:</Label>
            <Value>{formatDate(task.last_modified_at)}</Value>
          </DetailRow>
        )}
      </DetailGrid>
      <Divider />
      <SectionTitle>Comments ({comments.length})</SectionTitle>
      {err && <ErrorMessage>{err}</ErrorMessage>}
      {loading && <EmptyMessage>Loading comments...</EmptyMessage>}
      {!loading && comments.length === 0 && (
        <EmptyMessage>No comments yet. Be the first to comment!</EmptyMessage>
      )}
      {!loading && comments.length > 0 && (
        <CommentsList>
          {comments.map((comment) => (
            <CommentCard key={comment.comment_id}>
              <CommentHeader>
                <CommentAuthor>
                  {commentAuthors[comment.author_id] || comment.author_id || 'Anonymous'}
                </CommentAuthor>
                <CommentDate>{formatDate(comment.created_at)}</CommentDate>
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
              {comment.author_id === userId && (
                <DeleteCommentBtn
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  title="Delete comment"
                >
                  ×
                </DeleteCommentBtn>
              )}
            </CommentCard>
          ))}
        </CommentsList>
      )}
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentTextarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          maxLength={300}
          disabled={submitting || !userId}
        />
        <ButtonRow>
          <SubmitButton type="submit" disabled={submitting || !newComment.trim() || !userId}>
            {submitting ? 'Posting...' : 'Add Comment'}
          </SubmitButton>
        </ButtonRow>
      </CommentForm>
    </ModalContainer>
  );
};

export default TaskDetailModal;
