/*
 * Konaklama Fotoğrafı Ekleme (Kaan Yıldız)
 *
 * Tatilim uygulamasında konaklama tesisi için fotoğraf ekleme, düzenleme ve yönetme bileşeni
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import { 
  CloudUpload, 
  Delete, 
  Edit, 
  Star, 
  StarBorder, 
  Visibility, 
  DriveFileRenameOutline,
  AddPhotoAlternate,
  Collections
} from '@mui/icons-material';

// Örnek fotoğraf kategorileri
const FOTO_KATEGORILERI = [
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

const KonaklamaFotografiEkleme = ({ konaklamaId = ORNEK_KONAKLAMA.id, konaklamaAd = ORNEK_KONAKLAMA.ad }) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [category, setCategory] = useState('genel');
  const [fotograflar, setFotograflar] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ baslik: '', aciklama: '', kategori: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' veya 'list'

  // Örnek ön yüklü fotoğraflar - gerçek uygulamada API'dan alınacak
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
      }
    ];
    
    setFotograflar(ornekFotograflar);
  }, []);

  // Dosya seçildiğinde
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    // Dosya boyutu ve tip kontrolü
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5 MB limit
      
      if (!isValidType) {
        showSnackbar('Sadece JPEG, PNG ve WebP formatında dosyalar yükleyebilirsiniz.', 'error');
      }
      
      if (!isValidSize) {
        showSnackbar('Dosya boyutu 5 MB\'ı geçemez.', 'error');
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length === 0) return;
    
    setSelectedFiles(validFiles);
    
    // Önizleme görüntülerini oluştur
    const imageURLs = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setPreviewImages(imageURLs);
  };

  // Dosya yükleme simülasyonu
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      showSnackbar('Lütfen yüklemek için dosya seçin', 'error');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    // Yükleme ilerlemesi simülasyonu
    const totalFiles = selectedFiles.length;
    let uploadedFiles = 0;
    
    const uploadInterval = setInterval(() => {
      uploadedFiles++;
      const progress = Math.round((uploadedFiles / totalFiles) * 100);
      setUploadProgress(progress);
      
      if (uploadedFiles >= totalFiles) {
        clearInterval(uploadInterval);
        
        // Yeni fotoğrafları ekle
        const yeniFotograflar = selectedFiles.map((file, index) => ({
          id: `yeni-${Date.now()}-${index}`,
          dosyaAdi: file.name,
          url: previewImages[index].url,
          thumbnail: previewImages[index].url,
          baslik: file.name.split('.')[0],
          aciklama: '',
          kategori: category,
          anaFoto: false,
          yuklemeTarihi: new Date().toISOString()
        }));
        
        setFotograflar(prev => [...prev, ...yeniFotograflar]);
        
        // Yükleme sonrası temizlik
        setTimeout(() => {
          setUploading(false);
          setSelectedFiles([]);
          setPreviewImages([]);
          fileInputRef.current.value = '';
          showSnackbar(`${totalFiles} fotoğraf başarıyla yüklendi`, 'success');
        }, 500);
      }
    }, 500);
  };

  // Dosya seçimi iptal edildiğinde
  const handleCancelSelection = () => {
    setSelectedFiles([]);
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  // Fotoğrafı silme
  const handleDeletePhoto = (index) => {
    setCurrentPhotoIndex(index);
    setDeleteDialogOpen(true);
  };
  
  // Silme işlemini onayla
  const confirmDelete = () => {
    const updatedPhotos = [...fotograflar];
    updatedPhotos.splice(currentPhotoIndex, 1);
    setFotograflar(updatedPhotos);
    setDeleteDialogOpen(false);
    showSnackbar('Fotoğraf başarıyla silindi', 'success');
  };
  
  // Fotoğraf düzenleme
  const handleEditPhoto = (index) => {
    const photo = fotograflar[index];
    setCurrentPhotoIndex(index);
    setEditForm({
      baslik: photo.baslik,
      aciklama: photo.aciklama,
      kategori: photo.kategori
    });
    setEditDialogOpen(true);
  };
  
  // Düzenleme formunu kaydetme
  const savePhotoEdit = () => {
    const updatedPhotos = [...fotograflar];
    updatedPhotos[currentPhotoIndex] = {
      ...updatedPhotos[currentPhotoIndex],
      baslik: editForm.baslik,
      aciklama: editForm.aciklama,
      kategori: editForm.kategori
    };
    
    setFotograflar(updatedPhotos);
    setEditDialogOpen(false);
    showSnackbar('Fotoğraf bilgileri güncellendi', 'success');
  };
  
  // Form değişikliklerini izleme
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Ana fotoğrafı değiştirme
  const setMainPhoto = (index) => {
    const updatedPhotos = fotograflar.map((photo, i) => ({
      ...photo,
      anaFoto: i === index
    }));
    
    setFotograflar(updatedPhotos);
    showSnackbar('Ana fotoğraf güncellendi', 'success');
  };
  
  // Tarih formatını düzenleme
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Dosya boyutunu formatla
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Konaklama Fotoğrafı Yönetimi
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        {konaklamaAd}
      </Typography>
      
      {/* Fotoğraf Yükleme Bölümü */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
            Yeni Fotoğraf Yükle
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Fotoğraf Kategorisi</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Fotoğraf Kategorisi"
                  >
                    {FOTO_KATEGORILERI.map((kategori) => (
                      <MenuItem key={kategori.id} value={kategori.id}>{kategori.ad}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternate />}
                  fullWidth
                >
                  Fotoğraf Seç
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileSelect}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {previewImages.length > 0 && (
            <>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seçilen Dosyalar: {previewImages.length}
                </Typography>
                
                <Grid container spacing={2}>
                  {previewImages.map((image, index) => (
                    <Grid item xs={6} sm={3} md={2} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <img 
                          src={image.url} 
                          alt={`Preview ${index}`} 
                          style={{ 
                            width: '100%', 
                            height: '80px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                        <Typography variant="caption" display="block" noWrap>
                          {image.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(image.size)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleCancelSelection}
                  disabled={uploading}
                >
                  İptal
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                >
                  {uploading ? 'Yükleniyor...' : 'Fotoğrafları Yükle'}
                </Button>
              </Box>
              
              {uploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    {uploadProgress}% Tamamlandı
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Mevcut Fotoğraflar Bölümü */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              <Collections sx={{ mr: 1, verticalAlign: 'middle' }} />
              Mevcut Fotoğraflar ({fotograflar.length})
            </Typography>
            
            <Box>
              <Button 
                variant={viewMode === 'grid' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setViewMode('grid')}
                sx={{ mr: 1 }}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
            </Box>
          </Box>
          
          {fotograflar.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8f9fa' }}>
              <Typography variant="body1" color="text.secondary">
                Henüz yüklenmiş fotoğraf bulunmamaktadır.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                sx={{ mt: 2 }}
              >
                Fotoğraf Yükle
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileSelect}
                />
              </Button>
            </Paper>
          ) : viewMode === 'grid' ? (
            <ImageList cols={3} gap={16}>
              {fotograflar.map((foto, index) => (
                <ImageListItem key={foto.id}>
                  <img
                    src={foto.url}
                    alt={foto.baslik}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <ImageListItemBar
                    title={foto.baslik}
                    subtitle={
                      <span>
                        {FOTO_KATEGORILERI.find(k => k.id === foto.kategori)?.ad}
                        {foto.anaFoto && (
                          <Chip
                            label="Ana Fotoğraf"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </span>
                    }
                    actionIcon={
                      <Box>
                        <IconButton
                          sx={{ color: 'white' }}
                          onClick={() => handleEditPhoto(index)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          sx={{ color: 'white' }}
                          onClick={() => handleDeletePhoto(index)}
                        >
                          <Delete />
                        </IconButton>
                        {!foto.anaFoto && (
                          <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => setMainPhoto(index)}
                          >
                            <StarBorder />
                          </IconButton>
                        )}
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Box>
              {fotograflar.map((foto, index) => (
                <Paper 
                  key={foto.id} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: foto.anaFoto ? '#f3f8ff' : 'white',
                    border: foto.anaFoto ? '1px solid #bbdefb' : '1px solid #e0e0e0'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <img
                        src={foto.url}
                        alt={foto.baslik}
                        style={{ 
                          width: '100%', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <Typography variant="subtitle1">
                        {foto.baslik}
                        {foto.anaFoto && (
                          <Chip
                            label="Ana Fotoğraf"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                            icon={<Star fontSize="small" />}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {foto.aciklama}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={FOTO_KATEGORILERI.find(k => k.id === foto.kategori)?.ad} 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Yükleme: {formatDate(foto.yuklemeTarihi)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditPhoto(index)}
                          title="Düzenle"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeletePhoto(index)}
                          title="Sil"
                        >
                          <Delete />
                        </IconButton>
                        {!foto.anaFoto && (
                          <IconButton
                            color="warning"
                            size="small"
                            onClick={() => setMainPhoto(index)}
                            title="Ana Fotoğraf Yap"
                          >
                            <StarBorder />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Silme Onay Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Fotoğrafı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu fotoğrafı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Düzenleme Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Fotoğraf Bilgilerini Düzenle</DialogTitle>
        <DialogContent>
          {currentPhotoIndex !== null && (
            <>
              <Box sx={{ mb: 3, mt: 2, textAlign: 'center' }}>
                <img 
                  src={fotograflar[currentPhotoIndex]?.url} 
                  alt="Preview" 
                  style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} 
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="baslik"
                    label="Başlık"
                    value={editForm.baslik}
                    onChange={handleEditFormChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="aciklama"
                    label="Açıklama"
                    value={editForm.aciklama}
                    onChange={handleEditFormChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                      name="kategori"
                      value={editForm.kategori}
                      onChange={handleEditFormChange}
                      label="Kategori"
                    >
                      {FOTO_KATEGORILERI.map((kategori) => (
                        <MenuItem key={kategori.id} value={kategori.id}>{kategori.ad}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button onClick={savePhotoEdit} color="primary" variant="contained">
            Kaydet
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

export default KonaklamaFotografiEkleme; 