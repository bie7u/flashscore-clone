import type { League, Team, Match, MatchEvent, Standing, Round, Season } from './types';

const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';

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
      throw error;
    }
  }

  // Leagues
  async getLeagues(league_name?: string): Promise<{ leagues: League[] }> {
    const params = league_name ? `?league_name=${league_name}` : '';
    return this.fetchData<{ leagues: League[] }>(`/leagues${params}`);
  }

  // Teams
  async getTeams(leagueId?: string): Promise<{ teams: Team[] }> {
    const params = leagueId ? `?leagueId=${leagueId}` : '';
    return this.fetchData<{ teams: Team[] }>(`/teams${params}`);
  }

  // Matches
  async getMatches(filters: {
    leagueId?: string;
    status?: string;
    date?: string;
    teamId?: string;
  } = {}): Promise<{ matches: Match[] }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const queryString = params.toString();
    return this.fetchData<{ matches: Match[] }>(`/matches${queryString ? '?' + queryString : ''}`);
  }

  async getMatch(matchId: string): Promise<Match> {
    return this.fetchData<Match>(`/matches/${matchId}`);
  }

  async getMatchEvents(matchId: string): Promise<{ events: MatchEvent[] }> {
    return this.fetchData<{ events: MatchEvent[] }>(`/matches/${matchId}/events`);
  }

  // Standings
  async getStandings(leagueId?: string, season?: string): Promise<{ standings: Standing[] }> {
    const params = new URLSearchParams();
    if (leagueId) params.append('leagueId', leagueId);
    if (season) params.append('season', season);
    
    const queryString = params.toString();
    return this.fetchData<{ standings: Standing[] }>(`/standings${queryString ? '?' + queryString : ''}`);
  }

  // Rounds
  async getRounds(leagueId?: string, season?: string): Promise<{ rounds: Round[] }> {
    const params = new URLSearchParams();
    if (leagueId) params.append('leagueId', leagueId);
    if (season) params.append('season', season);
    
    const queryString = params.toString();
    return this.fetchData<{ rounds: Round[] }>(`/rounds${queryString ? '?' + queryString : ''}`);
  }

  // Seasons
  async getSeasons(leagueId?: string): Promise<{ seasons: Season[] }> {
    const params = leagueId ? `?leagueId=${leagueId}` : '';
    return this.fetchData<{ seasons: Season[] }>(`/seasons${params}`);
  }

  // Health check
  async getHealth(): Promise<{ status: string; message: string }> {
    return this.fetchData<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;