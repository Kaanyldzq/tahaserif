/*
 * Giriş Yap Bileşeni (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş kullanıcı giriş bileşeni.
 * Bu bileşen, kullanıcıların uygulama/web sitesine giriş yapmalarını sağlar.
 */

import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Link,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// AuthContext örnek (gerçek projede AuthContext.js dosyanızdan import edilir)
// const AuthContext = React.createContext();

// CSS Stilleri
const styles = `
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 20px;
}

.login-paper {
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.login-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 24px;
}

.login-form {
  margin-top: 20px;
}

.login-field {
  margin-bottom: 20px;
}

.login-button {
  margin-top: 10px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
}

.social-login {
  margin-top: 20px;
  text-align: center;
}

.social-button {
  margin: 8px;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 500;
  text-transform: none;
}

.google-button {
  background-color: #fff;
  color: #757575;
  border: 1px solid #ddd;
}

.google-button:hover {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

.facebook-button {
  background-color: #3b5998;
  color: white;
}

.facebook-button:hover {
  background-color: #344e86;
}

.divider-text {
  margin: 24px 0;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.field-icon {
  color: #757575;
}

.remember-me {
  margin-top: 8px;
}

.forgot-password {
  text-align: right;
  margin-top: 8px;
}

@media (max-width: 600px) {
  .login-paper {
    padding: 30px 20px;
  }
}
`;

// Giriş yapma bileşeni
const GirisYapComponent = () => {
  const navigate = useNavigate();
  // const { login } = useContext(AuthContext);

  // Form durumları
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Hata durum yönetimi
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form validasyonu
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email değişikliğini işle
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Email doğrulaması
    if (!value) {
      setEmailError('Email adresi gerekli');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Geçerli bir email adresi girin');
    } else {
      setEmailError('');
    }
  };

  // Şifre değişikliğini işle
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Şifre doğrulaması
    if (!value) {
      setPasswordError('Şifre gerekli');
    } else if (value.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
    } else {
      setPasswordError('');
    }
  };

  // Şifre görünürlüğünü değiştir
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Hata bildirimini kapat
  const handleCloseError = () => {
    setShowError(false);
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulaması
    if (!email) {
      setEmailError('Email adresi gerekli');
      return;
    }
    if (!password) {
      setPasswordError('Şifre gerekli');
      return;
    }
    
    // Eğer validasyon hatası varsa gönderimi engelle
    if (emailError || passwordError) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Örnek API çağrısı (gerçek uygulamada)
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Giriş yaparken bir hata oluştu');
      // }
      
      // const data = await response.json();
      // login(data.token, data.user);
      
      // Demo amaçlı mock giriş
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password123') {
          // Giriş başarılı - context'e token ve kullanıcı bilgisini set et
          // login('dummy-token', { id: 1, name: 'Test User', email });
          
          // Anasayfaya yönlendir
          navigate('/dashboard');
        } else {
          // Hata mesajı göster
          setError('Geçersiz email veya şifre');
          setShowError(true);
        }
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Giriş yaparken bir hata oluştu');
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{styles}</style>
      
      <Container maxWidth="sm">
        <Paper className="login-paper" elevation={3}>
          <Typography variant="h4" className="login-title">
            Giriş Yap
          </Typography>
          
          <Typography variant="body1" className="login-subtitle">
            Hesabınıza giriş yaparak tüm özelliklere erişin
          </Typography>
          
          {/* Giriş Formu */}
          <form className="login-form" onSubmit={handleSubmit}>
            <TextField
              className="login-field"
              label="Email Adresi"
              variant="outlined"
              fullWidth
              required
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon className="field-icon" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              className="login-field"
              label="Şifre"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon className="field-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  className="remember-me"
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Beni hatırla"
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography className="forgot-password">
                  <Link href="/forgot-password" underline="hover">
                    Şifremi Unuttum
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            
            <Button
              className="login-button"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          
          <Box className="divider-text">
            <Divider>veya şununla giriş yap</Divider>
          </Box>
          
          {/* Sosyal Medya ile Giriş */}
          <Box className="social-login">
            <Button
              className="social-button google-button"
              variant="contained"
              startIcon={<GoogleIcon />}
              fullWidth
              style={{ marginBottom: '10px' }}
            >
              Google ile Giriş Yap
            </Button>
            
            <Button
              className="social-button facebook-button"
              variant="contained"
              startIcon={<FacebookIcon />}
              fullWidth
            >
              Facebook ile Giriş Yap
            </Button>
          </Box>
          
          {/* Kayıt Linkiı */}
          <Typography className="register-link" variant="body1">
            Hesabın yok mu? <Link href="/register" underline="hover">Kayıt Ol</Link>
          </Typography>
        </Paper>
      </Container>
      
      {/* Hata Mesajı */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GirisYapComponent; 