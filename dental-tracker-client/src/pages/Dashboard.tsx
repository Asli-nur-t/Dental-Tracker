import { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import StatusTab from '../components/dashboard/StatusTab';
import GoalsTab from '../components/dashboard/GoalsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0); // 0: Durum, 1: Hedefler

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 4,
        px: { xs: 2, sm: 4 },
        maxWidth: '1600px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        }}
        elevation={3}
      >
        <Box 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            background: '#fff'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 500,
                textTransform: 'none',
                minHeight: 48,
                py: 1,
                px: 3
              },
              '& .Mui-selected': {
                color: '#1976d2',
                fontWeight: 600
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2',
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab label="Durum" />
            <Tab label="Hedefler" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TabPanel value={tabValue} index={0}>
            <StatusTab />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <GoalsTab />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard; 