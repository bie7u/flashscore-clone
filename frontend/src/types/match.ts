export interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'finished';
  startTime: string;
  league: string;
  minute?: number;
  events: MatchEvent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MatchEvent {
  type: 'goal' | 'card' | 'substitution';
  team: 'home' | 'away';
  player: string;
  minute: number;
  description?: string;
}

export interface CreateMatchData {
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  league: string;
  homeScore?: number;
  awayScore?: number;
  status?: 'upcoming' | 'live' | 'finished';
}