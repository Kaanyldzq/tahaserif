/*
 * Yıldız Sayısına Göre Filtreleme Bileşeni (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş, otelleri/mekanları yıldız sayısına 
 * göre filtrelemeyi sağlayan bileşen.
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
  Grid,
  Rating,
  Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HotelIcon from '@mui/icons-material/Hotel';

// CSS Stilleri
const styles = `
.filter-container {
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.filter-title {
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #333;
}

.filter-icon {
  margin-right: 8px;
  color: #f5b014;
}

.filter-divider {
  margin: 16px 0;
}

.star-checkbox-group {
  display: flex;
  flex-direction: column;
}

.star-checkbox {
  margin: 4px 0;
}

.star-label {
  display: flex;
  align-items: center;
}

.star-icon {
  color: #f5b014;
  margin-right: 4px;
}

.reset-button {
  margin-top: 16px;
}

.selected-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.filter-chip {
  background-color: #f0f7ff;
  border: 1px solid #c2e0ff;
}

.slider-container {
  padding: 0 8px;
  margin-top: 24px;
}

.rating-text {
  display: flex;
  align-items: center;
}

.hotel-grid {
  margin-top: 24px;
}

.hotel-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.hotel-rating {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.hotel-rating-value {
  margin-left: 8px;
  font-weight: 500;
}
`;

// Yıldız sayısına göre filtreleme bileşeni
const YildizFiltreleme = () => {
  // Örnek otel verileri
  const initialHotels = [
    { id: 1, name: 'Grand Hotel', rating: 5, price: 1200, image: 'https://via.placeholder.com/300x200?text=Grand+Hotel' },
    { id: 2, name: 'Seaside Resort', rating: 4, price: 850, image: 'https://via.placeholder.com/300x200?text=Seaside+Resort' },
    { id: 3, name: 'City Center Hotel', rating: 3, price: 600, image: 'https://via.placeholder.com/300x200?text=City+Center+Hotel' },
    { id: 4, name: 'Luxury Palace', rating: 5, price: 1500, image: 'https://via.placeholder.com/300x200?text=Luxury+Palace' },
    { id: 5, name: 'Mountain View', rating: 4, price: 950, image: 'https://via.placeholder.com/300x200?text=Mountain+View' },
    { id: 6, name: 'Budget Inn', rating: 2, price: 450, image: 'https://via.placeholder.com/300x200?text=Budget+Inn' },
    { id: 7, name: 'Riverside Hotel', rating: 3, price: 700, image: 'https://via.placeholder.com/300x200?text=Riverside+Hotel' },
    { id: 8, name: 'Premium Suites', rating: 5, price: 1300, image: 'https://via.placeholder.com/300x200?text=Premium+Suites' },
    { id: 9, name: 'Cozy B&B', rating: 3, price: 550, image: 'https://via.placeholder.com/300x200?text=Cozy+B&B' },
    { id: 10, name: 'Beachfront Resort', rating: 4, price: 1100, image: 'https://via.placeholder.com/300x200?text=Beachfront+Resort' },
  ];

  // State tanımlamaları
  const [hotels, setHotels] = useState(initialHotels);
  const [filteredHotels, setFilteredHotels] = useState(initialHotels);
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
    
    setFilteredHotels(result);
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
    setFilteredHotels(hotels);
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
    <Box sx={{ padding: 3 }}>
      <style>{styles}</style>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Otel Arama Sonuçları
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filtre bölümü */}
        <Grid item xs={12} md={3}>
          <Card className="filter-container">
            <CardContent>
              <Typography variant="h6" className="filter-title">
                <FilterAltIcon className="filter-icon" />
                Filtreler
              </Typography>
              
              {/* Seçili filtreler */}
              {selectedFilters.length > 0 && (
                <Box className="selected-filters">
                  {selectedFilters.map((filter, index) => (
                    <Chip
                      key={index}
                      label={filter}
                      onDelete={() => handleRemoveFilter(filter)}
                      className="filter-chip"
                      size="small"
                    />
                  ))}
                </Box>
              )}
              
              <Divider className="filter-divider" />
              
              {/* Yıldız checkbox filtreleri */}
              <Typography variant="subtitle1" gutterBottom>
                Yıldız Sayısı
              </Typography>
              
              <FormGroup className="star-checkbox-group">
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
                      <Box className="star-label">
                        {[...Array(star)].map((_, i) => (
                          <StarIcon key={i} className="star-icon" fontSize="small" />
                        ))}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {star} Yıldız
                        </Typography>
                      </Box>
                    }
                    className="star-checkbox"
                  />
                ))}
              </FormGroup>
              
              <Divider className="filter-divider" />
              
              {/* Yıldız aralığı slider */}
              <Typography variant="subtitle1" gutterBottom>
                Yıldız Aralığı
              </Typography>
              
              <Box className="slider-container">
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
                  <Typography variant="body2" className="rating-text">
                    Min: {ratingRange[0]} <StarIcon fontSize="small" sx={{ ml: 0.5, color: '#f5b014' }} />
                  </Typography>
                  <Typography variant="body2" className="rating-text">
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
                className="reset-button"
                disabled={selectedFilters.length === 0}
              >
                Filtreleri Temizle
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sonuçlar bölümü */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              {filteredHotels.length} otel bulundu
            </Typography>
          </Box>
          
          <Grid container spacing={3} className="hotel-grid">
            {filteredHotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card className="hotel-card">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {hotel.name}
                    </Typography>
                    
                    <Box className="hotel-rating">
                      <Rating
                        value={hotel.rating}
                        readOnly
                        precision={1}
                        emptyIcon={<StarIcon fontSize="inherit" />}
                      />
                      <Typography variant="body2" className="hotel-rating-value">
                        {hotel.rating}/5
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ₺{hotel.price} / gece
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {filteredHotels.length === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 4 }}>
                <HotelIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Seçilen filtrelere uygun otel bulunamadı
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Lütfen farklı filtre seçenekleri deneyin
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  sx={{ mt: 2 }}
                >
                  Filtreleri Temizle
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default YildizFiltreleme; 