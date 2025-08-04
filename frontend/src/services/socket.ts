import socketIo from 'socket.io-client';
import { Match, MatchEvent } from '../types/match';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: SocketIOClient.Socket | null = null;

  connect(): void {
    this.socket = socketIo(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a specific match room
  joinMatch(matchId: string): void {
    if (this.socket) {
      this.socket.emit('joinMatch', matchId);
    }
  }

  // Leave a specific match room
  leaveMatch(matchId: string): void {
    if (this.socket) {
      this.socket.emit('leaveMatch', matchId);
    }
  }

  // Listen for match updates
  onMatchUpdated(callback: (match: Match) => void): void {
    if (this.socket) {
      this.socket.on('matchUpdated', callback);
    }
  }

  // Listen for new matches
  onMatchCreated(callback: (match: Match) => void): void {
    if (this.socket) {
      this.socket.on('matchCreated', callback);
    }
  }

  // Listen for match deletion
  onMatchDeleted(callback: (matchId: string) => void): void {
    if (this.socket) {
      this.socket.on('matchDeleted', callback);
    }
  }

  // Listen for match events
  onMatchEvent(callback: (data: { matchId: string; event: MatchEvent }) => void): void {
    if (this.socket) {
      this.socket.on('matchEvent', callback);
    }
  }

  // Listen for score updates
  onScoreUpdated(callback: (data: { matchId: string; homeScore: number; awayScore: number }) => void): void {
    if (this.socket) {
      this.socket.on('scoreUpdated', callback);
    }
  }

  // Listen for status changes
  onStatusChanged(callback: (data: { matchId: string; status: string; minute?: number }) => void): void {
    if (this.socket) {
      this.socket.on('statusChanged', callback);
    }
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Get socket instance
  getSocket(): SocketIOClient.Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;