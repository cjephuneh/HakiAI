import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fundraiser } from '@/types';

interface FundraiserState {
  fundraisers: Fundraiser[];
  isLoading: boolean;
  error: string | null;
  fetchFundraisers: () => Promise<void>;
  addFundraiser: (fundraiser: Omit<Fundraiser, 'id' | 'raisedAmount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  contributeToCampaign: (id: string, amount: number) => Promise<void>;
  updateFundraiserStatus: (id: string, status: Fundraiser['status']) => Promise<void>;
}

// Mock data
const MOCK_FUNDRAISERS: Fundraiser[] = [
  {
    id: '1',
    title: "Legal Aid for Unlawfully Detained Students",
    description: "Raising funds for legal representation for 5 university students detained during peaceful protests",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: 'legal',
    targetAmount: 150000,
    raisedAmount: 78500,
    beneficiary: "Student Rights Defense Fund",
    organizer: '1',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: '2',
    title: "Medical Support for Injured Demonstrators",
    description: "Supporting medical bills for protesters injured during the recent anti-corruption demonstrations",
    imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: 'medical',
    targetAmount: 250000,
    raisedAmount: 175000,
    beneficiary: "Community Health Support Network",
    organizer: '2',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: '3',
    title: "Anti-Corruption Demonstration Logistics",
    description: "Funding for transportation, materials, and logistics for the upcoming nationwide anti-corruption demonstration",
    imageUrl: "https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: 'demonstration',
    targetAmount: 100000,
    raisedAmount: 87500,
    beneficiary: "Citizens Against Corruption Coalition",
    organizer: '3',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: '4',
    title: "Community Legal Education Program",
    description: "Funding for a program to educate citizens about their legal rights when dealing with authorities",
    imageUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: 'education',
    targetAmount: 75000,
    raisedAmount: 75000,
    beneficiary: "Legal Rights Education Initiative",
    organizer: '4',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago (ended)
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
];

export const useFundraiserStore = create<FundraiserState>()(
  persist(
    (set) => ({
      fundraisers: MOCK_FUNDRAISERS,
      isLoading: false,
      error: null,
      fetchFundraisers: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch from an API
          set({ 
            fundraisers: MOCK_FUNDRAISERS,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: "Failed to fetch fundraisers. Please try again.",
            isLoading: false,
          });
        }
      },
      addFundraiser: async (fundraiser) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newFundraiser: Fundraiser = {
            ...fundraiser,
            id: Math.random().toString(36).substring(2, 9),
            raisedAmount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({ 
            fundraisers: [newFundraiser, ...state.fundraisers],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to create fundraiser. Please try again.",
            isLoading: false,
          });
        }
      },
      contributeToCampaign: async (id, amount) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            fundraisers: state.fundraisers.map(fundraiser => 
              fundraiser.id === id 
                ? { 
                    ...fundraiser, 
                    raisedAmount: fundraiser.raisedAmount + amount,
                    status: fundraiser.raisedAmount + amount >= fundraiser.targetAmount ? 'completed' : fundraiser.status,
                    updatedAt: new Date().toISOString() 
                  } 
                : fundraiser
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to process contribution. Please try again.",
            isLoading: false,
          });
        }
      },
      updateFundraiserStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            fundraisers: state.fundraisers.map(fundraiser => 
              fundraiser.id === id 
                ? { 
                    ...fundraiser, 
                    status,
                    updatedAt: new Date().toISOString() 
                  } 
                : fundraiser
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to update fundraiser status. Please try again.",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'haki-fundraiser-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);