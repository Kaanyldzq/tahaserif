/*
 * Konaklama Fotoğrafı Silme (Kaan Yıldız)
 *
 * Tatilim uygulamasında konaklama tesisi için fotoğraf silme ve yönetme bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Divider,
  Paper,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { 
  Delete,
  DeleteForever,
  DeleteSweep,
  PhotoLibrary,
  Search,
  FilterList,
  Check,
  Clear,
  Warning
} from '@mui/icons-material';

// Örnek fotoğraf kategorileri
const FOTO_KATEGORILERI = [
  { id: 'tumu', ad: 'Tümü' },
  { id: 'genel', ad: 'Genel Görünüm' },
  { id: 'oda', ad: 'Odalar' },
  { id: 'banyo', ad: 'Banyolar' },
  { id: 'havuz', ad: 'Havuz' },
  { id: 'restoran', ad: 'Restoran' },
  { id: 'spa', ad: 'Spa & Wellness' },
  { id: 'plaj', ad: 'Plaj' },
  { id: 'spor', ad: 'Spor Alanları' },
  { id: 'diger', ad: 'Diğer' }
];

// Örnek konaklama tesisi
const ORNEK_KONAKLAMA = {
  id: 'hotel123',
  ad: 'Tatilim Resort & Spa',
  adres: 'Ege Mahallesi, Deniz Caddesi No:123, Muğla'
};

const KonaklamaFotografiSilme = ({ konaklamaId = ORNEK_KONAKLAMA.id, konaklamaAd = ORNEK_KONAKLAMA.ad }) => {
  // State tanımlamaları
  const [fotograflar, setFotograflar] = useState([]);
  const [filteredFotograflar, setFilteredFotograflar] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tumu');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Ana fotoğraf kontrolü
  const [hasMainPhotoWarning, setHasMainPhotoWarning] = useState(false);
  const [mainPhotoDialogOpen, setMainPhotoDialogOpen] = useState(false);

  // Örnek fotoğrafları yükleme
  useEffect(() => {
    // API'dan fotoğrafları getirme simülasyonu
    const ornekFotograflar = [
      {
        id: '1',
        dosyaAdi: 'otel-genel-gorunum.jpg',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
        baslik: 'Otel Genel Görünüm',
        aciklama: 'Otelimizin dış cepheden çekilmiş genel görünümü',
        kategori: 'genel',
        anaFoto: true,
        yuklemeTarihi: new Date(2024, 2, 15).toISOString()
      },
      {
        id: '2',
        dosyaAdi: 'havuz.jpg',
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        thumbnail: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=200',
        baslik: 'Açık Havuz',
        aciklama: 'Ana havuz ve güneşlenme alanı',
        kategori: 'havuz',
        anaFoto: false,
        yuklemeTarihi: new Date(2024, 2, 16).toISOString()
      },
      {
        id: '3',
        dosyaAdi: 'standart-oda.jpg',
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
        thumbnail: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200',
        baslik: 'Standart Oda',
        aciklama: 'Konforlu standart odalarımız',
        kategori: 'oda',
        anaFoto: false,
        yuklemeTarihi: new Date(2024, 2, 17).toISOString()
      },
      {
        id: '4',
        dosyaAdi: 'restoran.jpg',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
        baslik: 'Ana Restoran',
        aciklama: 'Lezzetli açık büfe yemekler sunan ana restoranımız',
        kategori: 'restoran',
        anaFoto: false,
        yuklemeTarihi: new Date(2024, 2, 18).toISOString()
      },
      {
        id: '5',
        dosyaAdi: 'spa.jpg',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
        thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
        baslik: 'Spa Merkezi',
        aciklama: 'Rahatlatıcı spa ve masaj hizmetleri',
        kategori: 'spa',
        anaFoto: false,
        yuklemeTarihi: new Date(2024, 2, 19).toISOString()
      },
      {
        id: '6',
        dosyaAdi: 'plaj.jpg',
        url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b',
        thumbnail: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=200',
        baslik: 'Özel Plaj',
        aciklama: 'Tesisimize ait özel plaj',
        kategori: 'plaj',
        anaFoto: false,
        yuklemeTarihi: new Date(2024, 2, 20).toISOString()
      }
    ];
    
    setFotograflar(ornekFotograflar);
    setFilteredFotograflar(ornekFotograflar);
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    let result = [...fotograflar];
    
    // Kategori filtresi
    if (filterCategory !== 'tumu') {
      result = result.filter(foto => foto.kategori === filterCategory);
    }
    
    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(foto => 
        foto.baslik.toLowerCase().includes(searchLower) || 
        foto.aciklama.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredFotograflar(result);
    
    // Seçili fotoğraflar güncellenirken, sadece hala filtrede olanları tut
    setSelectedPhotos(prev => prev.filter(id => 
      result.some(foto => foto.id === id)
    ));
    
    // Tümü seçiliyse ve filtrelenenler değiştiyse, tümünü seç durumunu güncelle
    if (selectAll) {
      const allFiltered = new Set(result.map(foto => foto.id));
      const allSelected = new Set(selectedPhotos);
      
      // Eğer tüm filtrelenenler seçili değilse, selectAll'ı false yap
      if (result.length > 0 && !result.every(foto => allSelected.has(foto.id))) {
        setSelectAll(false);
      }
    }
  }, [searchTerm, filterCategory, fotograflar]);

  // Fotoğraf seçme/seçimini kaldırma
  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.includes(photoId);
      if (isSelected) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };
  
  // Tüm fotoğrafları seçme/seçimini kaldırma
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredFotograflar.map(foto => foto.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Silme işlemi öncesi ana fotoğraf kontrolü
  const handleDeleteRequest = () => {
    // Ana fotoğraf seçili mi kontrol et
    const hasMainPhoto = selectedPhotos.some(id => 
      fotograflar.find(foto => foto.id === id)?.anaFoto
    );
    
    if (hasMainPhoto) {
      setHasMainPhotoWarning(true);
      setMainPhotoDialogOpen(true);
    } else {
      setDeleteDialogOpen(true);
    }
  };
  
  // Tümünü silmeyi onayla
  const handleDeleteAllRequest = () => {
    // Tüm fotoğraflar içinde ana fotoğraf var mı kontrol et
    const hasMainPhoto = filteredFotograflar.some(foto => foto.anaFoto);
    
    if (hasMainPhoto) {
      setHasMainPhotoWarning(true);
      setMainPhotoDialogOpen(true);
    } else {
      setDeleteAllDialogOpen(true);
    }
  };
  
  // Seçili fotoğrafları silme işlemi
  const deleteSelectedPhotos = () => {
    setLoading(true);
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      const updatedPhotos = fotograflar.filter(foto => 
        !selectedPhotos.includes(foto.id)
      );
      
      setFotograflar(updatedPhotos);
      setSelectedPhotos([]);
      setSelectAll(false);
      setDeleteDialogOpen(false);
      setLoading(false);
      
      showSnackbar(`${selectedPhotos.length} fotoğraf başarıyla silindi`, 'success');
    }, 1000);
  };
  
  // Tüm fotoğrafları silme işlemi
  const deleteAllPhotos = () => {
    setLoading(true);
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      const photoIdsToDelete = filteredFotograflar.map(foto => foto.id);
      const updatedPhotos = fotograflar.filter(foto => 
        !photoIdsToDelete.includes(foto.id)
      );
      
      setFotograflar(updatedPhotos);
      setSelectedPhotos([]);
      setSelectAll(false);
      setDeleteAllDialogOpen(false);
      setLoading(false);
      
      showSnackbar(`${filteredFotograflar.length} fotoğraf başarıyla silindi`, 'success');
    }, 1000);
  };
  
  // Ana fotoğraf uyarı dialog'unu kapat
  const handleCloseMainPhotoDialog = () => {
    setMainPhotoDialogOpen(false);
    setHasMainPhotoWarning(false);
  };
  
  // Ana fotoğraf uyarısını görmezden gel ve devam et
  const proceedWithDeletion = () => {
    setMainPhotoDialogOpen(false);
    if (selectedPhotos.length > 0) {
      setDeleteDialogOpen(true);
    } else {
      setDeleteAllDialogOpen(true);
    }
  };
  
  // Snackbar gösterme yardımcı fonksiyonu
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Snackbar kapatma
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Tarih formatını düzenleme
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Konaklama Fotoğrafı Silme
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        {konaklamaAd}
      </Typography>
      
      {/* Filtreleme ve Arama */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField 
                fullWidth
                label="Fotoğraf Ara"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Başlık veya açıklamaya göre ara"
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Kategori"
                  startAdornment={<FilterList color="action" sx={{ mr: 1 }} />}
                >
                  {FOTO_KATEGORILERI.map((kategori) => (
                    <MenuItem key={kategori.id} value={kategori.id}>{kategori.ad}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<PhotoLibrary />} 
                  label={`Toplam: ${fotograflar.length}`} 
                  variant="outlined" 
                />
                <Chip 
                  icon={<FilterList />} 
                  label={`Filtrelenmiş: ${filteredFotograflar.length}`} 
                  variant="outlined" 
                  color="primary"
                />
                {selectedPhotos.length > 0 && (
                  <Chip 
                    icon={<Check />} 
                    label={`Seçilmiş: ${selectedPhotos.length}`} 
                    variant="outlined" 
                    color="secondary"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Toplu Seçim ve Silme İşlemleri */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={filteredFotograflar.length > 0 && selectAll} 
                  onChange={toggleSelectAll}
                  disabled={filteredFotograflar.length === 0}
                />
              } 
              label="Tümünü Seç" 
            />
            <Box>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteSweep />}
                disabled={filteredFotograflar.length === 0}
                onClick={handleDeleteAllRequest}
                sx={{ mr: 1 }}
              >
                Tümünü Sil
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<Delete />}
                disabled={selectedPhotos.length === 0}
                onClick={handleDeleteRequest}
              >
                Seçilenleri Sil
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Fotoğraf Listesi */}
          {filteredFotograflar.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
              <Typography variant="body1" color="text.secondary">
                {fotograflar.length === 0 
                  ? 'Henüz yüklenmiş fotoğraf bulunmamaktadır.' 
                  : 'Arama kriterlerinize uygun fotoğraf bulunamadı.'}
              </Typography>
            </Paper>
          ) : (
            <ImageList cols={3} gap={16}>
              {filteredFotograflar.map((foto) => (
                <ImageListItem 
                  key={foto.id} 
                  sx={{ 
                    border: selectedPhotos.includes(foto.id) 
                      ? '2px solid #1976d2' 
                      : '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={foto.url}
                    alt={foto.baslik}
                    loading="lazy"
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      opacity: selectedPhotos.includes(foto.id) ? 0.8 : 1
                    }}
                    onClick={() => togglePhotoSelection(foto.id)}
                  />
                  
                  {/* Seçim Durumu */}
                  <Checkbox
                    checked={selectedPhotos.includes(foto.id)}
                    onChange={() => togglePhotoSelection(foto.id)}
                    sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4, 
                      bgcolor: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                      p: 0.5
                    }}
                  />
                  
                  <ImageListItemBar
                    title={foto.baslik}
                    subtitle={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption">
                          {FOTO_KATEGORILERI.find(k => k.id === foto.kategori)?.ad}
                        </Typography>
                        <Typography variant="caption">
                          {formatDate(foto.yuklemeTarihi)}
                        </Typography>
                      </Box>
                    }
                    actionIcon={
                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => {
                          setSelectedPhotos([foto.id]);
                          handleDeleteRequest();
                        }}
                        title="Sil"
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                  
                  {foto.anaFoto && (
                    <Chip
                      label="Ana Fotoğraf"
                      size="small"
                      color="primary"
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        left: 4, 
                        bgcolor: 'rgba(25, 118, 210, 0.9)' 
                      }}
                    />
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>
      </Card>
      
      {/* Silme Onay Dialog - Seçilenler */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Fotoğrafları Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`${selectedPhotos.length} adet fotoğrafı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={loading}
          >
            İptal
          </Button>
          <Button 
            onClick={deleteSelectedPhotos} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteForever />}
          >
            {loading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme Onay Dialog - Tümü */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tüm Fotoğrafları Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Filtrelenmiş ${filteredFotograflar.length} adet fotoğrafın tümünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2" color="warning.dark">
              Bu işlem filtreleme sonucundaki tüm fotoğrafları silecektir.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteAllDialogOpen(false)} 
            disabled={loading}
          >
            İptal
          </Button>
          <Button 
            onClick={deleteAllPhotos} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteForever />}
          >
            {loading ? 'Siliniyor...' : 'Tümünü Sil'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Ana Fotoğraf Uyarı Dialog */}
      <Dialog
        open={mainPhotoDialogOpen}
        onClose={handleCloseMainPhotoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ana Fotoğraf Uyarısı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Silmek istediğiniz fotoğraflar arasında tesise ait ana fotoğraf bulunuyor. Ana fotoğraf silindiğinde, sistemde başka bir fotoğraf ana fotoğraf olarak belirlenmelidir.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2" color="warning.dark">
              Ana fotoğraf, tesisimizin vitrin görseli olarak kullanılmaktadır. Bu silme işlemine devam etmek istediğinize emin misiniz?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMainPhotoDialog}>
            İptal
          </Button>
          <Button 
            onClick={proceedWithDeletion} 
            color="warning" 
            variant="contained"
          >
            Devam Et
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KonaklamaFotografiSilme; 