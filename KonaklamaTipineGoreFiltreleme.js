/*
 * Konaklama Tipine Göre Filtreleme (Kaan Yıldız)
 *
 * Otel arama sonuçlarını konaklama tipine göre filtreleme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Stack
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HotelIcon from '@mui/icons-material/Hotel';
import HomeIcon from '@mui/icons-material/Home';
import VillaIcon from '@mui/icons-material/Villa';
import BusinessIcon from '@mui/icons-material/Business';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Konaklama tiplerinin tanımlanması
const KONAKLAMA_TIPLERI = [
  { id: 'hotel', label: 'Otel', icon: <HotelIcon sx={{ color: '#1976d2' }} /> },
  { id: 'apart', label: 'Apart', icon: <ApartmentIcon sx={{ color: '#388e3c' }} /> },
  { id: 'villa', label: 'Villa', icon: <VillaIcon sx={{ color: '#d32f2f' }} /> },
  { id: 'pansiyon', label: 'Pansiyon', icon: <HomeIcon sx={{ color: '#f57c00' }} /> },
  { id: 'butikOtel', label: 'Butik Otel', icon: <BusinessIcon sx={{ color: '#7b1fa2' }} /> },
];

// Konaklama tipine göre filtreleme bileşeni
const KonaklamaTipineGoreFiltreleme = ({ accommodations, onFilterChange }) => {
  // State tanımlamaları
  const [tipFiltresi, setTipFiltresi] = useState({
    hotel: false,
    apart: false,
    villa: false,
    pansiyon: false,
    butikOtel: false
  });
  const [seciliFiltreler, setSeciliFiltreler] = useState([]);

  // Konaklama tipi filtresini değiştirme fonksiyonu
  const handleTipFiltreDegisimi = (tip) => {
    const yeniTipFiltresi = {
      ...tipFiltresi,
      [tip]: !tipFiltresi[tip]
    };
    setTipFiltresi(yeniTipFiltresi);
  };

  // Filtre değişimlerini izle ve filtreleri uygula
  useEffect(() => {
    filtreleriUygula();
  }, [tipFiltresi]);

  // Filtreleri uygulama fonksiyonu
  const filtreleriUygula = () => {
    // Seçili konaklama tipleri
    const seciliTipler = Object.keys(tipFiltresi).filter(tip => tipFiltresi[tip]);
    
    // Seçili filtre adlarını güncelle
    const yeniSeciliFiltreler = [];
    if (seciliTipler.length > 0) {
      const tipLabelleri = seciliTipler.map(tip => {
        const bulunanTip = KONAKLAMA_TIPLERI.find(t => t.id === tip);
        return bulunanTip ? bulunanTip.label : tip;
      });
      yeniSeciliFiltreler.push(`${tipLabelleri.join(', ')}`);
    }
    setSeciliFiltreler(yeniSeciliFiltreler);

    // Filtreleme işlemi
    let sonuc = [...accommodations];
    
    // Konaklama tipi filtresini uygula
    if (seciliTipler.length > 0) {
      sonuc = sonuc.filter(accommodation => seciliTipler.includes(accommodation.type));
    }
    
    // Filtrelenmiş sonuçları ana bileşene ilet
    onFilterChange(sonuc);
  };

  // Filtreleri sıfırlama fonksiyonu
  const filtreleriBosalt = () => {
    setTipFiltresi({
      hotel: false,
      apart: false,
      villa: false,
      pansiyon: false,
      butikOtel: false
    });
    setSeciliFiltreler([]);
    onFilterChange(accommodations); // Tüm konaklama tesislerini göster
  };

  // Filtre chip'ini kaldırma fonksiyonu
  const handleFiltreSil = (filterToRemove) => {
    // Tüm tip filtrelerini sıfırla - daha gelişmiş bir versiyonda belirli tipi kaldırma eklenebilir
    setTipFiltresi({
      hotel: false,
      apart: false,
      villa: false,
      pansiyon: false,
      butikOtel: false
    });
    setSeciliFiltreler([]);
    onFilterChange(accommodations);
  };

  return (
    <Card sx={{ 
      padding: 2, 
      marginBottom: 2, 
      borderRadius: 2, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center',
          color: '#2c3e50'
        }}>
          <FilterAltIcon sx={{ mr: 1, color: '#3498db' }} />
          Konaklama Tipine Göre Filtrele
        </Typography>
        
        {/* Seçili filtreler */}
        {seciliFiltreler.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Seçili Filtreler:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {seciliFiltreler.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter}
                  onDelete={() => handleFiltreSil(filter)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Konaklama tipi checkbox'ları */}
        <FormGroup>
          {KONAKLAMA_TIPLERI.map((tip) => (
            <FormControlLabel
              key={tip.id}
              control={
                <Checkbox
                  checked={tipFiltresi[tip.id]}
                  onChange={() => handleTipFiltreDegisimi(tip.id)}
                  size="small"
                  sx={{
                    '&.Mui-checked': {
                      color: (theme) => theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tip.icon}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {tip.label}
                  </Typography>
                </Box>
              }
              sx={{ 
                mb: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 1
                }
              }}
            />
          ))}
        </FormGroup>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Filtreleri temizleme butonu */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={filtreleriBosalt}
          startIcon={<ClearAllIcon />}
          disabled={seciliFiltreler.length === 0}
          sx={{ 
            mt: 2,
            transition: 'all 0.3s',
            '&:not(:disabled)': {
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateY(-2px)'
              }
            }
          }}
        >
          Filtreleri Temizle
        </Button>
      </CardContent>
    </Card>
  );
};

export default KonaklamaTipineGoreFiltreleme; 