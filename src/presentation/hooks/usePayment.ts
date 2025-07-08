import { useState } from 'react';
import { apiService } from '../../infrastructure/services/apiService';

export interface PaymentOptions {
  amount?: number;
  currency?: string;
  description?: string;
  installments?: number;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const createPreference = async (options: PaymentOptions = {}) => {
    setIsLoading(true);
    setError(null);
    setPreferenceId(null);
    try {
      const response = await apiService.post<{
        status: string;
        data: {
          preference_id: string;
        };
      }>('/external/payments/mercadopago/create-preference', {
        amount: options.amount || 1000,
        currency: options.currency || 'ARS',
        description: options.description || 'Pago de Facturadores',
        installments: options.installments || 1,
      });
      setPreferenceId(response.data.preference_id);
      return response.data.preference_id; // Return the preference ID
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear preferencia de pago';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    preferenceId,
    createPreference,
  };
};
