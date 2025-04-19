/*
 * AuthContext.js (Kaan Yıldız)
 * 
 * React Context API kullanarak oluşturulmuş kimlik doğrulama (authentication) context'i.
 * Bu dosya, kullanıcı kimlik doğrulama durumunu yönetmek ve uygulamanın farklı 
 * bileşenleri arasında paylaşmak için kullanılır.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// Auth Context oluşturulması
const AuthContext = createContext(null);

// Auth Provider bileşeni
export const AuthProvider = ({ children }) => {
  // Kullanıcı durumu ve token'ı için state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth verilerini yüklerken hata oluştu:', err);
        setError('Oturum bilgilerinizi yüklerken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Kullanıcı giriş işlemi
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // API'ye giriş isteği gönderme (gerçek uygulamada)
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
      
      // Mock giriş işlemi (demo amaçlı)
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser = {
          id: 1,
          name: 'Test Kullanıcı',
          email: 'test@example.com',
          role: 'user'
        };
        
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        
        // User ve token'ı state'e kaydet
        setUser(mockUser);
        setToken(mockToken);
        
        // localStorage'a kaydet (oturum kalıcılığı için)
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        return { success: true, user: mockUser };
      } else {
        throw new Error('Geçersiz email veya şifre');
      }
    } catch (err) {
      setError(err.message || 'Giriş yaparken bir hata oluştu');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı çıkış işlemi
  const logout = () => {
    // State'i temizle
    setUser(null);
    setToken(null);
    
    // localStorage'dan auth verilerini sil
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  // Kullanıcı kaydı işlemi
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // API'ye kayıt isteği gönderme (gerçek uygulamada)
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Kayıt olurken bir hata oluştu');
      // }
      
      // const data = await response.json();
      
      // Mock kayıt işlemi (demo amaçlı)
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // User ve token'ı state'e kaydet
      setUser(mockUser);
      setToken(mockToken);
      
      // localStorage'a kaydet
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı bilgilerini güncelleme
  const updateUserProfile = async (updatedData) => {
    if (!user || !token) {
      setError('Oturum açık değil');
      return { success: false, error: 'Oturum açık değil' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // API'ye güncelleme isteği gönderme (gerçek uygulamada)
      // const response = await fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(updatedData),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Profil güncellenirken bir hata oluştu');
      // }
      
      // const data = await response.json();
      
      // Mock güncelleme işlemi
      const updatedUser = { ...user, ...updatedData };
      
      // State'i güncelle
      setUser(updatedUser);
      
      // localStorage'ı güncelle
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message || 'Profil güncellenirken bir hata oluştu');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama isteği gönderme
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      // API'ye şifre sıfırlama isteği gönderme (gerçek uygulamada)
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu');
      // }
      
      // Mock şifre sıfırlama işlemi
      console.log(`Şifre sıfırlama e-postası ${email} adresine gönderildi (simülasyon)`);
      
      return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi' };
    } catch (err) {
      setError(err.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının giriş yapmış olup olmadığını kontrol et
  const isAuthenticated = !!user && !!token;

  // Context değeri
  const contextValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateUserProfile,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook'u
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 