/*
 * Rezervasyon Oluşturma (Kaan Yıldız)
 *
 * Tatilim uygulamasında otel rezervasyonu oluşturma bileşeni
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  FormLabel,
  FormGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';

// Rezervasyon oluşturma bileşeni
const RezervasyonOlusturma = ({ selectedHotel }) => {
  // Tarih ve yetişkin, çocuk sayısı için state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Misafir bilgileri için state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Ödeme bilgileri için state
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Aktif adım için state
  const [activeStep, setActiveStep] = useState(0);
  
  // Dialog ve Snackbar durumları için state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Adımlar
  const steps = ['Tarih ve Kişi Sayısı', 'Misafir Bilgileri', 'Ödeme', 'Onay'];
  
  // Tarih kontrolü
  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      setCheckOutDate(null);
    }
  }, [checkInDate, checkOutDate]);
  
  // Form doğrulama
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return checkInDate && checkOutDate && adults > 0;
      case 1:
        return (
          contactName.trim() !== '' && 
          contactEmail.trim() !== '' && 
          contactPhone.trim() !== '' &&
          acceptTerms
        );
      case 2:
        if (paymentMethod === 'creditCard') {
          return (
            cardNumber.trim() !== '' && 
            cardName.trim() !== '' && 
            expiryDate.trim() !== '' && 
            cvv.trim() !== ''
          );
        }
        return true;
      default:
        return true;
    }
  };
  
  // Sonraki adıma geç
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (activeStep === steps.length - 2) {
        setConfirmDialogOpen(true);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setSnackbarMessage('Lütfen tüm zorunlu alanları doldurun.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Önceki adıma dön
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Rezervasyon oluşturma
  const handleConfirmBooking = () => {
    setConfirmDialogOpen(false);
    
    try {
      // Bu örnekte, bir rezervasyon oluşturulduğunu simüle ediyoruz
      setTimeout(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSnackbarSeverity('success');
        setSnackbarMessage('Rezervasyonunuz başarıyla oluşturuldu!');
        setSnackbarOpen(true);
      }, 1500);
    } catch (error) {
      console.error('Rezervasyon oluşturulurken bir hata oluştu:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setSnackbarOpen(true);
    }
  };
  
  // Adım içeriğini render et
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Giriş Tarihi"
                  value={checkInDate}
                  onChange={(newValue) => setCheckInDate(newValue)}
                  disablePast
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Çıkış Tarihi"
                  value={checkOutDate}
                  onChange={(newValue) => setCheckOutDate(newValue)}
                  disablePast
                  minDate={checkInDate || new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Yetişkin Sayısı</InputLabel>
                  <Select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    label="Yetişkin Sayısı"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Çocuk Sayısı</InputLabel>
                  <Select
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    label="Çocuk Sayısı"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <MenuItem key={num} value={num}>{num}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Ad Soyad"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-posta"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                fullWidth
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Özel İstekler"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label="Rezervasyon koşullarını ve gizlilik politikasını kabul ediyorum."
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Ödeme Yöntemi</FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="creditCard"
                    control={<Radio />}
                    label="Kredi Kartı"
                  />
                  <FormControlLabel
                    value="bankTransfer"
                    control={<Radio />}
                    label="Banka Havalesi"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            {paymentMethod === 'creditCard' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Kart Üzerindeki İsim"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Kart Numarası"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Son Kullanma Tarihi (AA/YY)"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
            
            {paymentMethod === 'bankTransfer' && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Banka Bilgileri:
                  </Typography>
                  <Typography variant="body2">
                    Banka: TATİLİM Bank
                  </Typography>
                  <Typography variant="body2">
                    Şube: Merkez
                  </Typography>
                  <Typography variant="body2">
                    IBAN: TR12 3456 7890 1234 5678 9012 34
                  </Typography>
                  <Typography variant="body2" mt={2}>
                    * Havale açıklamasına adınızı ve soyadınızı yazmayı unutmayın.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6">
                Rezervasyonunuz Başarıyla Oluşturuldu!
              </Typography>
              <Typography variant="body1">
                Rezervasyon onay numaranız: <strong>RES-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </Typography>
              <Typography variant="body1">
                Rezervasyon detaylarını içeren bir e-posta {contactEmail} adresine gönderilmiştir.
              </Typography>
            </Alert>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rezervasyon Özeti
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Giriş Tarihi:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {checkInDate?.toLocaleDateString('tr-TR')}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Çıkış Tarihi:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {checkOutDate?.toLocaleDateString('tr-TR')}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Misafir Sayısı:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {adults} Yetişkin, {children} Çocuk
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    İletişim Bilgileri:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {contactName}
                  </Typography>
                  <Typography variant="body2">
                    {contactEmail}
                  </Typography>
                  <Typography variant="body2">
                    {contactPhone}
                  </Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ödeme Yöntemi:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {paymentMethod === 'creditCard' ? 'Kredi Kartı' : 'Banka Havalesi'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
      default:
        return 'Bilinmeyen Adım';
    }
  };
  
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Rezervasyon Oluştur
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Card>
        <CardContent>
          {getStepContent(activeStep)}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0 || activeStep === steps.length - 1}
              onClick={handleBack}
            >
              Geri
            </Button>
            
            {activeStep < steps.length - 1 && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
              >
                {activeStep === steps.length - 2 ? 'Rezervasyonu Tamamla' : 'İleri'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* Onay Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Rezervasyonu Onayla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Rezervasyonu tamamlamak istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmBooking} color="primary" variant="contained">
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

export default RezervasyonOlusturma; 