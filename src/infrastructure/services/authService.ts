import { apiService } from './apiService';
import type { User } from '../../application/stores/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw new Error('Error en el inicio de sesión');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiamos el estado local
      console.warn('Error en logout del servidor:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/auth/me');
      return response;
    } catch (error) {
      throw new Error('Error al obtener información del usuario');
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await apiService.post<{ token: string }>('/auth/refresh');
      return response;
    } catch (error) {
      throw new Error('Error al renovar el token');
    }
  }
}

export const authService = new AuthService(); 