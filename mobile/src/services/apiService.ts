import { Platform } from 'react-native';
import type { League, Team, Match, MatchEvent, Standing, Round, Season } from '../types';

// For React Native, we need to use the machine's IP address instead of localhost
// In production, this would be your actual API URL
// For now, we'll use localhost for web testing and fallback to a local IP if needed
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' ? 'http://localhost:3001/api' : 'http://10.0.2.2:3001/api')
  : 'http://localhost:3001/api';

// Fallback mock data for development/testing
const mockLeagues: League[] = [
  { id: 1, name: "Premier League", logo: "/assets/team-logos/premier-league.png", country: "England" },
  { id: 2, name: "La Liga", logo: "/assets/team-logos/la-liga.png", country: "Spain" },
  { id: 3, name: "Bundesliga", logo: "/assets/team-logos/bundesliga.png", country: "Germany" },
  { id: 4, name: "Serie A", logo: "/assets/team-logos/serie-a.png", country: "Italy" },
  { id: 5, name: "Ligue 1", logo: "/assets/team-logos/ligue-1.png", country: "France" },
  { id: 6, name: "UEFA Champions League", logo: "/assets/team-logos/champions-league.png", country: "Europe" },
];

const mockMatches: Match[] = [
  {
    id: 1,
    league: 1,
    league_read: "Premier League",
    season: 2024,
    round: 1,
    round_number_read: "Matchday 1",
    home_team: { id: 1, name: "Manchester United" },
    away_team: { id: 2, name: "Liverpool" },
    home_score: 2,
    away_score: 1,
    status: "FINISHED",
    date: new Date().toISOString(),
    venue: "Old Trafford"
  },
  {
    id: 2,
    league: 1,
    league_read: "Premier League",
    season: 2024,
    round: 1,
    round_number_read: "Matchday 1",
    home_team: { id: 3, name: "Chelsea" },
    away_team: { id: 4, name: "Arsenal" },
    home_score: null,
    away_score: null,
    status: "SCHEDULED",
    date: new Date(Date.now() + 86400000).toISOString(),
    venue: "Stamford Bridge"
  }
];

class ApiService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      console.log('Falling back to mock data for development...');
      
      // Fallback to mock data for development
      if (endpoint.includes('/leagues')) {
        return mockLeagues as T;
      }
      if (endpoint.includes('/matches')) {
        return mockMatches as T;
      }
      
      throw error;
    }
  }

  // Leagues
  async getLeagues(league_name?: string): Promise<League[]> {
    const params = league_name ? `?league_name=${league_name}` : '';
    return this.fetchData<League[]>(`/leagues/${params}`);
  }

  async getLeague(id: number): Promise<League> {
    return this.fetchData<League>(`/leagues/${id}/`);
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return this.fetchData<Team[]>(`/teams/`);
  }

  async getTeam(id: number): Promise<Team> {
    return this.fetchData<Team>(`/teams/${id}/`);
  }

  // Matches
  async getMatches(filters: {
    league_id?: number;
    status?: string;
    date?: string;
    team_id?: number;
  } = {}): Promise<Match[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    return this.fetchData<Match[]>(`/matches/${queryString ? '?' + queryString : ''}`);
  }

  async getMatch(matchId: number): Promise<Match> {
    return this.fetchData<Match>(`/matches/${matchId}/`);
  }

  async getMatchEvents(matchId: number): Promise<{ events: MatchEvent[] }> {
    return this.fetchData<{ events: MatchEvent[] }>(`/matches/${matchId}/events/`);
  }

  // Standings
  async getStandings(league?: number, season?: number): Promise<Standing[]> {
    const params = new URLSearchParams();
    if (league !== undefined) params.append('league', league.toString());
    if (season !== undefined) params.append('season', season.toString());
    
    const queryString = params.toString();
    return this.fetchData<Standing[]>(`/standings/${queryString ? '?' + queryString : ''}`);
  }

  async getStanding(id: number): Promise<Standing> {
    return this.fetchData<Standing>(`/standings/${id}/`);
  }

  // Rounds
  async getRounds(league?: number, season?: number): Promise<Round[]> {
    const params = new URLSearchParams();
    if (league !== undefined) params.append('league', league.toString());
    if (season !== undefined) params.append('season__year', season.toString());
    
    const queryString = params.toString();
    return this.fetchData<Round[]>(`/rounds/${queryString ? '?' + queryString : ''}`);
  }

  async getRound(id: number): Promise<Round> {
    return this.fetchData<Round>(`/rounds/${id}/`);
  }

  // Seasons
  async getSeasons(league?: number): Promise<Season[]> {
    const params = league !== undefined ? `?league=${league}` : '';
    return this.fetchData<Season[]>(`/seasons/${params}`);
  }

  async getSeason(id: number): Promise<Season> {
    return this.fetchData<Season>(`/seasons/${id}/`);
  }

  // Health check
  async getHealth(): Promise<{ status: string; message: string }> {
    return this.fetchData<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;