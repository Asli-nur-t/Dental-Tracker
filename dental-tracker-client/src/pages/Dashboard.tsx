import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import StatusTab from '../components/dashboard/StatusTab';
import GoalsTab from '../components/dashboard/GoalsTab';
import SideMenu from '../components/SideMenu';

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7f9', p: 3 }}>
      <SideMenu isOpen={menuOpen} onToggle={toggleMenu} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin-left 0.3s ease',
          marginLeft: menuOpen ? '280px' : 0,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: '16px',
            minHeight: 'calc(100vh - 48px)',
            background: 'white',
            overflow: 'hidden',
            p: 3
          }}
        >
          <Routes>
            <Route path="/" element={<StatusTab />} />
            <Route path="/goals" element={<GoalsTab />} />
            <Route path="*" element={<StatusTab />} />
          </Routes>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard; 