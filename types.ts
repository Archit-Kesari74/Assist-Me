export type Role = 'elder' | 'family' | 'helper';

export type RequestCategory = 'groceries' | 'home' | 'ride' | 'medicine' | 'other';

export type RequestStatus =
  | 'pending_family'
  | 'approved'
  | 'accepted'
  | 'on_the_way'
  | 'picked_up'
  | 'completed'
  | 'rejected';

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  elder: string;
  family: string;
  helper: string;
  estimatedCost: number;
  createdAt: number;
  updatedAt: number;
  rejectReason?: string;
  location?: string;
}

export interface AppState {
  activeRequest: HelpRequest | null;
  history: HelpRequest[];
  role: Role;
  textSize: 'normal' | 'large' | 'xlarge';
}
