import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Button,
  Typography,
} from '@mui/material';

import {
  Dashboard,
  Settings,
  People,
  Assessment,
} from '@mui/icons-material';
import { useAuthStore } from '../../application/stores/authStore';
import { useNavigate } from 'react-router-dom';
import AppBarCustom from '../components/AppBarCustom';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();


  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBarCustom title="Centro de Control" />
      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Header de bienvenida */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ¡Bienvenido/a de vuelta, {user?.firstName}!
          </Typography>
        </Box>

        {/* Cards de estadísticas (ahora cards simples) */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: 'center' }}>
          <Card onClick={() => navigate('/facturadores')} sx={{ minWidth: 280, maxWidth: 320, p: 2, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4, filter: 'brightness(1.05)' } }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Facturadores
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona tus facturadores AFIP para generar facturas.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 280, maxWidth: 320, p: 2, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4, filter: 'brightness(1.05)' } }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Reportes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualiza y descarga reportes.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 280, maxWidth: 320, p: 2, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4, filter: 'brightness(1.05)' } }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Configuración
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajusta las preferencias del sistema.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 280, maxWidth: 320, p: 2, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4, filter: 'brightness(1.05)' } }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Perfil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulta y edita tu información personal.
              </Typography>
            </CardContent>
          </Card>
          <Card onClick={() => navigate('/facturama')} sx={{ minWidth: 280, maxWidth: 320, p: 2, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s', '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4, filter: 'brightness(1.05)' } }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Facturama
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accede a la integración y gestión de Facturama.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Sección de acciones rápidas */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Dashboard />}
                      sx={{ py: 2 }}
                    >
                      Dashboard
                    </Button>
                  </Box>
                  <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Assessment />}
                      sx={{ py: 2 }}
                    >
                      Reportes
                    </Button>
                  </Box>
                  <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<People />}
                      sx={{ py: 2 }}
                    >
                      Clientes
                    </Button>
                  </Box>
                  <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Settings />}
                      sx={{ py: 2 }}
                    >
                      Configuración
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actividad Reciente
                </Typography>
                <Box sx={{ space: 2 }}>
                  {[
                    { text: 'Nueva transacción procesada', time: 'Hace 5 minutos' },
                    { text: 'Cliente registrado exitosamente', time: 'Hace 1 hora' },
                    { text: 'Reporte mensual generado', time: 'Hace 2 horas' },
                  ].map((item, index) => (
                    <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? 1 : 0, borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.primary">
                        {item.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 