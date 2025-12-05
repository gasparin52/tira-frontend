import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Wrapper from '../components/wrapper';
import { callAPI, normalizePaginatedResponse } from '../utils/api';
import AuditCard from '../components/cards/AuditCard';

const Container = styled.div`
  padding: 20px;
  margin-bottom: 8vh;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  color: #333;
`;

const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 900px;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  color: #333;
  min-width: 60px;

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // numero de items por página
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem('user_id') || '';

  useEffect(() => {
    if (!userId) {
      setError('No user ID found.');
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `/users/${userId}/activity?page=${page}&pageSize=${pageSize}`;
        const data = await callAPI(url, 'GET');

        const normalized = normalizePaginatedResponse(data);

        setActivities(normalized.items || data.data || []);

        const totalPagesFromApi =
          normalized.totalPages ??
          normalized.pagination?.totalPages ??
          1;

        const currentPageFromApi =
          normalized.page ?? normalized.pagination?.page ?? page;

        setTotalPages(totalPagesFromApi);
        setPage(currentPageFromApi);
      } catch (err) {
        setError(err.message || 'Error loading activity history.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, page, pageSize]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  return (
    <Wrapper>
      <Container>
        <Title>Activity History</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingMessage>Loading activity history...</LoadingMessage>
        ) : activities.length === 0 ? (
          <EmptyMessage>No activity history found</EmptyMessage>
        ) : (
          <>
            <ActivitiesContainer>
              {activities.map((activity, idx) => (
                <AuditCard
                  key={activity.history_id || idx}
                  activity={activity}
                />
              ))}
            </ActivitiesContainer>

            {totalPages > 1 && (
              <PaginationContainer>
                <PageButton
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  ‹ Prev
                </PageButton>

                <PageInfo>
                  Page {page} of {totalPages}
                </PageInfo>

                <PageButton
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next ›
                </PageButton>
              </PaginationContainer>
            )}
          </>
        )}
      </Container>
    </Wrapper>
  );
};

export default Activity;
