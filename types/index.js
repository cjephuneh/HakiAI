export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    points: number;
    createdAt: string;
    role: 'user' | 'admin' | 'moderator';
  };
  
  export type LostID = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    status: 'found' | 'claimed' | 'verified' | 'rewarded';
    reward: number;
    foundBy: string;
    ownerId?: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type CorruptionReport = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    category: 'traffic' | 'government' | 'police' | 'education' | 'health' | 'other';
    officialName?: string;
    officialId?: string;
    status: 'reported' | 'investigating' | 'verified' | 'resolved' | 'dismissed';
    reportedBy: string;
    anonymous: boolean;
    upvotes: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type GovernmentWatch = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    category: 'project' | 'official' | 'event' | 'other';
    officialName?: string;
    department?: string;
    status: 'reported' | 'trending' | 'verified' | 'resolved';
    reportedBy: string;
    upvotes: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Fundraiser = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: 'legal' | 'medical' | 'education' | 'demonstration' | 'community' | 'other';
    targetAmount: number;
    raisedAmount: number;
    beneficiary: string;
    organizer: string;
    deadline: string;
    status: 'active' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  };
  
  export type Notification = {
    id: string;
    title: string;
    message: string;
    read: boolean;
    type: 'lostid' | 'corruption' | 'government' | 'fundraiser' | 'system';
    relatedItemId?: string;
    createdAt: string;
  };