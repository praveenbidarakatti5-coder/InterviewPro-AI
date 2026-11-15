import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Module Pages
import DashboardPage from './pages/DashboardPage';
import QuestionGenPage from './pages/QuestionGenPage';
import MockInterviewPage from './pages/MockInterviewPage';
import CodingPage from './pages/CodingPage';
import ResumePage from './pages/ResumePage';
import RoadmapPage from './pages/RoadmapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/questions" element={<QuestionGenPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
