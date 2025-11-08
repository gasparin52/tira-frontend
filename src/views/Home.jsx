// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import Optioncard from '../components/cards/Optioncard';

const HomeContainer = styled.div`
  display:flex; 
  flex-direction:column; 
  align-items:center; 
  justify-content:center; 
  gap:1rem; 
  height:100%; 
  width:100%; 
  padding:0 0 10vh 0;
`;
const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 0.8fr);
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: white;
    background: linear-gradient(rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.66)), url('/programer.png') no-repeat center center fixed;
    background-size: cover;
    height: 40vh;
    width: 100%;
`;
const TitleDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1.5rem;
`;

const Title = styled.h1`
    font-size: 3rem;
    margin-bottom: 0.5rem;
`;
const Subtitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1rem;
`;
const ImgTira = styled.img`
    width: 5rem;
    height: auto;
    opacity: 0.8;
`;
const Section = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 2rem 0;
`;
const Leftdiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 2rem 2rem 5rem;
    text-align: center;
`;
const Rightdiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const ImgSection = styled.img`
    width: 90%;
    height: auto;
    border-radius: 8px;
`;

function Home() {
    return (
        <HomeContainer>
            <TitleContainer>
                <ImgTira src="./logo.png" alt="logo" />
                <TitleDiv>
                    <Title>Welcome to Tira!</Title>
                    <p>Your gateway to seamless task management.</p>
                </TitleDiv>
            </TitleContainer>
            <CardContainer>
                <Optioncard title="Dashboard" imageSrc="/icons/topology-star-b.svg" description="Learn how to use Tira effectively." to="/dashboard" />
                <Optioncard title="Tasks" imageSrc="/icons/list-detailsb.svg" description="Manage and track your daily work with ease." to="/kanban" />
                <Optioncard title="Teams" imageSrc="/icons/users-groupb.svg" description="Learn how to use Tira effectively." to="/teams" />
            </CardContainer>
            <Section>
                <Leftdiv>
                    <Subtitle>About Tira</Subtitle>
                    <p>Tira is a cutting-edge task management application designed to streamline your workflow and enhance productivity. Whether you're managing personal tasks or collaborating with a team, Tira provides the tools you need to stay organized and efficient.</p>
                </Leftdiv>
                <Rightdiv>
                    <ImgSection src="../task-manage.png" alt="Task Management" />
                </Rightdiv>
            </Section>
        </HomeContainer>
    );
}
export default Home;
