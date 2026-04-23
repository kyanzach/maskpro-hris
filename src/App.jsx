import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="job-desk" element={<div className="card">Job Desk Module</div>} />
          <Route path="leaves" element={<div className="card">Leaves Module</div>} />
          <Route path="attendance" element={<div className="card">Attendance Module</div>} />
          <Route path="payroll" element={<div className="card">Payroll Module</div>} />
          <Route path="admin" element={<div className="card">Administration Module</div>} />
          <Route path="settings" element={<div className="card">Settings Module</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
