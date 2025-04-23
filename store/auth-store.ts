import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Mock user data for demo purposes
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  phone: '+254712345678',
  points: 120,
  createdAt: new Date().toISOString(),
  role: 'user',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, any email/password combination works
          set({ 
            user: MOCK_USER,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: "Login failed. Please check your credentials.",
            isLoading: false,
          });
        }
      },
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            ...MOCK_USER,
            name,
            email,
            points: 0,
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: "Registration failed. Please try again.",
            isLoading: false,
          });
        }
      },
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false,
        });
      },
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Profile update failed. Please try again.",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'haki-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);