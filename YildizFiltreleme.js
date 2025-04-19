/*
 * Yıldız Sayısına Göre Filtreleme (Kaan Yıldız)
 *
 * Otel arama sonuçlarını yıldız sayısına göre filtreleme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  Button,
  Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// Yıldızlara göre filtreleme bileşeni
const YildizFiltreleme = ({ hotels, onFilterChange }) => {
  // State tanımlamaları
  const [starFilter, setStarFilter] = useState({
    5: false,
    4: false,
    3: false,
    2: false,
    1: false
  });
  const [ratingRange, setRatingRange] = useState([1, 5]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Yıldız filtresini değiştirme fonksiyonu
  const handleStarFilterChange = (star) => {
    const newStarFilter = {
      ...starFilter,
      [star]: !starFilter[star]
    };
    setStarFilter(newStarFilter);
  };

  // Slider değeri değiştiğinde çalışacak fonksiyon
  const handleRatingRangeChange = (event, newValue) => {
    setRatingRange(newValue);
  };

  // Filtre değişimlerini izle ve filtreleri uygula
  useEffect(() => {
    applyFilters();
  }, [starFilter, ratingRange]);

  // Filtreleri uygulama fonksiyonu
  const applyFilters = () => {
    // Seçili yıldız filtreleri
    const selectedStars = Object.keys(starFilter).filter(star => starFilter[star]).map(Number);
    
    // Seçili filtre adlarını güncelle
    const newSelectedFilters = [];
    if (selectedStars.length > 0) {
      newSelectedFilters.push(`${selectedStars.length} yıldız filtresi`);
    }
    if (ratingRange[0] !== 1 || ratingRange[1] !== 5) {
      newSelectedFilters.push(`${ratingRange[0]}-${ratingRange[1]} yıldız aralığı`);
    }
    setSelectedFilters(newSelectedFilters);

    // Filtreleme işlemi
    let result = [...hotels];
    
    // Yıldız filtresi uygula
    if (selectedStars.length > 0) {
      result = result.filter(hotel => selectedStars.includes(hotel.rating));
    }
    
    // Yıldız aralığı filtresi uygula
    result = result.filter(hotel => hotel.rating >= ratingRange[0] && hotel.rating <= ratingRange[1]);
    
    // Filtrelenmiş sonuçları ana bileşene ilet
    onFilterChange(result);
  };

  // Filtreleri sıfırlama fonksiyonu
  const resetFilters = () => {
    setStarFilter({
      5: false,
      4: false,
      3: false,
      2: false,
      1: false
    });
    setRatingRange([1, 5]);
    setSelectedFilters([]);
    onFilterChange(hotels); // Tüm otelleri göster
  };

  // Filtre chip'ini kaldırma fonksiyonu
  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove.includes('yıldız filtresi')) {
      setStarFilter({
        5: false,
        4: false,
        3: false,
        2: false,
        1: false
      });
    } else if (filterToRemove.includes('yıldız aralığı')) {
      setRatingRange([1, 5]);
    }
    setSelectedFilters(selectedFilters.filter(filter => filter !== filterToRemove));
  };

  return (
    <Card sx={{ padding: 2, marginBottom: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterAltIcon sx={{ mr: 1, color: '#f5b014' }} />
          Yıldıza Göre Filtrele
        </Typography>
        
        {/* Seçili filtreler */}
        {selectedFilters.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}>
            {selectedFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                onDelete={() => handleRemoveFilter(filter)}
                size="small"
                sx={{ backgroundColor: '#f0f7ff', border: '1px solid #c2e0ff' }}
              />
            ))}
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Yıldız checkbox filtreleri */}
        <Typography variant="subtitle1" gutterBottom>
          Yıldız Sayısı
        </Typography>
        
        <FormGroup sx={{ display: 'flex', flexDirection: 'column' }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <FormControlLabel
              key={star}
              control={
                <Checkbox
                  checked={starFilter[star]}
                  onChange={() => handleStarFilterChange(star)}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[...Array(star)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#f5b014', mr: 0.5 }} fontSize="small" />
                  ))}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {star} Yıldız
                  </Typography>
                </Box>
              }
              sx={{ my: 0.5 }}
            />
          ))}
        </FormGroup>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Yıldız aralığı slider */}
        <Typography variant="subtitle1" gutterBottom>
          Yıldız Aralığı
        </Typography>
        
        <Box sx={{ px: 1, mt: 3 }}>
          <Slider
            value={ratingRange}
            onChange={handleRatingRangeChange}
            valueLabelDisplay="auto"
            min={1}
            max={5}
            step={1}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ]}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              Min: {ratingRange[0]} <StarIcon fontSize="small" sx={{ ml: 0.5, color: '#f5b014' }} />
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              Max: {ratingRange[1]} <StarIcon fontSize="small" sx={{ ml: 0.5, color: '#f5b014' }} />
            </Typography>
          </Box>
        </Box>
        
        {/* Sıfırlama butonu */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={resetFilters}
          sx={{ mt: 3 }}
          disabled={selectedFilters.length === 0}
        >
          Filtreleri Temizle
        </Button>
      </CardContent>
    </Card>
  );
};

export default YildizFiltreleme; 