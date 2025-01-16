import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Bars/Dashboard';
import AuthProvider from './components/context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from '../src/components/Bars/Navbar';
import About from './components/Pages/About';
import ApplyOnline from './components/Pages/ApplyOnline';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ApplyOnline" element={<ApplyOnline />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
