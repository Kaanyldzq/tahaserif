/*
 * Favorilere Ekleme İşlevi (Kaan Yıldız)
 *
 * Otelleri favorilere ekleme ve favorilerden çıkarma bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Snackbar,
  Alert,
  Badge,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Favorilere ekleme bileşeni
const FavorilereEkle = ({ hotel, userId }) => {
  // State tanımlamaları
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Sayfa yüklendiğinde favorileri kontrol et
  useEffect(() => {
    checkIfFavorite();
  }, [hotel.id, userId]);

  // Local storage'dan favorileri kontrol etme
  const checkIfFavorite = () => {
    try {
      // Local storage'dan mevcut favorileri al
      const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
      // Kullanıcıya özel favoriler
      const userFavorites = favorites[userId] || [];
      
      // Bu otel favorilerde mi kontrol et
      setIsFavorite(userFavorites.some(fav => fav.id === hotel.id));
    } catch (error) {
      console.error('Favoriler kontrol edilirken hata oluştu:', error);
    }
  };

  // Favorilere ekleme/çıkarma işlemi
  const toggleFavorite = () => {
    try {
      // Local storage'dan mevcut favorileri al
      const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
      // Kullanıcıya özel favoriler
      const userFavorites = favorites[userId] || [];
      
      // Favori durumuna göre işlem yap
      if (isFavorite) {
        // Favoriyi kaldır
        const updatedFavorites = userFavorites.filter(fav => fav.id !== hotel.id);
        favorites[userId] = updatedFavorites;
        
        // State ve snackbar güncelle
        setIsFavorite(false);
        setSnackbarMessage('Otel favorilerden çıkarıldı');
        setSnackbarSeverity('info');
      } else {
        // Favorilere ekle
        const hotelToAdd = {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          price: hotel.price,
          rating: hotel.rating,
          location: hotel.location,
          addedAt: new Date().toISOString()
        };
        
        favorites[userId] = [...userFavorites, hotelToAdd];
        
        // State ve snackbar güncelle
        setIsFavorite(true);
        setSnackbarMessage('Otel favorilere eklendi');
        setSnackbarSeverity('success');
      }
      
      // Local storage'ı güncelle
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Favori işlemi sırasında hata oluştu:', error);
      setSnackbarMessage('İşlem sırasında bir hata oluştu');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Snackbar kapatma
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Tooltip title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}>
        <IconButton 
          onClick={toggleFavorite}
          color="primary"
          aria-label="add to favorites"
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#e53935' }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Tooltip>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavorilereEkle; 