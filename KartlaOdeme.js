/*
 * Kartla Ödeme İşlevi (Kaan Yıldız)
 *
 * Tatilim uygulamasında kredi/banka kartı ile ödeme yapılmasını sağlayan bileşen
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Alert,
  Collapse,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Kredi kartı tipi algılama fonksiyonu
const detectCardType = (cardNumber) => {
  const visaPattern = /^4/;
  const mastercardPattern = /^5[1-5]/;
  const amexPattern = /^3[47]/;
  const discoverPattern = /^6(?:011|5)/;
  const troyPattern = /^9792/;

  if (visaPattern.test(cardNumber)) return 'visa';
  if (mastercardPattern.test(cardNumber)) return 'mastercard';
  if (amexPattern.test(cardNumber)) return 'amex';
  if (discoverPattern.test(cardNumber)) return 'discover';
  if (troyPattern.test(cardNumber)) return 'troy';
  return 'unknown';
};

// Aylar ve yıllar için seçenekler
const aylar = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString().padStart(2, '0'),
  label: (i + 1).toString().padStart(2, '0')
}));

const yillar = Array.from({ length: 11 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

// Kartla ödeme bileşeni
const KartlaOdeme = ({ totalAmount, onPaymentComplete }) => {
  // State tanımlamaları
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false,
    installment: '0'
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Kullanılabilir taksit seçenekleri
  const installmentOptions = [
    { value: '0', label: 'Tek Çekim', amount: totalAmount },
    { value: '3', label: '3 Taksit', amount: Math.ceil(totalAmount / 3) },
    { value: '6', label: '6 Taksit', amount: Math.ceil(totalAmount / 6) },
    { value: '9', label: '9 Taksit', amount: Math.ceil(totalAmount / 9) },
    { value: '12', label: '12 Taksit', amount: Math.ceil(totalAmount / 12) }
  ];

  // Form değerleri değişimi
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    // Kart numarası formatlaması
    if (name === 'cardNumber') {
      // Sadece sayıları koru
      processedValue = value.replace(/\D/g, '');
      // En fazla 16 karakter
      processedValue = processedValue.substring(0, 16);
      // 4'lü gruplar halinde formatlama (girişi sırasında)
      processedValue = processedValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }

    // CVV formatlaması
    if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    // Kart sahibi adı formatlaması
    if (name === 'cardholderName') {
      processedValue = value.toUpperCase();
    }

    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : processedValue
    });

    // Alanın doğrulamasını yap
    validateField(name, type === 'checkbox' ? checked : processedValue);
  };

  // Alan doğrulama
  const validateField = (fieldName, value) => {
    let errors = { ...formErrors };

    switch (fieldName) {
      case 'cardholderName':
        if (!value.trim()) {
          errors.cardholderName = 'Kart sahibi adı zorunludur';
        } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$/.test(value)) {
          errors.cardholderName = 'Kart sahibi adı sadece harflerden oluşmalıdır';
        } else {
          delete errors.cardholderName;
        }
        break;
      case 'cardNumber':
        const cleanCardNumber = value.replace(/\s/g, '');
        if (!cleanCardNumber) {
          errors.cardNumber = 'Kart numarası zorunludur';
        } else if (!/^\d+$/.test(cleanCardNumber)) {
          errors.cardNumber = 'Kart numarası sadece rakamlardan oluşmalıdır';
        } else if (cleanCardNumber.length < 15 || cleanCardNumber.length > 16) {
          errors.cardNumber = 'Kart numarası 15-16 haneli olmalıdır';
        } else {
          delete errors.cardNumber;
        }
        break;
      case 'expiryMonth':
      case 'expiryYear':
        const month = fieldName === 'expiryMonth' ? value : formValues.expiryMonth;
        const year = fieldName === 'expiryYear' ? value : formValues.expiryYear;
        
        if (!month || !year) {
          errors.expiry = 'Son kullanma tarihi zorunludur';
        } else {
          const currentDate = new Date();
          const selectedDate = new Date(parseInt(year), parseInt(month) - 1);
          
          if (selectedDate < currentDate) {
            errors.expiry = 'Geçersiz son kullanma tarihi';
          } else {
            delete errors.expiry;
          }
        }
        break;
      case 'cvv':
        if (!value) {
          errors.cvv = 'Güvenlik kodu zorunludur';
        } else if (!/^\d+$/.test(value)) {
          errors.cvv = 'Güvenlik kodu sadece rakamlardan oluşmalıdır';
        } else if (value.length < 3 || value.length > 4) {
          errors.cvv = 'Güvenlik kodu 3-4 haneli olmalıdır';
        } else {
          delete errors.cvv;
        }
        break;
      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form doğrulama
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Kart sahibi adı
    if (!formValues.cardholderName.trim()) {
      newErrors.cardholderName = 'Kart sahibi adı zorunludur';
      isValid = false;
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$/.test(formValues.cardholderName)) {
      newErrors.cardholderName = 'Kart sahibi adı sadece harflerden oluşmalıdır';
      isValid = false;
    }

    // Kart numarası
    const cleanCardNumber = formValues.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Kart numarası zorunludur';
      isValid = false;
    } else if (!/^\d+$/.test(cleanCardNumber)) {
      newErrors.cardNumber = 'Kart numarası sadece rakamlardan oluşmalıdır';
      isValid = false;
    } else if (cleanCardNumber.length < 15 || cleanCardNumber.length > 16) {
      newErrors.cardNumber = 'Kart numarası 15-16 haneli olmalıdır';
      isValid = false;
    }

    // Son kullanma tarihi
    if (!formValues.expiryMonth || !formValues.expiryYear) {
      newErrors.expiry = 'Son kullanma tarihi zorunludur';
      isValid = false;
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(
        parseInt(formValues.expiryYear),
        parseInt(formValues.expiryMonth) - 1
      );
      
      if (selectedDate < currentDate) {
        newErrors.expiry = 'Geçersiz son kullanma tarihi';
        isValid = false;
      }
    }

    // Güvenlik kodu
    if (!formValues.cvv) {
      newErrors.cvv = 'Güvenlik kodu zorunludur';
      isValid = false;
    } else if (!/^\d+$/.test(formValues.cvv)) {
      newErrors.cvv = 'Güvenlik kodu sadece rakamlardan oluşmalıdır';
      isValid = false;
    } else if (formValues.cvv.length < 3 || formValues.cvv.length > 4) {
      newErrors.cvv = 'Güvenlik kodu 3-4 haneli olmalıdır';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Ödeme metodunu değiştirme
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Ödeme işlemini gerçekleştirme
  const handlePayment = () => {
    if (validateForm()) {
      setLoading(true);
      setErrorMessage('');

      // Burada gerçek bir ödeme API'sine istek yapılabilir
      // Simülasyon için setTimeout kullanıyoruz
      setTimeout(() => {
        // Başarılı ödeme simülasyonu (gerçek uygulamada API yanıtına göre)
        setLoading(false);
        setPaymentSuccess(true);
        
        // Ana bileşene ödeme tamamlandı bildirimi
        if (onPaymentComplete) {
          onPaymentComplete({
            success: true,
            transactionId: `TRX${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toISOString(),
            amount: totalAmount,
            paymentMethod,
            cardNumber: formValues.cardNumber.replace(/\d(?=\d{4})/g, "*")
          });
        }
      }, 2000);
    }
  };

  // Ödeme adımlarını değiştirme
  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Kart tipi çıktısı
  const renderCardType = () => {
    const cardNumber = formValues.cardNumber.replace(/\s/g, '');
    if (!cardNumber) return null;

    const cardType = detectCardType(cardNumber);
    let color = '';
    let label = '';

    switch (cardType) {
      case 'visa':
        color = 'primary';
        label = 'Visa';
        break;
      case 'mastercard':
        color = 'error';
        label = 'Mastercard';
        break;
      case 'amex':
        color = 'info';
        label = 'American Express';
        break;
      case 'discover':
        color = 'warning';
        label = 'Discover';
        break;
      case 'troy':
        color = 'success';
        label = 'Troy';
        break;
      default:
        return null;
    }

    return (
      <Chip 
        size="small" 
        color={color} 
        label={label} 
        sx={{ ml: 1 }} 
      />
    );
  };

  // Adımların içeriği
  const steps = [
    {
      label: 'Kart Bilgileri',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CreditCardIcon sx={{ mr: 1 }} /> Kart Bilgileri
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kart Üzerindeki İsim"
                name="cardholderName"
                value={formValues.cardholderName}
                onChange={handleInputChange}
                error={!!formErrors.cardholderName}
                helperText={formErrors.cardholderName}
                placeholder="AHMET YILMAZ"
                InputProps={{
                  sx: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Kart Numarası"
                  name="cardNumber"
                  value={formValues.cardNumber}
                  onChange={handleInputChange}
                  error={!!formErrors.cardNumber}
                  helperText={formErrors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  InputProps={{
                    startAdornment: <PaymentIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
                {renderCardType()}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!formErrors.expiry}>
                <InputLabel>Ay</InputLabel>
                <Select
                  name="expiryMonth"
                  value={formValues.expiryMonth}
                  onChange={handleInputChange}
                  label="Ay"
                  startAdornment={<EventIcon sx={{ color: 'action.active', mr: 1 }} />}
                >
                  {aylar.map((ay) => (
                    <MenuItem key={ay.value} value={ay.value}>
                      {ay.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.expiry && (
                  <FormHelperText>{formErrors.expiry}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={!!formErrors.expiry}>
                <InputLabel>Yıl</InputLabel>
                <Select
                  name="expiryYear"
                  value={formValues.expiryYear}
                  onChange={handleInputChange}
                  label="Yıl"
                >
                  {yillar.map((yil) => (
                    <MenuItem key={yil.value} value={yil.value}>
                      {yil.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Güvenlik Kodu (CVV/CVC)"
                name="cvv"
                value={formValues.cvv}
                onChange={handleInputChange}
                error={!!formErrors.cvv}
                helperText={formErrors.cvv}
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Ödeme Seçenekleri',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceIcon sx={{ mr: 1 }} /> Ödeme Seçenekleri
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <FormControlLabel 
                    value="creditCard"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>Kredi Kartı</Typography>
                      </Box>
                    }
                  />
                </Paper>
                <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <FormControlLabel 
                    value="debitCard"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1, color: 'success.main' }} />
                        <Typography>Banka Kartı</Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Taksit Seçenekleri
              </Typography>
              <RadioGroup
                name="installment"
                value={formValues.installment}
                onChange={handleInputChange}
              >
                <Grid container spacing={2}>
                  {installmentOptions.map((option) => (
                    <Grid item xs={12} sm={6} key={option.value}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderColor: formValues.installment === option.value ? 'primary.main' : 'divider',
                          borderWidth: formValues.installment === option.value ? 2 : 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <FormControlLabel 
                          value={option.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1">{option.label}</Typography>
                              {option.value !== '0' && (
                                <Typography variant="body2" color="text.secondary">
                                  {option.amount} TL x {option.value} ay
                                </Typography>
                              )}
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Ödeme Onayı',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUserIcon sx={{ mr: 1 }} /> Ödeme Onayı
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {totalAmount} TL
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Ödeme Yöntemi
                </Typography>
                <Typography variant="body1">
                  {paymentMethod === 'creditCard' ? 'Kredi Kartı' : 'Banka Kartı'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Kart Numarası
                </Typography>
                <Typography variant="body1">
                  {formValues.cardNumber.replace(/\d(?=\d{4})/g, "*")}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Kart Sahibi
                </Typography>
                <Typography variant="body1">
                  {formValues.cardholderName}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Son Kullanma Tarihi
                </Typography>
                <Typography variant="body1">
                  {formValues.expiryMonth}/{formValues.expiryYear.substring(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Ödeme Planı
                </Typography>
                <Typography variant="body1">
                  {formValues.installment === '0' 
                    ? 'Tek Çekim' 
                    : `${formValues.installment} Taksit`}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Toplam Tutar
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {totalAmount} TL
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Alert 
            severity="info" 
            icon={<LockIcon />}
            sx={{ mb: 3 }}
          >
            Ödeme bilgileriniz güvenli bir şekilde işlenecektir. Kart bilgileriniz kaydedilmeyecektir.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePayment}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? 'İşlem Yapılıyor...' : 'Ödemeyi Tamamla'}
            </Button>
          </Box>
        </Box>
      )
    }
  ];

  // Başarılı ödeme ekranı
  if (paymentSuccess) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CardContent>
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 80, mb: 2 }} 
          />
          <Typography variant="h5" gutterBottom>
            Ödeme Başarıyla Tamamlandı
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Ödemeniz başarıyla gerçekleştirildi. Rezervasyon detaylarınız e-posta adresinize gönderilecektir.
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
            {totalAmount} TL
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/reservations'}
          >
            Rezervasyonlarımı Görüntüle
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Collapse in={!!errorMessage}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        </Collapse>

        {steps[activeStep].content}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Geri
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handlePayment : handleNext}
            disabled={loading}
          >
            {activeStep === steps.length - 1 ? 'Ödemeyi Tamamla' : 'Devam Et'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KartlaOdeme; 