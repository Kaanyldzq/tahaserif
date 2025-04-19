/*
 * Yıldız Sayısına Göre Filtreleme (Kaan Yıldız)
 *
 * Otel arama sonuçlarını yıldız sayısına göre filtreleme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent
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

  // Yıldız filtresini değiştirme fonksiyonu
  const handleStarFilterChange = (star) => {
    const newStarFilter = {
      ...starFilter,
      [star]: !starFilter[star]
    };
    setStarFilter(newStarFilter);
  };

  // Filtre değişimlerini izle ve filtreleri uygula
  useEffect(() => {
    // Seçili yıldız filtreleri
    const selectedStars = Object.keys(starFilter).filter(star => starFilter[star]).map(Number);
    
    // Filtreleme işlemi
    let result = [...hotels];
    
    // Yıldız filtresi uygula
    if (selectedStars.length > 0) {
      result = result.filter(hotel => selectedStars.includes(hotel.rating));
    }
    
    // Filtrelenmiş sonuçları ana bileşene ilet
    onFilterChange(result);
  }, [starFilter, hotels, onFilterChange]);

  return (
    <Card sx={{ padding: 2, marginBottom: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterAltIcon sx={{ mr: 1, color: '#f5b014' }} />
          Yıldıza Göre Filtrele
        </Typography>
        
        {/* Yıldız checkbox filtreleri */}
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
      </CardContent>
    </Card>
  );
};

export default YildizFiltreleme; 