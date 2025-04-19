/*
 * Favorileri Silme İşlevi (Kaan Yıldız)
 *
 * Kullanıcının tüm favorilerini veya seçilen favorileri silme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Typography,
  Snackbar,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

// Favorileri silme bileşeni
const FavorileriSil = ({ userId, onFavoritesChange }) => {
  // State tanımlamaları
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('all'); // 'all' veya 'selected'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Sayfa yüklendiğinde favorileri yükle
  useEffect(() => {
    loadFavorites();
  }, [userId]);

  // Favorileri local storage'dan yükleme
  const loadFavorites = () => {
    try {
      const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
      const userFavorites = allFavorites[userId] || [];
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Favoriler yüklenirken hata oluştu:', error);
      setFavorites([]);
    }
  };

  // Seçili öğeleri güncelleme
  const handleToggleSelect = (favoriteId) => {
    const currentIndex = selected.indexOf(favoriteId);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(favoriteId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  // Tüm favorileri seçme/seçimi kaldırma
  const handleToggleAll = () => {
    if (selected.length === favorites.length) {
      setSelected([]);
    } else {
      setSelected(favorites.map(fav => fav.id));
    }
  };

  // Favorileri silme diyalogunu açma
  const handleOpenDialog = (mode) => {
    if (mode === 'selected' && selected.length === 0) {
      setSnackbarMessage('Lütfen silinecek favorileri seçin');
      setSnackbarOpen(true);
      return;
    }
    setDialogMode(mode);
    setDialogOpen(true);
  };

  // Diyaloğu kapatma
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Favorileri silme işlemi
  const handleDeleteFavorites = () => {
    try {
      const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
      let userFavorites = allFavorites[userId] || [];
      
      if (dialogMode === 'all') {
        // Tüm favorileri sil
        userFavorites = [];
        setSelected([]);
      } else {
        // Seçili favorileri sil
        userFavorites = userFavorites.filter(fav => !selected.includes(fav.id));
        setSelected([]);
      }
      
      // Local storage'ı güncelle
      allFavorites[userId] = userFavorites;
      localStorage.setItem('favorites', JSON.stringify(allFavorites));
      
      // State'i güncelle
      setFavorites(userFavorites);
      
      // Bildirimi göster
      setSnackbarMessage(dialogMode === 'all' ? 'Tüm favoriler silindi' : 'Seçili favoriler silindi');
      setSnackbarOpen(true);
      
      // Diyaloğu kapat
      setDialogOpen(false);
      
      // Ana bileşeni güncelle (varsa)
      if (onFavoritesChange) {
        onFavoritesChange(userFavorites);
      }
    } catch (error) {
      console.error('Favoriler silinirken hata oluştu:', error);
      setSnackbarMessage('İşlem sırasında bir hata oluştu');
      setSnackbarOpen(true);
    }
  };

  // Snackbar'ı kapatma
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <DeleteSweepIcon sx={{ mr: 1, color: '#f44336' }} />
        Favorileri Yönet
      </Typography>
      
      {favorites.length > 0 ? (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => handleOpenDialog('all')}
              startIcon={<DeleteSweepIcon />}
              sx={{ mr: 1 }}
            >
              Tümünü Sil
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => handleOpenDialog('selected')}
              startIcon={<DeleteIcon />}
              disabled={selected.length === 0}
            >
              Seçilenleri Sil ({selected.length})
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button 
              size="small" 
              onClick={handleToggleAll}
            >
              {selected.length === favorites.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {favorites.map((favorite) => {
              const isSelected = selected.indexOf(favorite.id) !== -1;
              
              return (
                <React.Fragment key={favorite.id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => handleToggleSelect(favorite.id)}
                        checked={isSelected}
                      />
                    }
                  >
                    <ListItemText
                      primary={favorite.name}
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {favorite.location} • {favorite.rating} Yıldız • {favorite.price} TL
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              );
            })}
          </List>
        </>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          Favori listenizde hiç otel bulunmuyor.
        </Typography>
      )}
      
      {/* Silme onay diyaloğu */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {dialogMode === 'all' ? 'Tüm Favorileri Sil' : 'Seçili Favorileri Sil'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMode === 'all' 
              ? 'Tüm favorileriniz silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?'
              : `Seçtiğiniz ${selected.length} favori silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            İptal
          </Button>
          <Button onClick={handleDeleteFavorites} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarMessage.includes('hata') ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FavorileriSil; 