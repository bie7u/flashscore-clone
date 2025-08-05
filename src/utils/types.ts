// Base interfaces for the application

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
}

export interface Season {
  id: string;
  year: string;
  name: string;
  leagueId: string;
}

export interface Round {
  id: string;
  leagueId: string;
  seasonId: string;
  roundNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  matches?: Match[]; // Optional field for when API returns matches with rounds
}

export interface StandingEntry {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Standing {
  id: string;
  leagueId: string;
  seasonId: string;
  table: StandingEntry[];
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  score?: number;
}

export interface Match {
  id: string;
  leagueId: string;
  seasonId: string;
  roundId?: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatus;
  minute?: number;
  date: string;
  venue?: string;
}

export type MatchStatus = 'LIVE' | 'FINISHED' | 'SCHEDULED' | 'POSTPONED' | 'CANCELLED';

export interface MatchEvent {
  id: string;
  matchId: string;
  type: EventType;
  minute: number;
  teamId: string;
  playerId?: string;
  playerName: string;
  description?: string;
}

export type EventType = 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'PENALTY' | 'OWN_GOAL';

export interface Player {
  id: string;
  name: string;
  position?: string;
  number?: number;
}

// Context types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Component prop types
export interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
}

export interface MatchListProps {
  matches: Match[];
  onMatchClick?: (match: Match) => void;
}

export interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague?: string;
  onLeagueSelect: (leagueId: string) => void;
}

export interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason?: string;
  onSeasonSelect: (seasonId: string) => void;
}

// Utility types
export interface DateFilter {
  startDate: Date;
  endDate: Date;
}

export interface MatchFilters {
  leagueId?: string;
  seasonId?: string;
  status?: MatchStatus;
  date?: DateFilter;
}