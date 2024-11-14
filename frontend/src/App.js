import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext'; // Import the AuthContext
import ToDoList from './components/dashboard/ToDoList';
import Login from './components/auth/login'; // Your Login component
import ProtectedRoute from './components/protectedRoute'; // Custom ProtectedRoute component

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Protect the ToDoList route */}
          <Route path="/dashboard" element={<ProtectedRoute><ToDoList /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
