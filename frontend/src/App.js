import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext'; // Import the AuthContext
import ToDoList from './components/dashboard/ToDoList';
import Login from './components/auth/login'; // Your Login component
import ProtectedRoute from './components/protectedRoute'; // Custom ProtectedRoute component
import Profile from './components/pages/profile';
import Layout from './components/layout/layout';
import LandingPage from './components/pages/landingPage';
import Register from './components/auth/register';
import ForgotPassword from './components/auth/forgotPassword';
import ResetPassword from './components/auth/resetPassword';

const App = () => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
    <AuthProvider>
      
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
          {/* Protect the ToDoList route */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<ProtectedRoute><ToDoList /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>


        </Routes>
      
    </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
