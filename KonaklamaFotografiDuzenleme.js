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
  Tooltip,
  CardMedia,
  Container
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
  Warning,
  Close
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
          return { ...foto, anaFoto: false };
        }
        
        return foto;
      });
      
      setFotograflar(updatedPhotos);
      setLoading(false);
      setEditDialogOpen(false);
      showSnackbar('Fotoğraf başarıyla güncellendi');
    }, 800);
  };
  
  // Ana fotoğraf değişikliği onay diyaloğunu kapat
  const handleCloseMainPhotoDialog = () => {
    setMainPhotoChangeDialog(false);
  };
  
  // Bildirim göster
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Bildirim kapat
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Tarih formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {konaklamaAd} - Fotoğraf Düzenleme
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {ORNEK_KONAKLAMA.adres}
      </Typography>
      
      {/* Search and filter */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Fotoğraf ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">Kategori</InputLabel>
          <Select
            labelId="category-select-label"
            value={filterCategory}
            label="Kategori"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {FOTO_KATEGORILERI.map((kategori) => (
              <MenuItem key={kategori.id} value={kategori.id}>
                {kategori.ad}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Photo grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredFotograflar.length > 0 ? (
        <Grid container spacing={3}>
          {filteredFotograflar.map((foto) => (
            <Grid item xs={12} sm={6} md={4} key={foto.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${foto.url}?w=400&h=200&fit=crop&auto=format`}
                    alt={foto.baslik}
                  />
                  <IconButton
                    aria-label="düzenle"
                    onClick={() => handleEditPhoto(foto)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {foto.baslik}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {FOTO_KATEGORILERI.find(k => k.id === foto.kategori)?.ad || 'Kategorisiz'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {foto.aciklama}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">Arama kriterlerinize uygun fotoğraf bulunamadı.</Typography>
        </Box>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Fotoğraf Bilgilerini Düzenle
          <IconButton
            aria-label="kapat"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <>
              <Box sx={{ mb: 2, mt: 1 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${selectedPhoto.url}?w=600&h=200&fit=crop&auto=format`}
                  alt={selectedPhoto.baslik}
                  sx={{ borderRadius: 1, mb: 2 }}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Başlık"
                  type="text"
                  fullWidth
                  value={editForm.baslik}
                  onChange={handleFormChange}
                  required
                  error={!editForm.baslik.trim()}
                  helperText={!editForm.baslik.trim() ? 'Başlık zorunludur' : ''}
                />
                <TextField
                  margin="dense"
                  label="Açıklama"
                  type="text"
                  fullWidth
                  multiline
                  rows={3}
                  value={editForm.aciklama}
                  onChange={handleFormChange}
                />
              </Box>
              <FormControl fullWidth margin="dense">
                <InputLabel id="edit-category-label">Kategori</InputLabel>
                <Select
                  labelId="edit-category-label"
                  value={editForm.kategori}
                  label="Kategori"
                  onChange={handleFormChange}
                >
                  {FOTO_KATEGORILERI.filter(k => k.id !== 'tumu').map((kategori) => (
                    <MenuItem key={kategori.id} value={kategori.id}>
                      {kategori.ad}
                    </MenuItem>
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
                    Ana Fotoğraf
                    <Tooltip title="Bu fotoğrafı konaklama tesisinin ana fotoğrafı olarak ayarlar">
                      <Info fontSize="small" color="action" sx={{ ml: 1 }} />
                    </Tooltip>
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Yükleme Tarihi: {formatDate(selectedPhoto.yuklemeTarihi)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleSubmitEdit} 
            color="primary" 
            variant="contained"
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Ana Fotoğraf Değiştirme Onay Diyaloğu */}
      <Dialog
        open={mainPhotoChangeDialog}
        onClose={handleCloseMainPhotoDialog}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            Ana Fotoğrafı Değiştir
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu fotoğrafı ana fotoğraf olarak ayarlamak, mevcut ana fotoğrafın durumunu değiştirecektir. 
            Konaklama tesisi için gösterilen varsayılan fotoğraf bu olacaktır.
            Devam etmek istiyor musunuz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMainPhotoDialog}>İptal</Button>
          <Button 
            onClick={confirmMainPhotoChange} 
            color="primary" 
            variant="contained"
            startIcon={<Check />}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default KonaklamaFotografiDuzenleme;
