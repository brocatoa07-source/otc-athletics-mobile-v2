import type { DBUser } from './database';

export type CommunitySection =
  | 'announcements'
  | 'leaderboards'
  | 'challenges'
  | 'live_archive';

export interface SectionConfig {
  label: string;
  icon: string;
  description: string;
  canPost: ('TIER_1' | 'TIER_2' | 'COACH')[];
}

export const SECTION_CONFIG: Record<CommunitySection, SectionConfig> = {
  announcements: {
    label: 'Announcements',
    icon: 'megaphone',
    description: 'Official updates from the coaching staff',
    canPost: ['COACH'],
  },
  leaderboards: {
    label: 'Leaderboards',
    icon: 'trophy',
    description: 'Rankings for streaks, exit velo, bat speed & more',
    canPost: ['COACH'],
  },
  challenges: {
    label: 'Challenges',
    icon: 'flash',
    description: '7, 14, and 30-day athlete challenges',
    canPost: ['COACH'],
  },
  live_archive: {
    label: 'Live Session Archive',
    icon: 'videocam',
    description: 'Seminar replays, Q&As, and build calls',
    canPost: ['COACH'],
  },
};

export interface CommunityPost {
  id: string;
  athlete_id?: string;
  poster_user_id: string;
  section: CommunitySection;
  content: string;
  image_url?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  poster?: Pick<DBUser, 'id' | 'full_name' | 'avatar_url' | 'role'>;
  community_reactions?: CommunityReaction[];
}

export interface CommunityReaction {
  id: string;
  post_id: string;
  athlete_id: string;
  reaction_type: 'LIKE' | 'FIRE';
  created_at: string;
}
