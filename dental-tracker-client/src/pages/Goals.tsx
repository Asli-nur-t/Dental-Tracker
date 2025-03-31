import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Flag as FlagIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

interface Goal {
  id: string;
  title: string;
  description: string;
  period: number;
  priority: number;
}

const Goals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [openNewGoal, setOpenNewGoal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    period: '',
    priority: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        setError('Hedefler yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Hedefler yüklenirken bir hata oluştu');
    }
  };

  const handleCreateGoal = async () => {
    try {
      if (!newGoal.title || !newGoal.period || !newGoal.priority) {
        setError('Lütfen tüm zorunlu alanları doldurun');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newGoal.title,
          description: newGoal.description || '',
          period: Number(newGoal.period),
          priority: Number(newGoal.priority)
        })
      });

      if (response.ok) {
        setSuccess('Hedef başarıyla eklendi');
        setOpenNewGoal(false);
        setNewGoal({ title: '', description: '', period: '', priority: '' });
        await fetchGoals();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hedef eklenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Hedef eklenirken bir hata oluştu');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGoal) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5164/api/DentalGoal/${selectedGoal.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Hedef başarıyla silindi');
        setOpenDeleteDialog(false);
        await fetchGoals();
      } else {
        setError('Hedef silinirken bir hata oluştu');
      }
    } catch (error) {
      setError('Hedef silinirken bir hata oluştu');
    }
  };

  const getPriorityColor = (priority: number): "error" | "warning" | "info" | "default" => {
    switch (priority) {
      case 0: return 'info';
      case 1: return 'warning';
      case 2: return 'error';
      default: return 'default';
    }
  };

  const getPeriodText = (period: number) => {
    const periods = ['Günlük', 'Haftalık', 'Aylık', '3 Aylık', '6 Aylık', 'Yıllık'];
    return periods[period] || 'Bilinmiyor';
  };

  const getPriorityText = (priority: number) => {
    const priorities = ['Düşük', 'Orta', 'Yüksek'];
    return priorities[priority] || 'Bilinmiyor';
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 4,
        px: { xs: 2, sm: 4 },
        maxWidth: '1600px',
        margin: '0 auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          borderRadius: 4,
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }} 
        elevation={3}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, sm: 0 },
            width: '100%'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1976d2',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Hedeflerim
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewGoal(true)}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              backgroundColor: '#1976d2',
              fontSize: '1.1rem',
              minWidth: '200px',
              boxShadow: '0 4px 6px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                backgroundColor: '#1565c0',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            Yeni Hedef Ekle
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', width: '100%' }}>
          <Grid 
            container 
            spacing={4} 
            sx={{ 
              width: '100%',
              margin: '0 auto',
              pb: 4
            }}
          >
            {goals.length === 0 ? (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '300px',
                    flexDirection: 'column',
                    gap: 3,
                    background: 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)',
                    borderRadius: 4,
                    p: 6,
                    width: '100%',
                    mx: 'auto'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'center',
                      maxWidth: '500px',
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}
                  >
                    Henüz hedef eklenmemiş. İlk hedefini ekleyerek başla!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewGoal(true)}
                    sx={{ 
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      minWidth: '200px'
                    }}
                  >
                    İlk Hedefini Ekle
                  </Button>
                </Box>
              </Grid>
            ) : (
              goals.map((goal) => (
                <Grid item xs={12} md={6} lg={4} key={goal.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start', 
                          mb: 3,
                          gap: 2
                        }}
                      >
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: '#2c3e50',
                            fontSize: { xs: '1.3rem', sm: '1.5rem' },
                            flex: 1,
                            lineHeight: 1.3
                          }}
                        >
                          {goal.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                          <Chip
                            label={getPriorityText(goal.priority)}
                            color={getPriorityColor(goal.priority)}
                            size="small"
                            icon={<PriorityIcon />}
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: 2,
                              px: 1,
                              height: '32px'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 4,
                          minHeight: '60px',
                          lineHeight: 1.6,
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                      >
                        {goal.description || 'Açıklama bulunmuyor'}
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                          flexWrap: 'wrap'
                        }}
                      >
                        <Chip
                          label={`Periyot: ${getPeriodText(goal.period)}`}
                          variant="outlined"
                          icon={<CalendarIcon />}
                          sx={{ 
                            borderRadius: 2,
                            px: 1,
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            height: '32px',
                            fontSize: '0.95rem'
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Düzenle">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#1976d2',
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSelectedGoal(goal);
                                setOpenDeleteDialog(true);
                              }}
                              sx={{ 
                                color: '#d32f2f',
                                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Paper>

      {/* Yeni Hedef Dialog */}
      <Dialog 
        open={openNewGoal} 
        onClose={() => setOpenNewGoal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            maxWidth: '600px',
            mx: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1976d2',
          pb: 2
        }}>
          Yeni Hedef Ekle
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Başlık"
              fullWidth
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              rows={3}
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth>
              <InputLabel>Periyot</InputLabel>
              <Select
                value={newGoal.period}
                label="Periyot"
                onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={0}>Günlük</MenuItem>
                <MenuItem value={1}>Haftalık</MenuItem>
                <MenuItem value={2}>Aylık</MenuItem>
                <MenuItem value={3}>3 Aylık</MenuItem>
                <MenuItem value={4}>6 Aylık</MenuItem>
                <MenuItem value={5}>Yıllık</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={newGoal.priority}
                label="Öncelik"
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={0}>Düşük</MenuItem>
                <MenuItem value={1}>Orta</MenuItem>
                <MenuItem value={2}>Yüksek</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenNewGoal(false)}
            sx={{ 
              borderRadius: 2,
              px: 3,
              color: '#666'
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleCreateGoal}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            maxWidth: '400px',
            mx: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#d32f2f',
          pb: 2
        }}>
          Hedefi Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedGoal?.title}" hedefini silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ 
              borderRadius: 2,
              px: 3,
              color: '#666'
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Goals; 