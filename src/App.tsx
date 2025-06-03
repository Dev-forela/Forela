import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Drawer } from './components/layout/Drawer';
import BottomNav from './components/layout/BottomNav';
import { BottomNavProvider } from './context/BottomNavContext';
import { Home, Edit3, Handshake, FolderHeart, Settings as SettingsIcon, LineChart } from 'lucide-react';
import MyProfile from './pages/MyProfile';
import Journal from './pages/Journal';
import Companion from './pages/Companion';
import Trends from './pages/Trends';
import Settings from './pages/Settings';
import './index.css';

const Symptoms = () => <div><h2>Symptoms</h2><p>This is the symptoms page.</p></div>;

const AppRoutes: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'My Profile', icon: <Home size={20} />, onClick: () => { setDrawerOpen(false); navigate('/'); } },
    { label: 'Journal', icon: <Edit3 size={20} />, shortcutKey: 'journal', onClick: () => { setDrawerOpen(false); navigate('/journal'); } },
    { label: 'Companion', icon: <Handshake size={20} />, shortcutKey: 'companion', onClick: () => { setDrawerOpen(false); navigate('/companion'); } },
    { label: 'Trends', icon: <LineChart size={20} />, shortcutKey: 'trends', onClick: () => { setDrawerOpen(false); navigate('/trends'); } },
    { label: 'Symptoms', icon: <FolderHeart size={20} />, shortcutKey: 'symptoms', onClick: () => { setDrawerOpen(false); navigate('/symptoms'); } },
    { label: 'Settings', icon: <SettingsIcon size={20} />, shortcutKey: 'settings', onClick: () => { setDrawerOpen(false); navigate('/settings'); } },
  ];

  return (
    <>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Layout onMenuClick={() => setDrawerOpen(true)}>
        <Routes>
          <Route path="/" element={<MyProfile />} />
          <Route path="/forela" element={<Navigate to="/" replace />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/companion" element={<Companion />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <BottomNav />
    </>
  );
};

const App: React.FC = () => {
  const handleMenuClick = () => {
    // Handle menu click logic here
  };

  return (
    <BottomNavProvider>
      <Router>
        <AppRoutes onMenuClick={handleMenuClick} />
      </Router>
    </BottomNavProvider>
  );
};

export default App;
