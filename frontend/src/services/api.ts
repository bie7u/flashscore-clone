import axios from 'axios';
import { Match, CreateMatchData, MatchEvent } from '../types/match';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchApi = {
  // Get all matches
  getMatches: async (params?: {
    status?: string;
    league?: string;
    date?: string;
  }): Promise<Match[]> => {
    const response = await api.get('/matches', { params });
    return response.data;
  },

  // Get a single match by ID
  getMatch: async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  // Create a new match
  createMatch: async (matchData: CreateMatchData): Promise<Match> => {
    const response = await api.post('/matches', matchData);
    return response.data;
  },

  // Update a match
  updateMatch: async (id: string, updateData: Partial<Match>): Promise<Match> => {
    const response = await api.put(`/matches/${id}`, updateData);
    return response.data;
  },

  // Add event to match
  addMatchEvent: async (id: string, event: MatchEvent): Promise<Match> => {
    const response = await api.post(`/matches/${id}/events`, event);
    return response.data;
  },

  // Delete a match
  deleteMatch: async (id: string): Promise<void> => {
    await api.delete(`/matches/${id}`);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;