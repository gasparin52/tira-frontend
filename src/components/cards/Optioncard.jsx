import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const OptionCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 35vh;
  width: 32vw;
  gap: 1.2rem;
  justify-content: center;
  background: var(--background-gradient);
  padding: 1rem;
  opacity: .9;

  &:hover {
    box-shadow: 0 6px 8px rgba(55,139,207,.858);
    transform: translateX(-3px) scale(1.05);
    transition: 1.8s ease-in-out;
    transition: background .2s;
    background: var(--primary-gradient);
    opacity: .8;
  }
`;

const Leftdiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Rightdiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const OptionImage = styled.img`
  width: 4.5rem;
  height: auto;
`;

const OptionTitle = styled.h3`
  margin-bottom: .5rem;
  font-size: 1.2rem;
`;

const OptionDescription = styled.p`
  font-size: .8rem;
  text-align: center;
  font-weight: 500;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function Optioncard({ title, imageSrc, description, to }) {
  return (
    <StyledLink to={to}>
      <OptionCardContainer>
        <Leftdiv>
          <OptionImage src={imageSrc} alt={title} />
        </Leftdiv>
        <Rightdiv>
          <OptionTitle>{title}</OptionTitle>
          <OptionDescription>{description}</OptionDescription>
        </Rightdiv>
      </OptionCardContainer>
    </StyledLink>
  );
}
export default Optioncard;
