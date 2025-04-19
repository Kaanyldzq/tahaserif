/*
 * Tarihe Göre Filtreleme (Kaan Yıldız)
 *
 * Tatilim uygulamasında otel arama sonuçlarını tarih aralığına göre filtreleme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Collapse,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, isAfter, isBefore, isEqual, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InfoIcon from '@mui/icons-material/Info';

// Tarihe göre filtreleme bileşeni
const TariheGoreFiltreleme = ({ accommodations, onFilterChange }) => {
  // State tanımlamaları
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [error, setError] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);

  // Tarih filtrelerindeki değişiklikleri izle
  useEffect(() => {
    // Tarih formatını kontrol et
    if (startDate && endDate && isAfter(startDate, endDate)) {
      setError('Giriş tarihi, çıkış tarihinden sonra olamaz');
      return;
    } else {
      setError('');
    }

    // Filtre uygulanmış mı kontrol et
    const isFilterActive = startDate !== null && endDate !== null;
    setFilterApplied(isFilterActive);

    // Eğer her iki tarih de seçilmişse filtreyi uygula
    if (isFilterActive) {
      applyDateFilter();
    } else if (selectedRanges.length === 0 && !isFilterActive) {
      // Hiç filtre yoksa tüm sonuçları göster
      onFilterChange([...accommodations]);
    }
  }, [startDate, endDate, flexibleDates]);

  // Tarihe göre filtreleme fonksiyonu
  const applyDateFilter = () => {
    if (!startDate || !endDate) return;

    // Seçilen tarih aralığını hesapla
    const nightCount = differenceInDays(endDate, startDate);
    
    // Tarih aralığı ekle
    const newDateRange = {
      start: format(startDate, 'dd MMM yyyy', { locale: tr }),
      end: format(endDate, 'dd MMM yyyy', { locale: tr }),
      nights: nightCount
    };

    // Eğer aynı tarih aralığı daha önce eklenmemişse ekle
    const rangeExists = selectedRanges.some(
      range => range.start === newDateRange.start && range.end === newDateRange.end
    );

    if (!rangeExists) {
      setSelectedRanges([newDateRange]);
    }

    // Konaklama yerlerini filtrele
    filterAccommodations();
  };

  // Konaklama yerlerini tarihe göre filtreleme
  const filterAccommodations = () => {
    if (!startDate || !endDate) {
      onFilterChange([...accommodations]);
      return;
    }

    // Esnek tarihler seçeneği açıksa, tarihten ±3 gün tolerans ekle
    const flexDays = flexibleDates ? 3 : 0;
    const earliestCheckIn = flexibleDates ? addDays(startDate, -flexDays) : startDate;
    const latestCheckIn = flexibleDates ? addDays(startDate, flexDays) : startDate;
    const earliestCheckOut = flexibleDates ? addDays(endDate, -flexDays) : endDate;
    const latestCheckOut = flexibleDates ? addDays(endDate, flexDays) : endDate;

    // Belirtilen tarih aralığında uygun olan konaklama yerlerini filtreleme
    const filteredResults = accommodations.filter(accommodation => {
      // Bu örnekte, konaklama yerlerinin her birinin availableDates özelliği olduğunu varsayıyoruz
      // Bu özellik, konaklama yerinin müsait olduğu tarih aralıklarını içerir
      
      // Not: Bu örnek, her konaklama yerinin bir availableDates dizisi içerdiğini varsayar
      // Gerçek uygulamada, bu veri yapısı projenize göre değişebilir
      if (!accommodation.availableDates || accommodation.availableDates.length === 0) {
        return false;
      }

      // Konaklama yerinin belirtilen tarih aralığında müsait olup olmadığını kontrol et
      for (const dateRange of accommodation.availableDates) {
        const availableStart = new Date(dateRange.start);
        const availableEnd = new Date(dateRange.end);

        // Esnek tarihlerle kontrol et
        const isStartDateValid = flexibleDates
          ? (isAfter(availableStart, earliestCheckIn) || isEqual(availableStart, earliestCheckIn)) && 
            (isBefore(availableStart, latestCheckIn) || isEqual(availableStart, latestCheckIn))
          : (isAfter(availableStart, startDate) || isEqual(availableStart, startDate)) && 
            (isBefore(availableStart, endDate) || isEqual(availableStart, endDate));

        const isEndDateValid = flexibleDates
          ? (isAfter(availableEnd, earliestCheckOut) || isEqual(availableEnd, earliestCheckOut)) && 
            (isBefore(availableEnd, latestCheckOut) || isEqual(availableEnd, latestCheckOut))
          : (isAfter(availableEnd, startDate) || isEqual(availableEnd, startDate)) && 
            (isBefore(availableEnd, endDate) || isEqual(availableEnd, endDate));

        if (isStartDateValid && isEndDateValid) {
          return true;
        }
      }

      return false;
    });

    // Filtrelenmiş sonuçları ana bileşene ilet
    onFilterChange(filteredResults);
  };

  // Filtre etiketini kaldırma fonksiyonu
  const handleRemoveRange = (index) => {
    const newRanges = [...selectedRanges];
    newRanges.splice(index, 1);
    setSelectedRanges(newRanges);

    // Eğer hiç filtre kalmadıysa, tüm sonuçları göster
    if (newRanges.length === 0) {
      setStartDate(null);
      setEndDate(null);
      onFilterChange([...accommodations]);
    }
  };

  // Tüm filtreleri temizleme fonksiyonu
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedRanges([]);
    setFlexibleDates(false);
    setError('');
    setFilterApplied(false);
    
    // Tüm konaklama yerlerini göster
    onFilterChange([...accommodations]);
  };

  // Esnek tarih seçeneğini değiştirme fonksiyonu
  const handleFlexibleDatesChange = (event) => {
    setFlexibleDates(event.target.checked);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
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
            <CalendarMonthIcon sx={{ mr: 1, color: '#3498db' }} />
            Tarihe Göre Filtrele
          </Typography>
          
          {/* Hata mesajı */}
          <Collapse in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>
          
          {/* Seçili tarih aralıkları */}
          {selectedRanges.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Seçili Tarih Aralığı:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {selectedRanges.map((range, index) => (
                  <Chip
                    key={index}
                    label={`${range.start} - ${range.end} (${range.nights} gece)`}
                    onDelete={() => handleRemoveRange(index)}
                    icon={<DateRangeIcon />}
                    size="medium"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Tarih seçim alanları */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Giriş Tarihi"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
                format="dd/MM/yyyy"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Çıkış Tarihi"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={startDate ? addDays(startDate, 1) : addDays(new Date(), 1)}
                format="dd/MM/yyyy"
              />
            </Grid>
          </Grid>
          
          {/* Esnek tarih seçeneği */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={flexibleDates}
                  onChange={handleFlexibleDatesChange}
                  color="primary"
                />
              }
              label="Esnek Tarihler (±3 gün)"
            />
            
            <Collapse in={flexibleDates}>
              <Paper sx={{ p: 2, mt: 1, bgcolor: 'info.lighter', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <InfoIcon sx={{ color: 'info.main', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Esnek tarih seçeneği, seçtiğiniz tarihlerden 3 gün önce veya sonra olan konaklama imkanlarını da görmenizi sağlar.
                  </Typography>
                </Box>
              </Paper>
            </Collapse>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Filtreleri temizleme butonu */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleClearFilters}
            startIcon={<ClearAllIcon />}
            disabled={!filterApplied && selectedRanges.length === 0}
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
    </LocalizationProvider>
  );
};

// Grid bileşeni tanımı
const Grid = ({ container, item, spacing, xs, sm, md, lg, children, sx }) => {
  // Container ise
  if (container) {
    return (
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: spacing ? -0.5 * spacing : 0,
          width: 'calc(100% + ${spacing}px)',
          ...sx
        }}
      >
        {children}
      </Box>
    );
  }
  
  // Item ise
  if (item) {
    const getWidth = (size) => {
      switch (size) {
        case 12: return '100%';
        case 6: return '50%';
        case 4: return '33.33%';
        case 3: return '25%';
        case 2: return '16.66%';
        case 1: return '8.33%';
        default: return 'auto';
      }
    };
    
    return (
      <Box 
        sx={{
          padding: spacing ? 0.5 * spacing : 1,
          flexShrink: 0,
          width: getWidth(xs),
          ...(sm && {
            '@media (min-width: 600px)': {
              width: getWidth(sm),
            },
          }),
          ...(md && {
            '@media (min-width: 900px)': {
              width: getWidth(md),
            },
          }),
          ...(lg && {
            '@media (min-width: 1200px)': {
              width: getWidth(lg),
            },
          }),
          ...sx
        }}
      >
        {children}
      </Box>
    );
  }
  
  return <Box sx={sx}>{children}</Box>;
};

export default TariheGoreFiltreleme; 