import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  min-width: 100px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  background: #ffffff;
  border: 1px solid #ddd;
  color: #222;
  box-shadow: 0 1px 4px rgba(74, 145, 226, 0.158);
  transition: border-color 0.16s, box-shadow 0.16s;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  opacity: 0.9;

  &:focus {
    outline: none;
    border-color: #3b77c14d;
    box-shadow: 0 0 0 1px #4a91e2;
  }

  &:hover {
    border-color: #3b77c14d;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.09);
  border: 1px solid rgba(74, 144, 226, 0.12);
  margin: 0;
  padding: 2px 0;
  list-style: none;
  z-index: 10;
  opacity: ${props => (props.open ? 1 : 0)};
  transform: scaleY(${props => (props.open ? 1 : 0.95)});
  transform-origin: top center;
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  transition: opacity 0.14s, transform 0.14s;
`;

const DropdownItem = styled.li`
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
  color: #222;
  border-radius: 6px;
  transition: background 0.12s;

  &:hover {
    background: #eaf6ff;
  }
`;

const ArrowIcon = styled.img`
  margin-left: auto;
  width: 18px;
  height: 18px;
  display: inline-block;
  transition: transform 0.18s cubic-bezier(.4,0,.2,1);
  transform: rotate(${props => (props.open ? 180 : 0)}deg);
  opacity: 0.7;
`;

export default function AnimatedDropdown({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const selectedLabel =
    options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <DropdownContainer ref={containerRef}>
      <DropdownButton type="button" onClick={() => setOpen(o => !o)}>
        {selectedLabel}
        <ArrowIcon src="/icons/arrow.svg" alt="arrow" open={open} />
      </DropdownButton>
      <DropdownList open={open}>
        {options.map(opt => (
          <DropdownItem
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
}
