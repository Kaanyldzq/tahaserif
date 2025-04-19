/*
 * Konaklama Fotoğrafı Düzenleme (Kaan Yıldız)
 *
 * Tatilim uygulamasında konaklama tesisi için fotoğraf düzenleme ve yönetme bileşeni
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
  TextField,
  Tooltip
} from '@mui/material';
import { 
  Edit,
  Save,
  PhotoLibrary,
  Search,
  FilterList,
  Check,
  Star,
  StarBorder,
  Info,
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

const KonaklamaFotografiDuzenleme = ({ konaklamaId = ORNEK_KONAKLAMA.id, konaklamaAd = ORNEK_KONAKLAMA.ad }) => {
  // State tanımlamaları
  const [fotograflar, setFotograflar] = useState([]);
  const [filteredFotograflar, setFilteredFotograflar] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('tumu');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Düzenleme formları için state
  const [editForm, setEditForm] = useState({
    baslik: '',
    aciklama: '',
    kategori: '',
    anaFoto: false
  });
  
  // Ana fotoğraf değiştirme kontrolü
  const [mainPhotoChangeDialog, setMainPhotoChangeDialog] = useState(false);

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
  }, [searchTerm, filterCategory, fotograflar]);

  // Fotoğraf düzenleme dialog'unu aç
  const handleEditPhoto = (photo) => {
    setSelectedPhoto(photo);
    setEditForm({
      baslik: photo.baslik,
      aciklama: photo.aciklama,
      kategori: photo.kategori,
      anaFoto: photo.anaFoto
    });
    setEditDialogOpen(true);
  };
  
  // Form alanlarını güncelle
  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'anaFoto' ? checked : value
    }));
  };
  
  // Fotoğraf düzenleme işlemini başlat
  const handleSubmitEdit = () => {
    // Ana fotoğraf değişikliği kontrolü
    if (!selectedPhoto.anaFoto && editForm.anaFoto) {
      setMainPhotoChangeDialog(true);
      return;
    }
    
    // Ana fotoğraf değişikliği yok veya ana fotoğraf işaretini kaldırıyorsa doğrudan kaydet
    savePhotoChanges();
  };
  
  // Ana fotoğraf değişikliğini onayla ve kaydet
  const confirmMainPhotoChange = () => {
    setMainPhotoChangeDialog(false);
    savePhotoChanges();
  };
  
  // Fotoğraf değişikliklerini kaydet
  const savePhotoChanges = () => {
    setLoading(true);
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      const updatedPhotos = fotograflar.map(foto => {
        // Seçili fotoğraf güncellemesi
        if (foto.id === selectedPhoto.id) {
          return {
            ...foto,
            baslik: editForm.baslik,
            aciklama: editForm.aciklama,
            kategori: editForm.kategori,
            anaFoto: editForm.anaFoto
          };
        }
        
        // Ana fotoğraf değişikliği varsa, diğer fotoğrafların ana fotoğraf özelliğini kaldır
        if (editForm.anaFoto && foto.anaFoto && foto.id !== selectedPhoto.id) {
          return {
            ...foto,
            anaFoto: false
          };
        }
        
        return foto;
      });
      
      setFotograflar(updatedPhotos);
      setEditDialogOpen(false);
      setSelectedPhoto(null);
      setLoading(false);
      
      showSnackbar('Fotoğraf başarıyla güncellendi', 'success');
    }, 1000);
  };
  
  // Ana fotoğraf değiştirme dialog'unu kapat
  const handleCloseMainPhotoDialog = () => {
    setMainPhotoChangeDialog(false);
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
        Konaklama Fotoğrafı Düzenleme
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
                <Tooltip title="Ana fotoğraf, otel listeleme sayfalarında gösterilir">
                  <Chip 
                    icon={<Star />} 
                    label="Ana Fotoğraf" 
                    variant="outlined" 
                    color="secondary"
                  />
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Bilgilendirme Kartı */}
      <Card sx={{ mb: 4, bgcolor: '#e3f2fd' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Info color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Fotoğraf Düzenleme Hakkında
              </Typography>
              <Typography variant="body2">
                • Düzenlemek istediğiniz fotoğrafın üzerindeki düzenle butonuna tıklayın.<br />
                • Fotoğrafların başlık, açıklama ve kategorilerini değiştirebilirsiniz.<br />
                • Ana fotoğraf olarak belirlemek için düzenleme ekranında işaretleyin.<br />
                • Her zaman sadece bir fotoğraf ana fotoğraf olarak işaretlenebilir.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Fotoğraf Listesi */}
      <Card sx={{ mb: 4 }}>
        <CardContent>          
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
                    border: '1px solid #e0e0e0',
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
                      objectFit: 'cover'
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
                        onClick={() => handleEditPhoto(foto)}
                        title="Düzenle"
                      >
                        <Edit />
                      </IconButton>
                    }
                  />
                  
                  {foto.anaFoto && (
                    <Chip
                      icon={<Star />}
                      label="Ana Fotoğraf"
                      size="small"
                      color="secondary"
                      sx={{ 
                        position: 'absolute', 
                        top: 4, 
                        left: 4, 
                        bgcolor: 'rgba(156, 39, 176, 0.9)' 
                      }}
                    />
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>
      </Card>
      
      {/* Düzenleme Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !loading && setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Fotoğraf Düzenle</DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.baslik}
                    style={{ width: '100%', borderRadius: 8, maxHeight: '300px', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Dosya adı: {selectedPhoto.dosyaAdi}<br />
                  Yükleme tarihi: {formatDate(selectedPhoto.yuklemeTarihi)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fotoğraf Başlığı"
                  name="baslik"
                  value={editForm.baslik}
                  onChange={handleFormChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Açıklama"
                  name="aciklama"
                  value={editForm.aciklama}
                  onChange={handleFormChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={3}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    name="kategori"
                    value={editForm.kategori}
                    onChange={handleFormChange}
                    label="Kategori"
                  >
                    {FOTO_KATEGORILERI.filter(kat => kat.id !== 'tumu').map((kategori) => (
                      <MenuItem key={kategori.id} value={kategori.id}>{kategori.ad}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={editForm.anaFoto} 
                      onChange={handleFormChange}
                      name="anaFoto"
                    />
                  } 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">Ana Fotoğraf Olarak İşaretle</Typography>
                      <Tooltip title="Ana fotoğraf, otel listeleme sayfalarında gösterilir. Her tesise ait sadece bir ana fotoğraf olabilir.">
                        <Info color="action" fontSize="small" sx={{ ml: 1 }} />
                      </Tooltip>
                    </Box>
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            disabled={loading}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Ana Fotoğraf Değiştirme Dialog */}
      <Dialog
        open={mainPhotoChangeDialog}
        onClose={handleCloseMainPhotoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ana Fotoğraf Değişikliği</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu fotoğrafı ana fotoğraf olarak işaretliyorsunuz. Bu işlem, mevcut ana fotoğrafın işaretini kaldıracak ve bu fotoğrafı ana fotoğraf yapacaktır.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="primary.dark">
              Ana fotoğraf, tesisimizin vitrin görseli olarak kullanılır ve tüm listeleme sayfalarında gösterilir.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMainPhotoDialog}>
            İptal
          </Button>
          <Button 
            onClick={confirmMainPhotoChange} 
            color="primary" 
            variant="contained"
          >
            Onaylıyorum
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

export default KonaklamaFotografiDuzenleme; 