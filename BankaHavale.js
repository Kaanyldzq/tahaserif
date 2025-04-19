/*
 * Banka Havale (Kaan Yıldız)
 *
 * Tatilim uygulamasında banka havalesi ile ödeme bileşeni
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

const bankalar = [
  {
    id: 1,
    ad: 'TATİLİM Bank',
    iban: 'TR12 3456 7890 1234 5678 9012 34',
    sube: 'Merkez Şube',
    hesapSahibi: 'Tatilim Turizm A.Ş.'
  },
  {
    id: 2,
    ad: 'Turizm Bank',
    iban: 'TR98 7654 3210 9876 5432 1098 76',
    sube: 'Tatil Şubesi',
    hesapSahibi: 'Tatilim Turizm A.Ş.'
  },
  {
    id: 3,
    ad: 'Seyahat Bank',
    iban: 'TR55 6666 7777 8888 9999 0000 11',
    sube: 'Sahil Şubesi',
    hesapSahibi: 'Tatilim Turizm A.Ş.'
  }
];

const BankaHavale = ({ rezervasyonTutari, rezervasyonNo }) => {
  const [selectedBank, setSelectedBank] = useState(1);
  const [transferInfo, setTransferInfo] = useState({
    gonderenAdSoyad: '',
    gonderenIban: '',
    aciklama: `Rezervasyon No: ${rezervasyonNo || 'RES-123456'}`,
    tutar: rezervasyonTutari || 1250.00
  });
  const [transferCompleted, setTransferCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Seçilen banka değiştiğinde
  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
  };

  // Form alanları değiştiğinde
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransferInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // IBAN kopyalama
  const handleCopyIban = () => {
    const selectedBankInfo = bankalar.find(banka => banka.id === selectedBank);
    navigator.clipboard.writeText(selectedBankInfo.iban);
    setSnackbarMessage('IBAN kopyalandı!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  // Havale bilgilerini onayla
  const handleConfirmTransfer = () => {
    if (!transferInfo.gonderenAdSoyad.trim()) {
      setSnackbarMessage('Lütfen adınızı ve soyadınızı girin.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    setDialogOpen(true);
  };
  
  // Havale bildirimini gönder
  const handleSubmitTransfer = () => {
    setDialogOpen(false);
    setLoading(true);
    
    // Havale bildirimi gönderme simülasyonu
    setTimeout(() => {
      setLoading(false);
      setTransferCompleted(true);
      setSnackbarMessage('Havale bildirimi başarıyla kaydedildi!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 2000);
  };
  
  // Yeni havale bildirimi
  const handleNewTransfer = () => {
    setTransferCompleted(false);
    setTransferInfo({
      gonderenAdSoyad: '',
      gonderenIban: '',
      aciklama: `Rezervasyon No: ${rezervasyonNo || 'RES-123456'}`,
      tutar: rezervasyonTutari || 1250.00
    });
  };

  // Seçilen bankanın bilgilerini al
  const selectedBankInfo = bankalar.find(banka => banka.id === selectedBank);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Banka Havalesi ile Ödeme
      </Typography>
      
      {!transferCompleted ? (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Banka Seçimi
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Banka Seçin</InputLabel>
                <Select
                  value={selectedBank}
                  onChange={handleBankChange}
                  label="Banka Seçin"
                >
                  {bankalar.map((banka) => (
                    <MenuItem key={banka.id} value={banka.id}>{banka.ad}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Paper sx={{ p: 3, bgcolor: '#f8f9fa', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    IBAN:
                  </Typography>
                  <Button 
                    startIcon={<ContentCopy />} 
                    onClick={handleCopyIban}
                    size="small"
                  >
                    Kopyala
                  </Button>
                </Box>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                  {selectedBankInfo.iban}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Banka: {selectedBankInfo.ad}
                </Typography>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Şube: {selectedBankInfo.sube}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Hesap Sahibi: {selectedBankInfo.hesapSahibi}
                </Typography>
              </Paper>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Havale Bilgileri
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="gonderenAdSoyad"
                    label="Gönderen Ad Soyad"
                    value={transferInfo.gonderenAdSoyad}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="gonderenIban"
                    label="Gönderen IBAN (İsteğe Bağlı)"
                    value={transferInfo.gonderenIban}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="aciklama"
                    label="Açıklama"
                    value={transferInfo.aciklama}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    helperText="Havale açıklamasına rezervasyon numaranızı eklemeyi unutmayın."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="tutar"
                    label="Tutar (₺)"
                    value={transferInfo.tutar}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    type="number"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleConfirmTransfer}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Havale Bildirimini Gönder'}
            </Button>
          </Box>
        </>
      ) : (
        <Card>
          <CardContent>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6">
                Havale Bildiriminiz Alındı!
              </Typography>
              <Typography variant="body1">
                Havale bildiriminiz sistemimize kaydedilmiştir. Ödemeniz kontrol edildikten sonra rezervasyonunuz onaylanacaktır.
              </Typography>
            </Alert>
            
            <Paper sx={{ p: 3, bgcolor: '#f8f9fa', mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Havale Bilgileri
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Banka:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {selectedBankInfo.ad}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Gönderen:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {transferInfo.gonderenAdSoyad}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Açıklama:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {transferInfo.aciklama}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Tutar:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" fontWeight="bold">
                    {transferInfo.tutar.toLocaleString('tr-TR')} ₺
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Not: Ödemeniz kontrol edildikten sonra size e-posta yoluyla bilgilendirme yapılacaktır. Bu süreç genellikle 1 iş günü içerisinde tamamlanmaktadır.
            </Typography>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleNewTransfer}
              >
                Yeni Havale Bildirimi
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Onay Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Havale Bildirimini Onayla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Havale bildiriminizi göndermek istediğinize emin misiniz? Bu işlem, ödemenizi manuel olarak kontrol etmemizi sağlayacaktır.
          </DialogContentText>
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
            Önemli Not:
          </Typography>
          <Typography variant="body2">
            Havale yaparken açıklama kısmına mutlaka rezervasyon numaranızı ({transferInfo.aciklama}) yazınız.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>İptal</Button>
          <Button onClick={handleSubmitTransfer} color="primary" variant="contained">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BankaHavale; 