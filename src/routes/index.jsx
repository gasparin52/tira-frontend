import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../views/Home';
import Login from '../views/Login';
import Kanban from '../views/Kanban';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
