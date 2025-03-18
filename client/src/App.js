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
import Programs from './components/Pages/Programs';
import Programe1 from './components/Pages/Programe1';
import Programe2 from './components/Pages/Programe2';
import Programe3 from './components/Pages/Programe3';
import Programe4 from './components/Pages/Programe4';
import Programe5 from './components/Pages/Programe5';
import Programe6 from './components/Pages/Programe6';
import Programe7 from './components/Pages/Programe7';
import Programe8 from './components/Pages/Programe8';
import Programe9 from './components/Pages/Programe9';
import AnnouncementPublished from './components/Pages/AnnouncementPublished';
import Taskview from './components/Pages/Taskview';
import Invoicefee from './components/Pages/Invoicefee';
import Result from './components/Pages/Result';
import './components/CSS/app.css';
import About from './components/Pages/About';
import Services from './components/Pages/Services';
// import bg5 from './components/Images/bg5.jpg';

const App = () => {
  return (
    <AuthProvider>
      <Router>
          <div
                  style={{
                    // backgroundImage: `url(${bg5})`,
                    backgroundColor:'#d9d9d9',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 'auto',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/announcementpublished" element={<AnnouncementPublished />} />
              <Route path="/taskview" element={<Taskview />} />
              <Route path="/applyonline" element={<ApplyOnline />} />
              <Route path="/invoicefee" element={<Invoicefee />} />
              <Route path="/result" element={<Result />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programe1" element={<Programe1 />} />
              <Route path="/programe2" element={<Programe2 />} />
              <Route path="/programe3" element={<Programe3 />} />
              <Route path="/programe4" element={<Programe4 />} />
              <Route path="/programe5" element={<Programe5 />} />
              <Route path="/programe6" element={<Programe6 />} />
              <Route path="/programe7" element={<Programe7 />} />
              <Route path="/programe8" element={<Programe8 />} />
              <Route path="/programe9" element={<Programe9 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
