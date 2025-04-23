import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LostID } from '@/types';

interface LostIDState {
  lostIDs: LostID[];
  isLoading: boolean;
  error: string | null;
  fetchLostIDs: () => Promise<void>;
  reportLostID: (lostID: Omit<LostID, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  claimLostID: (id: string, ownerId: string) => Promise<void>;
  verifyLostID: (id: string) => Promise<void>;
  rewardFinder: (id: string) => Promise<void>;
}

// Mock data
const MOCK_LOST_IDS: LostID[] = [
  {
    id: '1',
    title: "National ID Card",
    description: "Found a national ID card for John Kamau near Westlands Mall",
    imageUrl: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2655,
      longitude: 36.8025,
      address: "Westlands Mall, Nairobi"
    },
    status: 'found',
    reward: 500,
    foundBy: '2',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    title: "Student ID Card",
    description: "Found a University of Nairobi student ID card for Jane Wanjiku",
    imageUrl: "https://images.unsplash.com/photo-1586769852044-692d6e3703f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2809,
      longitude: 36.8265,
      address: "University of Nairobi, Main Campus"
    },
    status: 'claimed',
    reward: 300,
    foundBy: '3',
    ownerId: '4',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    id: '3',
    title: "Driver's License",
    description: "Found a driver's license for Peter Ochieng near CBD",
    imageUrl: "https://images.unsplash.com/photo-1580831673881-3ccd6c3da5ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2864,
      longitude: 36.8172,
      address: "Kenyatta Avenue, Nairobi CBD"
    },
    status: 'verified',
    reward: 700,
    foundBy: '1',
    ownerId: '5',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
];

export const useLostIDStore = create<LostIDState>()(
  persist(
    (set, get) => ({
      lostIDs: MOCK_LOST_IDS,
      isLoading: false,
      error: null,
      fetchLostIDs: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch from an API
          // For now, we'll just use our mock data
          set({ 
            lostIDs: MOCK_LOST_IDS,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: "Failed to fetch lost IDs. Please try again.",
            isLoading: false,
          });
        }
      },
      reportLostID: async (lostID) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newLostID: LostID = {
            ...lostID,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({ 
            lostIDs: [newLostID, ...state.lostIDs],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to report lost ID. Please try again.",
            isLoading: false,
          });
        }
      },
      claimLostID: async (id, ownerId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            lostIDs: state.lostIDs.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    status: 'claimed', 
                    ownerId, 
                    updatedAt: new Date().toISOString() 
                  } 
                : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to claim lost ID. Please try again.",
            isLoading: false,
          });
        }
      },
      verifyLostID: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            lostIDs: state.lostIDs.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    status: 'verified', 
                    updatedAt: new Date().toISOString() 
                  } 
                : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to verify lost ID. Please try again.",
            isLoading: false,
          });
        }
      },
      rewardFinder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            lostIDs: state.lostIDs.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    status: 'rewarded', 
                    updatedAt: new Date().toISOString() 
                  } 
                : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to reward finder. Please try again.",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'haki-lost-id-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);