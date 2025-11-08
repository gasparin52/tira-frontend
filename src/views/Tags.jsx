// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Wrapper from '../components/wrapper';
import styled from 'styled-components';
import ModalContainer from '../components/modals/ModalContainer';
import { callAPI } from '../utils/api';

const Page = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
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

const TagList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
`;

const TagItem = styled.li`
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
`;

const DeleteBtn = styled.button`
    border: none;
    background: #e93737;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    
    &:hover {
        background: #cb3131;
    }
`;

const Form = styled.form`
    display: grid;
    gap: 12px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
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
`;

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [createErr, setCreateErr] = useState('');

  const loadTags = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await callAPI('/tags', 'GET');
      setTags(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateErr('');
    try {
      await callAPI('/tags', 'POST', { name });
      setIsOpen(false);
      setName('');
      loadTags();
    } catch (e) {
      setCreateErr(e.message);
    }
  };

  const handleDelete = async (tagId) => {
    if (!confirm('Delete this tag?')) return;
    try {
      await callAPI(`/tags/${tagId}`, 'DELETE');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Wrapper>
      <Page>
        <HeaderRow>
          <Title>Tags</Title>
          <AddButton onClick={() => setIsOpen(true)} aria-label="Create tag">
            +
          </AddButton>
        </HeaderRow>
        {loading && <div>Loading tags...</div>}
        {err && <div style={{ color: 'crimson' }}>{err}</div>}
        {!loading && !err && tags.length === 0 && <div>No tags created yet.</div>}
        <TagList>
          {tags.map(t => (
            <TagItem key={t.tag_id}>
              <span>{t.name}</span>
              <DeleteBtn onClick={() => handleDelete(t.tag_id)}>X</DeleteBtn>
            </TagItem>
          ))}
        </TagList>
        <ModalContainer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Tag">
          <Form onSubmit={handleCreate}>
            <Label>
              Name
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                minLength={1}
              />
            </Label>
            {createErr && <div style={{ color: 'crimson' }}>{createErr}</div>}
            <ButtonRow>
              <CancelButton type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">Create</SubmitButton>
            </ButtonRow>
          </Form>
        </ModalContainer>
      </Page>
    </Wrapper>
  );
}