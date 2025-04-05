import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { LightbulbCircle } from '@mui/icons-material';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';
import image5 from '../assets/5.jpg';
import image6 from '../assets/6.jpg';
import image7 from '../assets/7.jpg';
import image8 from '../assets/8.jpg';
import image9 from '../assets/9.jpg';
import image10 from '../assets/10.jpg';

const dentalTips = [
  {
    tip: "Dişlerinizi günde en az iki kez, 2 dakika boyunca fırçalayın.",
    image: image1
  },
  {
    tip: "Diş ipi kullanımı, diş aralarındaki plağı temizlemede fırçalamadan daha etkilidir.",
    image: image2
  },
  {
    tip: "Şekerli yiyecek ve içeceklerden sonra ağzınızı suyla çalkalayın.",
    image: image3
  },
  {
    tip: "Diş fırçanızı 3-4 ayda bir değiştirin.",
    image: image4
  },
  {
    tip: "Düzenli diş hekimi kontrollerinizi ihmal etmeyin, 6 ayda bir kontrol önerilir.",
    image: image5
  },
  {
    tip: "Yumuşak kıllı diş fırçası kullanın, sert fırçalar diş etlerinize zarar verebilir.",
    image: image6
  },
  {
    tip: "Asitli içeceklerden sonra hemen diş fırçalamayın, en az 30 dakika bekleyin.",
    image: image7
  },
  {
    tip: "Dişlerinizi dairesel hareketlerle, diş etlerinize zarar vermeden fırçalayın.",
    image: image8
  },
  {
    tip: "Diş ipi kullanırken her diş için temiz bir bölüm kullanın.",
    image: image9
  },
  {
    tip: "Ağız gargarası kullanımı, ağız bakımınızı destekler ancak fırçalamanın yerini tutmaz.",
    image: image10
  }
];

const DailyTip = () => {
  const [currentTip, setCurrentTip] = useState(dentalTips[0]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentTip(dentalTips[Math.floor(Math.random() * dentalTips.length)]);
        setShow(true);
      }, 500);
    }, 5000); // Her 10 saniyede bir değişir

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        height: '300px',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${currentTip.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
        }
      }}
    >
      <Fade in={show} timeout={800}>
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            maxWidth: '600px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <LightbulbCircle
              sx={{
                fontSize: '2.5rem',
                color: '#FFD700',
                mr: 1
              }}
            />
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              Günün Önerisi
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '500',
              lineHeight: 1.6,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {currentTip.tip}
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
};

export default DailyTip; 