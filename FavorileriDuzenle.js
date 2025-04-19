/*
 * Favorileri Düzenleme İşlevi (Kaan Yıldız)
 * 
 * Kullanıcının favori otellerini düzenleyebilmesi için bileşen
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Chip,
  Paper,
  Divider,
  Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

// Favorileri düzenleme bileşeni
const FavorileriDuzenle = ({ userId, onFavoritesChange }) => {
  // State tanımlamaları
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [editingFavorite, setEditingFavorite] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [sortOption, setSortOption] = useState('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Form state
  const [formValues, setFormValues] = useState({
    name: '',
    location: '',
    price: 0,
    notes: ''
  });

  // Sayfa yüklendiğinde favorileri yükle
  useEffect(() => {
    loadFavorites();
  }, [userId]);

  // Filtreleri ve sıralamaları uygula
  useEffect(() => {
    applyFiltersAndSort();
  }, [favorites, sortOption, searchTerm, priceFilter, ratingFilter]);

  // Favorileri local storage'dan yükleme
  const loadFavorites = () => {
    try {
      const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
      const userFavorites = allFavorites[userId] || [];
      setFavorites(userFavorites);
      setFilteredFavorites(userFavorites);
    } catch (error) {
      console.error('Favoriler yüklenirken hata oluştu:', error);
      setFavorites([]);
      setFilteredFavorites([]);
    }
  };

  // Filtre ve sıralama uygulama
  const applyFiltersAndSort = () => {
    let result = [...favorites];

    // Arama filtrelemesi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(fav => 
        fav.name.toLowerCase().includes(searchLower) || 
        fav.location.toLowerCase().includes(searchLower)
      );
    }

    // Fiyat filtrelemesi
    result = result.filter(fav => 
      fav.price >= priceFilter[0] && fav.price <= priceFilter[1]
    );

    // Yıldız filtrelemesi
    if (ratingFilter > 0) {
      result = result.filter(fav => fav.rating >= ratingFilter);
    }

    // Sıralama uygula
    result = sortFavorites(result, sortOption);
    
    setFilteredFavorites(result);
  };

  // Favorileri sıralama
  const sortFavorites = (favs, option) => {
    switch (option) {
      case 'date-desc':
        return [...favs].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case 'date-asc':
        return [...favs].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      case 'price-asc':
        return [...favs].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...favs].sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return [...favs].sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return [...favs].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return favs;
    }
  };

  // Düzenleme diyaloğunu açma
  const handleOpenDialog = (favorite) => {
    setEditingFavorite(favorite);
    setFormValues({
      name: favorite.name,
      location: favorite.location,
      price: favorite.price,
      notes: favorite.notes || ''
    });
    setDialogOpen(true);
  };

  // Diyaloğu kapatma
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFavorite(null);
  };

  // Form değerini güncelleme
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'price' ? Number(value) : value
    });
  };

  // Favoriler güncelleme
  const handleSaveFavorite = () => {
    try {
      // Tüm favorileri al
      const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
      let userFavorites = allFavorites[userId] || [];
      
      // Düzenlenen favorinin indeksini bul
      const index = userFavorites.findIndex(fav => fav.id === editingFavorite.id);
      
      if (index !== -1) {
        // Güncellenmiş favori
        const updatedFavorite = {
          ...userFavorites[index],
          name: formValues.name,
          location: formValues.location,
          price: formValues.price,
          notes: formValues.notes,
          updatedAt: new Date().toISOString()
        };
        
        // Dizide güncelleme yap
        userFavorites[index] = updatedFavorite;
        
        // Local storage'ı güncelle
        allFavorites[userId] = userFavorites;
        localStorage.setItem('favorites', JSON.stringify(allFavorites));
        
        // State'i güncelle
        setFavorites(userFavorites);
        
        // Bildirimi göster
        setSnackbarMessage('Favori başarıyla güncellendi');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Ana bileşeni güncelle (varsa)
        if (onFavoritesChange) {
          onFavoritesChange(userFavorites);
        }
      }
      
      // Diyaloğu kapat
      handleCloseDialog();
    } catch (error) {
      console.error('Favori güncellenirken hata oluştu:', error);
      setSnackbarMessage('İşlem sırasında bir hata oluştu');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Sıralama değişimi
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Arama terimi değişimi
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fiyat filtresi değişimi
  const handlePriceFilterChange = (event, newValue) => {
    setPriceFilter(newValue);
  };

  // Yıldız filtresi değişimi
  const handleRatingFilterChange = (value) => {
    setRatingFilter(value === ratingFilter ? 0 : value);
  };

  // Filtreleri temizleme
  const clearFilters = () => {
    setSearchTerm('');
    setPriceFilter([0, 10000]);
    setRatingFilter(0);
    setSortOption('date-desc');
  };

  // Snackbar'ı kapatma
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Tarih formatını biçimlendirme
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <EditIcon sx={{ mr: 1, color: '#3f51b5' }} />
        Favorileri Düzenle
      </Typography>
      
      {/* Arama ve Filtreleme */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Otel Adı veya Konum Ara"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Sıralama</InputLabel>
              <Select
                value={sortOption}
                label="Sıralama"
                onChange={handleSortChange}
                startAdornment={<SortIcon sx={{ mr: 1, color: '#757575' }} />}
              >
                <MenuItem value="date-desc">En Yeniler Önce</MenuItem>
                <MenuItem value="date-asc">En Eskiler Önce</MenuItem>
                <MenuItem value="price-asc">Fiyat (Artan)</MenuItem>
                <MenuItem value="price-desc">Fiyat (Azalan)</MenuItem>
                <MenuItem value="rating-desc">Yıldız Sayısı</MenuItem>
                <MenuItem value="name-asc">İsme Göre (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Aktif Filtreler */}
        {(searchTerm || ratingFilter > 0 || priceFilter[0] > 0 || priceFilter[1] < 10000) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, color: '#757575' }}>
              Aktif Filtreler:
            </Typography>
            
            {searchTerm && (
              <Chip 
                label={`Arama: ${searchTerm}`}
                size="small" 
                onDelete={() => setSearchTerm('')}
              />
            )}
            
            {ratingFilter > 0 && (
              <Chip 
                label={`${ratingFilter}+ Yıldız`}
                size="small"
                icon={<StarIcon />}
                onDelete={() => setRatingFilter(0)}
              />
            )}
            
            {(priceFilter[0] > 0 || priceFilter[1] < 10000) && (
              <Chip 
                label={`${priceFilter[0]} TL - ${priceFilter[1]} TL`}
                size="small"
                onDelete={() => setPriceFilter([0, 10000])}
              />
            )}
            
            <Button 
              size="small" 
              onClick={clearFilters}
              sx={{ ml: 'auto' }}
              startIcon={<FilterListIcon />}
            >
              Filtreleri Temizle
            </Button>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Favoriler Listesi */}
      {filteredFavorites.length > 0 ? (
        <Grid container spacing={2}>
          {filteredFavorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} key={favorite.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" noWrap>
                      {favorite.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleOpenDialog(favorite)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Rating 
                      value={favorite.rating} 
                      readOnly 
                      precision={1}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {favorite.location}
                  </Typography>
                  
                  <Typography variant="body1" component="div" sx={{ mb: 1, fontWeight: 'bold', color: '#3f51b5' }}>
                    {favorite.price} TL
                  </Typography>
                  
                  {favorite.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                      Not: {favorite.notes}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    Eklenme: {formatDate(favorite.addedAt)}
                  </Typography>
                  
                  {favorite.updatedAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Son Güncelleme: {formatDate(favorite.updatedAt)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {favorites.length > 0 
              ? 'Arama kriterlerinize uygun favori bulunamadı.' 
              : 'Favori listenizde hiç otel bulunmuyor.'}
          </Typography>
          
          {favorites.length > 0 && (
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }} 
              onClick={clearFilters}
            >
              Tüm Favorileri Göster
            </Button>
          )}
        </Box>
      )}
      
      {/* Düzenleme Diyaloğu */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Favori Düzenle
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Otel Adı"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Konum"
              name="location"
              value={formValues.location}
              onChange={handleFormChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Fiyat (TL)"
              name="price"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formValues.price}
              onChange={handleFormChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Notlar"
              name="notes"
              multiline
              rows={3}
              value={formValues.notes}
              onChange={handleFormChange}
              placeholder="Bu otel hakkında notlarınız"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            startIcon={<CancelIcon />}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSaveFavorite} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Kaydet
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
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FavorileriDuzenle; 