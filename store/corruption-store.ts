import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CorruptionReport } from '@/types';

interface CorruptionState {
  reports: CorruptionReport[];
  isLoading: boolean;
  error: string | null;
  fetchReports: () => Promise<void>;
  addReport: (report: Omit<CorruptionReport, 'id' | 'upvotes' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  upvoteReport: (id: string) => Promise<void>;
  updateReportStatus: (id: string, status: CorruptionReport['status']) => Promise<void>;
  getLeaderboard: () => { officialName: string; count: number; }[];
}

// Mock data
const MOCK_REPORTS: CorruptionReport[] = [
  {
    id: '1',
    title: "Traffic Police Bribery",
    description: "Officer demanding bribes from matatu drivers at Thika Road roadblock",
    imageUrl: "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2186,
      longitude: 36.8886,
      address: "Thika Road, Near Garden City"
    },
    category: 'traffic',
    officialName: "Officer Kimani",
    officialId: "KP-12345",
    status: 'reported',
    reportedBy: '1',
    anonymous: false,
    upvotes: 24,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '2',
    title: "Health Official Demanding Bribes",
    description: "County health official demanding payment for free services at Mbagathi Hospital",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.3089,
      longitude: 36.8059,
      address: "Mbagathi Hospital, Nairobi"
    },
    category: 'health',
    officialName: "Dr. Otieno",
    status: 'investigating',
    reportedBy: '2',
    anonymous: true,
    upvotes: 42,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: '3',
    title: "Police Harassment",
    description: "Officers harassing street vendors and demanding payments in CBD",
    imageUrl: "https://images.unsplash.com/photo-1453873623425-04e3561289aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2864,
      longitude: 36.8172,
      address: "Tom Mboya Street, Nairobi CBD"
    },
    category: 'police',
    officialName: "Officer Kimani",
    status: 'verified',
    reportedBy: '3',
    anonymous: false,
    upvotes: 78,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: '4',
    title: "Education Official Embezzlement",
    description: "School principal misusing school funds for personal projects",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: {
      latitude: -1.2755,
      longitude: 36.8565,
      address: "Eastleigh High School, Nairobi"
    },
    category: 'education',
    officialName: "Mr. Wafula",
    status: 'resolved',
    reportedBy: '4',
    anonymous: true,
    upvotes: 56,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
];

export const useCorruptionStore = create<CorruptionState>()(
  persist(
    (set, get) => ({
      reports: MOCK_REPORTS,
      isLoading: false,
      error: null,
      fetchReports: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch from an API
          set({ 
            reports: MOCK_REPORTS,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: "Failed to fetch corruption reports. Please try again.",
            isLoading: false,
          });
        }
      },
      addReport: async (report) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newReport: CorruptionReport = {
            ...report,
            id: Math.random().toString(36).substring(2, 9),
            upvotes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set(state => ({ 
            reports: [newReport, ...state.reports],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to add corruption report. Please try again.",
            isLoading: false,
          });
        }
      },
      upvoteReport: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({ 
            reports: state.reports.map(report => 
              report.id === id 
                ? { 
                    ...report, 
                    upvotes: report.upvotes + 1,
                    updatedAt: new Date().toISOString() 
                  } 
                : report
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to upvote report. Please try again.",
            isLoading: false,
          });
        }
      },
      updateReportStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({ 
            reports: state.reports.map(report => 
              report.id === id 
                ? { 
                    ...report, 
                    status,
                    updatedAt: new Date().toISOString() 
                  } 
                : report
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: "Failed to update report status. Please try again.",
            isLoading: false,
          });
        }
      },
      getLeaderboard: () => {
        const reports = get().reports;
        const officialCounts: Record<string, number> = {};
        
        reports.forEach(report => {
          if (report.officialName) {
            if (officialCounts[report.officialName]) {
              officialCounts[report.officialName]++;
            } else {
              officialCounts[report.officialName] = 1;
            }
          }
        });
        
        return Object.entries(officialCounts)
          .map(([officialName, count]) => ({ officialName, count }))
          .sort((a, b) => b.count - a.count);
      },
    }),
    {
      name: 'haki-corruption-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);