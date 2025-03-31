import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography 
} from '@mui/material';

interface Goal {
  id: string;
  title: string;
  description: string;
  period: number;
  priority: number;
}

interface CreateGoalRequest {
  title: string;
  description: string;
  period: GoalPeriod;
  priority: GoalPriority;
}

enum GoalPeriod {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  ThreeMonths = 3,
  SixMonths = 4,
  Yearly = 5
}

enum GoalPriority {
  Low = 0,
  Medium = 1,
  High = 2
}

const GoalsTab = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    period: '',
    priority: ''
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError('Hedefler getirilemedi');
      }
    } catch (error) {
      console.error('Hedefler getirilirken hata oluştu:', error);
      setError('Hedefler getirilemedi');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      // Form validasyonu
      if (!newGoal.title.trim()) {
        throw new Error('Başlık alanı zorunludur');
      }
      if (!newGoal.description.trim()) {
        throw new Error('Açıklama alanı zorunludur');
      }
      if (newGoal.period === '') {
        throw new Error('Periyot seçimi zorunludur');
      }
      if (newGoal.priority === '') {
        throw new Error('Önem derecesi seçimi zorunludur');
      }
      
      const createGoalRequest: CreateGoalRequest = {
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        period: Number(newGoal.period) as GoalPeriod,
        priority: Number(newGoal.priority) as GoalPriority
      };

      console.log('Token:', token);
      console.log('Gönderilen hedef verisi:', createGoalRequest);

      const response = await fetch('http://localhost:5164/api/DentalGoal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createGoalRequest),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Sunucu yanıtı işlenemedi');
      }

      console.log('Parsed API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Hedef eklenemedi');
      }

      setSuccess('Hedef başarıyla eklendi');
      setNewGoal({
        title: '',
        description: '',
        period: '',
        priority: ''
      });
      await fetchGoals();
    } catch (error) {
      console.error('Hedef ekleme hatası:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Hedef eklenirken bir hata oluştu');
      }
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Mevcut hedefler listesi */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mevcut Hedefler
          </Typography>
          <List>
            {goals.map((goal) => (
              <ListItem key={goal.id}>
                <ListItemText
                  primary={goal.title}
                  secondary={goal.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Yeni hedef formu */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Yeni Hedef Ekle
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Başlık"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Açıklama"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Periyot</InputLabel>
                  <Select
                    value={newGoal.period}
                    onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
                  >
                    <MenuItem value={0}>Günlük</MenuItem>
                    <MenuItem value={1}>Haftalık</MenuItem>
                    <MenuItem value={2}>Aylık</MenuItem>
                    <MenuItem value={3}>3 Aylık</MenuItem>
                    <MenuItem value={4}>6 Aylık</MenuItem>
                    <MenuItem value={5}>Yıllık</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Önem Derecesi</InputLabel>
                  <Select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                  >
                    <MenuItem value={0}>Düşük</MenuItem>
                    <MenuItem value={1}>Orta</MenuItem>
                    <MenuItem value={2}>Yüksek</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={!newGoal.title || !newGoal.description || newGoal.period === '' || newGoal.priority === ''}
                >
                  Hedef Ekle
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GoalsTab; 