import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  Fade,
  Chip,
} from '@mui/material';
import {
  Lock,
  Payment,
  Settings,
} from '@mui/icons-material';
import AppBarCustom from '../components/AppBarCustom';
import ChangePasswordForm from '../components/ChangePasswordForm';
import PaymentSection from '../components/PaymentSection';
import { useAuthStore } from '../../application/stores/authStore';

type ActiveSection = 'none' | 'password' | 'payment';

const ConfigPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<ActiveSection>('none');

  const isLocalProvider = user?.provider === 'local';
  const canChangePassword = isLocalProvider;

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(activeSection === section ? 'none' : section);
  };

  const handlePasswordSuccess = () => {
    // Opcional: mostrar notificación de éxito
    console.log('Contraseña cambiada exitosamente');
  };

  const handlePaymentSuccess = () => {
    // Opcional: actualizar estado del usuario, mostrar notificación
    console.log('Pago procesado exitosamente');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      bgcolor: 'background.default',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppBarCustom title="Configuración" />
      
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          
          {/* Panel lateral con botones */}
          <Box sx={{ 
            width: { xs: '100%', md: '300px' },
            flexShrink: 0,
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings />
                  Configuración
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Gestiona tu cuenta y configuraciones
                </Typography>

                {/* Información del usuario */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información de la cuenta
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Proveedor: {' '}
                    <Chip 
                      label={user?.provider === 'local' ? 'Local' : 'Google'} 
                      size="small" 
                      color={user?.provider === 'local' ? 'primary' : 'secondary'}
                    />
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Botón Cambiar Contraseña */}
                  <Button
                    fullWidth
                    variant={activeSection === 'password' ? 'contained' : 'outlined'}
                    startIcon={<Lock />}
                    onClick={() => handleSectionChange('password')}
                    disabled={!canChangePassword}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                    }}
                  >
                    Cambiar Contraseña
                  </Button>

                  {!canChangePassword && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: -1, px: 1 }}>
                      Solo disponible para cuentas locales
                    </Typography>
                  )}

                  {/* Botón Pagar Facturadores */}
                  <Button
                    fullWidth
                    variant={activeSection === 'payment' ? 'contained' : 'outlined'}
                    startIcon={<Payment />}
                    onClick={() => handleSectionChange('payment')}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                    }}
                  >
                    Pagar Facturadores
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Panel principal de contenido */}
          <Box sx={{ flex: 1, minHeight: '400px' }}>
            {activeSection === 'none' && (
              <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Settings sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Selecciona una opción
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Elige una de las opciones del panel lateral para comenzar
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Fade in={activeSection === 'password'} timeout={300}>
              <Box sx={{ display: activeSection === 'password' ? 'block' : 'none' }}>
                <ChangePasswordForm 
                  onSuccess={handlePasswordSuccess}
                  onError={(error) => console.error('Error:', error)}
                />
              </Box>
            </Fade>

            <Fade in={activeSection === 'payment'} timeout={300}>
              <Box sx={{ display: activeSection === 'payment' ? 'block' : 'none' }}>
                <PaymentSection 
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(error) => console.error('Error:', error)}
                />
              </Box>
            </Fade>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ConfigPage; 