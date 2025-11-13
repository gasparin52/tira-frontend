import React from 'react';
import styled from 'styled-components';

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

const DateTime = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Content = styled.p`
  margin: 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  color: #333;
  line-height: 1.5;
  font-size: 0.95rem;
  border-left: 3px solid #4a90e2;
`;

const AuditCard = ({ comment }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Card>
      <CardHeader>
        <DateTime>{formatDate(comment.created_at)}</DateTime>
      </CardHeader>
      
      <CardBody>
        <Content>{comment.content || 'No content'}</Content>
      </CardBody>
    </Card>
  );
};

export default AuditCard;
