import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  Chip,
  Stack,
  FormControl,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  Payment,
  CreditCard,
} from '@mui/icons-material';
import { useAuthStore } from '../../application/stores/authStore';
import { usePayment } from '../hooks/usePayment';
import { Wallet } from '@mercadopago/sdk-react';

interface PaymentSectionProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const { user } = useAuthStore();
  const [installments, setInstallments] = useState<number>(1);
  const [error, setError] = useState('');
  const [showBrick, setShowBrick] = useState(false);
  
  const {
    isLoading,
    error: paymentError,
    preferenceId,
    createPreference,
  } = usePayment();

  const [isCreating, setIsCreating] = useState(false);

  const handlePayment = async () => {
    setError('');
    setIsCreating(true);
    try {
      await createPreference({
        amount: remainingItems * 2000,
        currency: 'ARS',
        description: `Pago de ${remainingItems} facturador${remainingItems > 1 ? 'es' : ''}`,
        installments: installments,
      });
      setShowBrick(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear preferencia de pago';
      setError(errorMessage);
      if (onPaymentError) onPaymentError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setShowBrick(false);
  };

  const remainingItems = user ? (user.billItems.length - user.payedBillItems) : 0;
  const totalItems = user ? user.billItems.length : 0;
  const totalAmount = remainingItems * 2000;

  if (remainingItems === 0) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Payment color="success" sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="success">
              ¡Todos tus facturadores están pagados!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tienes {totalItems} de {totalItems} facturadores activos
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Pagar Facturadores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paga por los facturadores adicionales que necesites
            </Typography>
          </Box>

          {/* Información de facturación */}
          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">Facturadores Creados:</Typography>
              <Chip label={totalItems} size="small" />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2">Facturadores pagados:</Typography>
              <Chip label={user?.payedBillItems || 0} color="success" size="small" />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2">Facturadores pendientes:</Typography>
              <Chip label={remainingItems} color="warning" size="small" />
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Total a pagar:
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ${totalAmount.toLocaleString('es-AR')} ARS
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              $2.000 ARS por facturador
            </Typography>
          </Box>

          {/* Método de pago - Solo MercadoPago */}
          <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <CreditCard color="primary" />
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                MercadoPago CheckoutBricks
              </Typography>
              <Chip label="Método de pago" size="small" color="primary" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              El pago se realiza en el sitio de forma segura con MercadoPago. Acepta tarjetas de crédito, débito y transferencias.
            </Typography>
          </Box>

          {/* Opciones de cuotas */}
          <FormControl fullWidth>
            <InputLabel>Cuotas</InputLabel>
            <Select
              value={installments}
              label="Cuotas"
              onChange={(e) => setInstallments(Number(e.target.value))}
              disabled={showBrick}
            >
              <MenuItem value={1}>1 cuota sin interés</MenuItem>
              <MenuItem value={3}>3 cuotas sin interés</MenuItem>
              <MenuItem value={6}>6 cuotas sin interés</MenuItem>
              <MenuItem value={12}>12 cuotas con interés</MenuItem>
            </Select>
          </FormControl>

          {/* Errores */}
          {(error || paymentError) && (
            <Alert severity="error">
              {error || paymentError}
            </Alert>
          )}

          {/* Botón de pago o Brick */}
          {!showBrick && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Payment />}
              onClick={handlePayment}
              disabled={isLoading || isCreating}
              fullWidth
            >
              {isLoading || isCreating
                ? <><CircularProgress size={20} sx={{ mr: 1 }} /> Procesando...</>
                : `Pagar ${installments === 1 ? 'ahora' : `en ${installments} cuotas`} - $${totalAmount.toLocaleString('es-AR')} ARS`
              }
            </Button>
          )}

          {showBrick && preferenceId && (
            <Box sx={{ mt: 2 }}>
              <Wallet initialization={{ preferenceId }} customization={{}} />
              <Button onClick={handleCancel} color="secondary" sx={{ mt: 2 }} fullWidth>
                Cancelar pago
              </Button>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Pago seguro procesado por MercadoPago CheckoutBricks. Tus datos están protegidos.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
