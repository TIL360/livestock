import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Bars/Dashboard';
import AuthProvider from './components/context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from '../src/components/Bars/Navbar';
import ApplyOnline from './components/Pages/ApplyOnline';
import Footer from './components/Bars/Footer';
import AnnouncementPublished from './components/Pages/AnnouncementPublished';
import './components/CSS/app.css';
import About from './components/Pages/About';
import Services from './components/Pages/Services';
import Display from './components/Pages/Display';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Flex container to push footer down */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '200vh', // Full viewport height
            backgroundColor: '#d9d9d9',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
          }}
        >
          {/* Navbar at the top */}
          <Navbar />

          {/* Main content area with flex: 1 to fill remaining space */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/announcementpublished" element={<AnnouncementPublished />} />
              <Route path="/applyonline" element={<ApplyOnline />} />
              <Route path="/display" element={<Display />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
