import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import { callAPI } from '../utils/api';
import AuditCard from '../components/cards/AuditCard';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  color: #333;
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  padding: 15px;
  text-align: center;
  color: #666;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
`;

const Kanban = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await callAPI('/comments?limit=100', 'GET');
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error loading comments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>All Comments</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingMessage>Loading comments...</LoadingMessage>
        ) : comments.length === 0 ? (
          <EmptyMessage>No comments found</EmptyMessage>
        ) : (
          <CommentsContainer>
            {comments.map(comment => (
              <AuditCard key={comment.comment_id} comment={comment} />
            ))}
          </CommentsContainer>
        )}
      </Container>
    </Wrapper>
  );
};

export default Kanban;

