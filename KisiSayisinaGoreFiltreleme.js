/*
 * Kişi Sayısına Göre Filtreleme (Kaan Yıldız)
 *
 * Tatilim uygulamasında otel arama sonuçlarını kişi sayısına göre filtreleme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Chip,
  IconButton,
  Switch,
  Paper
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Kişi sayısına göre filtreleme bileşeni
const KisiSayisinaGoreFiltreleme = ({ accommodations, onFilterChange }) => {
  // State tanımlamaları
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [filterApplied, setFilterApplied] = useState(false);
  const [includeInfants, setIncludeInfants] = useState(false);
  const [accommodationType, setAccommodationType] = useState('all');

  // Toplam kişi sayısı (bebek hariç veya dahil)
  const totalGuests = includeInfants 
    ? adultCount + childCount + infantCount 
    : adultCount + childCount;

  // Filtre değişikliklerini izle
  useEffect(() => {
    applyFilters();
  }, [adultCount, childCount, infantCount, roomCount, includeInfants, accommodationType]);

  // Filtre uygulama fonksiyonu
  const applyFilters = () => {
    // Filtre uygulandı olarak işaretle
    setFilterApplied(true);

    // Kişi sayısına göre filtreleme
    let filteredResults = accommodations.filter(accommodation => {
      // Kişi kapasitesi kontrolü
      const hasEnoughCapacity = accommodation.maxGuests >= totalGuests;
      
      // Oda sayısı kontrolü
      const hasEnoughRooms = accommodation.roomCount >= roomCount;
      
      // Bebek uygunluğu kontrolü
      const isInfantCompatible = infantCount === 0 || accommodation.infantFriendly === true;
      
      // Konaklama tipi kontrolü
      const matchesType = accommodationType === 'all' || accommodation.type === accommodationType;
      
      return hasEnoughCapacity && hasEnoughRooms && isInfantCompatible && matchesType;
    });

    // Filtrelenmiş sonuçları ana bileşene ilet
    onFilterChange(filteredResults);
  };

  // Değer değiştirme fonksiyonları
  const handleAdultCountChange = (newValue) => {
    if (newValue >= 1 && newValue <= 10) {
      setAdultCount(newValue);
    }
  };

  const handleChildCountChange = (newValue) => {
    if (newValue >= 0 && newValue <= 6) {
      setChildCount(newValue);
    }
  };

  const handleInfantCountChange = (newValue) => {
    if (newValue >= 0 && newValue <= 3) {
      setInfantCount(newValue);
    }
  };

  const handleRoomCountChange = (newValue) => {
    if (newValue >= 1 && newValue <= 5) {
      setRoomCount(newValue);
    }
  };

  // Konaklama tipi değişikliği
  const handleAccommodationTypeChange = (event) => {
    setAccommodationType(event.target.value);
  };

  // Bebekleri dahil etme değişikliği
  const handleIncludeInfantsChange = (event) => {
    setIncludeInfants(event.target.checked);
  };

  // Tüm filtreleri temizleme fonksiyonu
  const handleClearFilters = () => {
    setAdultCount(2);
    setChildCount(0);
    setInfantCount(0);
    setRoomCount(1);
    setIncludeInfants(false);
    setAccommodationType('all');
    setFilterApplied(false);
    
    // Tüm otel listesini göster
    onFilterChange([...accommodations]);
  };

  // Sayaç bileşeni
  const CounterControl = ({ value, onChange, label, icon, minValue = 0, maxValue = 10 }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 2,
      p: 1,
      borderRadius: 1,
      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography variant="body1" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          size="small" 
          onClick={() => onChange(value - 1)}
          disabled={value <= minValue}
          aria-label={`Decrease ${label}`}
          sx={{ color: 'primary.main' }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        
        <Typography variant="body1" sx={{ width: '30px', textAlign: 'center' }}>
          {value}
        </Typography>
        
        <IconButton 
          size="small" 
          onClick={() => onChange(value + 1)}
          disabled={value >= maxValue}
          aria-label={`Increase ${label}`}
          sx={{ color: 'primary.main' }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

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
          <PeopleIcon sx={{ mr: 1, color: '#3498db' }} />
          Kişi Sayısına Göre Filtrele
        </Typography>
        
        {/* Misafir sayısı bilgisi */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`${totalGuests} Misafir, ${roomCount} Oda`}
            color="primary"
            variant="outlined"
            icon={<PeopleIcon />}
            sx={{ p: 0.5 }}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Yetişkin sayısı */}
        <CounterControl
          value={adultCount}
          onChange={handleAdultCountChange}
          label="Yetişkin"
          icon={<PersonIcon color="primary" />}
          minValue={1}
          maxValue={10}
        />
        
        {/* Çocuk sayısı */}
        <CounterControl
          value={childCount}
          onChange={handleChildCountChange}
          label="Çocuk (2-12 yaş)"
          icon={<PersonIcon fontSize="small" color="secondary" />}
          maxValue={6}
        />
        
        {/* Bebek sayısı */}
        <CounterControl
          value={infantCount}
          onChange={handleInfantCountChange}
          label="Bebek (0-2 yaş)"
          icon={<ChildCareIcon fontSize="small" color="action" />}
          maxValue={3}
        />
        
        {/* Oda sayısı */}
        <CounterControl
          value={roomCount}
          onChange={handleRoomCountChange}
          label="Oda"
          icon={<i className="material-icons" style={{ color: '#3498db', fontSize: '1.2rem' }}>meeting_room</i>}
          minValue={1}
          maxValue={5}
        />
        
        <Divider sx={{ my: 2 }} />
        
        {/* Bebekleri kişi sayısına dahil etme seçeneği */}
        <FormControlLabel
          control={
            <Switch 
              checked={includeInfants}
              onChange={handleIncludeInfantsChange}
              color="primary"
            />
          }
          label="Bebekleri kişi sayısına dahil et"
        />
        
        {/* Konaklama tipi seçimi */}
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <FormLabel component="legend">Konaklama Tipi</FormLabel>
          <RadioGroup 
            value={accommodationType} 
            onChange={handleAccommodationTypeChange}
            name="accommodationType"
          >
            <FormControlLabel value="all" control={<Radio />} label="Tümü" />
            <FormControlLabel value="hotel" control={<Radio />} label="Otel" />
            <FormControlLabel value="villa" control={<Radio />} label="Villa" />
            <FormControlLabel value="apartment" control={<Radio />} label="Apart" />
          </RadioGroup>
        </FormControl>
        
        {/* Bilgi notu */}
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <InfoIcon sx={{ color: 'info.main', mr: 1, mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Bebek sayısı, konaklama yerinin bebek dostu olmasını etkiler ancak kişi kapasitesine dahil edilmez.
            </Typography>
          </Box>
        </Paper>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Filtreleri temizleme butonu */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleClearFilters}
          startIcon={<ClearAllIcon />}
          disabled={!filterApplied}
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

export default KisiSayisinaGoreFiltreleme; 