import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import { callAPI } from '../utils/api';

const Page = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
`;

const CommentContent = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #dc3545;
  color: white;
  font-size: 12px;
  &:hover { opacity: 0.8; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  &:focus { outline: none; border-color: #4a90e2; }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
  align-self: flex-end;
  &:hover { background: #3b78c1; }
`;


export default function Comments() {
  const userId = localStorage.getItem('user_id') || '';
  const taskId = localStorage.getItem('task_id') || ''; 
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [content, setContent] = useState('');

  const loadComments = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI(`/comments?task_id=${taskId}`);
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await callAPI(`/comments/tasks/${taskId}`, 'POST', {
        author_id: userId,
        content: content.trim()
      });
      setContent('');
      loadComments();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await callAPI(`/comments/${commentId}`, 'DELETE');
      loadComments();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <Page>
        <Title>Comments</Title>

        {!taskId && <div>Select a task to view comments.</div>}
        {taskId && loading && <div>Loading comments...</div>}
        {taskId && !loading && err && <div style={{ color: 'crimson' }}>{err}</div>}

        {taskId && !loading && (
          <>
            <Form onSubmit={handleCreate}>
              <Textarea
                rows={3}
                placeholder="Write a comment..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
              {err && <div style={{ color: 'crimson' }}>{err}</div>}
              <SubmitButton type="submit">Post</SubmitButton>
            </Form>

            <CommentsList>
              {comments.length === 0 ? (
                <div>No comments yet.</div>
              ) : (
                comments.map(c => (
                  <CommentCard key={c.comment_id}>
                    <CommentHeader>
                      <span>{c.author_id} - {new Date(c.created_at).toLocaleString()}</span>
                      <DeleteButton onClick={() => handleDelete(c.comment_id)}>Delete</DeleteButton>
                    </CommentHeader>
                    <CommentContent>{c.content}</CommentContent>
                  </CommentCard>
                ))
              )}
            </CommentsList>
          </>
        )}
      </Page>
    </Wrapper>
  );
}
