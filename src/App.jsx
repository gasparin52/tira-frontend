// @ts-nocheck
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BaseLayoutComponent from './components/Baselayout';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Teams from './views/Teams';
import Kanban from './views/Kanban';
import Users from './views/Users';
import Tasks from './views/Tasks';
import Comments from './views/Comments';

function App() {
  return (
    <BaseLayoutComponent>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BaseLayoutComponent>
  );
}
export default App;
