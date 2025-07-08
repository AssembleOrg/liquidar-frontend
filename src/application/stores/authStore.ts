import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../../infrastructure/services/apiService';
import type { BillItem } from '../../shared/types';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    billItems: BillItem[];
    provider: string;
    payedBillItems: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, googleToken?: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, _get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string, googleToken?: string) => {
                set({ isLoading: true });
                try {
                    let response;
                    if (googleToken) {
                        response = await apiService.post<{ status: string, data: { user: User, token: string } }>(
                            '/auth/google-login',
                            { googleToken }
                        );
                    } else {
                        response = await apiService.post<{ status: string, data: { user: User, token: string } }>('/auth/login', { email, password });
                    }

                    set({
                        user: response.data.user,
                        token: response.data.token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            },

            setUser: (user: User) => {
                set({ user });
            },

            setToken: (token: string) => {
                set({ token, isAuthenticated: true });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);