import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/navigation/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { ProfilePage } from './pages/ProfilePage';
import { SprintHistoryPage } from './pages/SprintHistoryPage';
import { ApiEndpointsPage } from './pages/ApiEndpointsPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <TasksProvider>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes */}
                    <Route path="/tasks" element={
                      <ProtectedRoute>
                        <Navbar />
                        <TasksPage />
                      </ProtectedRoute>
                    } />

                    <Route path="/sprint-history" element={
                      <ProtectedRoute>
                        <Navbar />
                        <SprintHistoryPage />
                      </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Navbar />
                        <ProfilePage />
                      </ProtectedRoute>
                    } />

                    <Route path="/api-endpoints" element={
                      <ProtectedRoute>
                        <Navbar />
                        <ApiEndpointsPage />
                      </ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/tasks" replace />} />
                  </Routes>

                  <ToastContainer />
                </div>
              </TasksProvider>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;