import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Container,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../application/stores/authStore';
import { useThemeStore } from '../../application/stores/themeStore';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, isLoading } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login success:', tokenResponse);
        
        // Obtener información del usuario
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }
        
        const userInfo = await userInfoResponse.json();
        
        console.log('User info:', userInfo);
        
        // Enviar al backend
        await login(userInfo.email, '', tokenResponse.access_token);
        navigate('/home');
      } catch (error) {
        console.error('Error processing Google login:', error);
        setError('Error al procesar el inicio de sesión con Google');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Error al iniciar sesión con Google');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    googleLogin();
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {/* Botón de tema */}
        <Box
          sx={{
            position: 'absolute',
            top: 32,
            right: 32,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: 4,
              },
            }}
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </IconButton>
        </Box>

        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Card
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              mx: 'auto',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Logo/Título */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: 3,
                  }}
                >
                  <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Bienvenido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inicia sesión en tu cuenta
                </Typography>
              </Box>

              {/* Formulario */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {/* Botón de Google */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleGoogleLogin}
                  startIcon={<GoogleIcon />}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    color: 'text.primary',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Continuar con Google
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    o
                  </Typography>
                </Divider>

                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #ccc, #ddd)',
                    },
                  }}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                {/* Información adicional */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿No tienes cuenta?{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => navigate('/register')}
                    >
                      Regístrate aquí
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx= {{
                  pb: 2
              }}>
                © 2025 Pistech. Todos los derechos reservados.
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
  );
};

export default LoginPage;