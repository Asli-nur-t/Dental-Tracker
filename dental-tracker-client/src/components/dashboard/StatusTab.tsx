import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Link,
  Breadcrumbs,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { tr } from 'date-fns/locale';
import DailyTip from '../DailyTip';
import {
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  goalId: string;
  activityDate: string;
  duration: string;
  isCompleted: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  period: number;
  priority: number;
}

const StatusTab = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [lastGoal, setLastGoal] = useState<Goal | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState('');
  const [completedGoals, setCompletedGoals] = useState<{ [key: string]: boolean }>({});
  const [note, setNote] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tip, setTip] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLastSevenDaysActivities();
    fetchGoals();
    fetchRandomTip();
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      setLastGoal(goals[goals.length - 1]);
    }
  }, [goals]);

  useEffect(() => {
    const completed = activities
      .filter(activity => activity.isCompleted)
      .map(activity => {
        const goal = goals.find(g => g.id === activity.goalId);
        return goal ? goal.title : '';
      })
      .filter(title => title !== '');
    setCompletedTasks(completed);
  }, [activities, goals]);

  const fetchLastSevenDaysActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalActivity/last-seven-days', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const sortedActivities = data.sort((a: Activity, b: Activity) => 
          new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
        );
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Aktiviteler getirilirken hata oluştu:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Hedefler getirilemedi');
      }

      const data = await response.json();
      setGoals(data);
      setError('');
    } catch (error) {
      console.error('Hedefler getirilirken hata oluştu:', error);
      setError(error instanceof Error ? error.message : 'Hedefler getirilirken bir hata oluştu');
    }
  };

  const fetchRandomTip = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalTip/random', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTip(data.content);
      }
    } catch (error) {
      console.error('Öneri getirilirken hata oluştu:', error);
    }
  };

  const handleActivitySubmit = async (goalId: string) => {
    try {
      const token = localStorage.getItem('token');
      const isCompleted = completedGoals[goalId] || false;
      
      const response = await fetch('http://localhost:5164/api/DentalActivity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          activityDate: selectedDate,
          duration: duration,
          isCompleted: isCompleted,
        }),
      });

      if (response.ok) {
        setSuccess(`Hedef ${isCompleted ? 'tamamlandı' : 'güncellendi'}`);
        await fetchLastSevenDaysActivities();
        setDuration('');
        setCompletedGoals(prev => ({ ...prev, [goalId]: false }));
      } else {
        setError('Aktivite kaydedilemedi');
      }
    } catch (error) {
      setError('Aktivite kaydedilirken bir hata oluştu');
    }
  };

  const handleNoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('description', note);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5164/api/DentalActivity/note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('Not başarıyla eklendi');
        setNote('');
        setImage(null);
      } else {
        setError('Not eklenemedi');
      }
    } catch (error) {
      setError('Not eklenirken bir hata oluştu');
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
    <Box sx={{ width: '100%', p: { xs: 2, sm: 4 } }}>
      {/* Navigasyon Linkleri */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/dashboard/profile')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: '#1976d2',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <PersonIcon /> Profil
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => window.open('https://hsgm.saglik.gov.tr/tr/yasli-sagligi/agiz-ve-dis-sagligi.html', '_blank')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: '#1976d2',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <HospitalIcon /> Ağız ve Diş Sağlığı
          </Link>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DailyTip />
        </Grid>

        {/* Son 7 günlük aktiviteler ve Son Hedef */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
              Son 7 Gün Özeti
            </Typography>

            {/* Son Hedef */}
            {lastGoal && (
              <Box sx={{ mb: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Son Eklenen Hedef
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1">
                    {lastGoal.title}
                  </Typography>
                  <Chip
                    label={getPriorityText(lastGoal.priority)}
                    color={getPriorityColor(lastGoal.priority)}
                    size="small"
                    icon={<PriorityIcon />}
                  />
                </Box>
              </Box>
            )}

            {/* Aktiviteler Listesi */}
            <Grid container spacing={2}>
              {activities.map((activity) => {
                const goal = goals.find(g => g.id === activity.goalId);
                return (
                  <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: activity.isCompleted ? '2px solid #4caf50' : 'none',
                      backgroundColor: activity.isCompleted ? 'rgba(76, 175, 80, 0.05)' : 'white',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {new Date(activity.activityDate).toLocaleDateString('tr-TR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                          <Chip
                            label={activity.isCompleted ? 'Tamamlandı' : 'Devam Ediyor'}
                            color={activity.isCompleted ? 'success' : 'warning'}
                            size="small"
                            sx={{ 
                              width: 'fit-content',
                              fontWeight: 500,
                              ml: 1
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Hedef:</strong> {goal?.title || 'Bilinmiyor'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Süre:</strong> {activity.duration} dakika
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Hedefler - Yeni Tasarım */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2', pl: 1 }}>
            Hedeflerim
          </Typography>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {goals.map((goal) => (
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
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: '#2c3e50',
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
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                        mb: 3
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
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DatePicker
                          label="Tarih"
                          value={selectedDate}
                          onChange={setSelectedDate}
                        />
                        <TimePicker
                          label="Saat"
                          value={selectedTime}
                          onChange={setSelectedTime}
                        />
                        <TextField
                          label="Süre (dakika)"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={completedGoals[goal.id] || false}
                              onChange={(e) => setCompletedGoals(prev => ({
                                ...prev,
                                [goal.id]: e.target.checked
                              }))}
                            />
                          }
                          label="Tamamlandı"
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleActivitySubmit(goal.id)}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: '#4caf50',
                            '&:hover': {
                              backgroundColor: '#388e3c'
                            }
                          }}
                        >
                          Kaydet
                        </Button>
                      </Box>
                    </LocalizationProvider>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Not ekleme formu */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Not Ekle
            </Typography>
            <Box component="form" onSubmit={handleNoteSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Açıklama"
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ bgcolor: '#fff' }}
              />
              <input
                accept="image/*"
                type="file"
                onChange={(e) => e.target.files && setImage(e.target.files[0])}
                style={{ display: 'none' }}
                id="image-input"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <label htmlFor="image-input" style={{ flex: 1 }}>
                  <Button variant="outlined" component="span" fullWidth sx={{ borderRadius: 2 }}>
                    Görsel Yükle
                  </Button>
                </label>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    borderRadius: 2,
                    flex: 1,
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    }
                  }}
                >
                  Not Ekle
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Günlük öneri */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Günün Önerisi
              </Typography>
              <Typography variant="body1" sx={{ color: '#2c3e50' }}>
                {tip || 'Yükleniyor...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Hata ve başarı mesajları */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StatusTab; 