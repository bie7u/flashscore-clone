import { Server, Socket } from 'socket.io';

export const setupWebSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join a specific match room
    socket.on('joinMatch', (matchId: string) => {
      socket.join(`match_${matchId}`);
      console.log(`User ${socket.id} joined match ${matchId}`);
    });
    
    // Leave a specific match room
    socket.on('leaveMatch', (matchId: string) => {
      socket.leave(`match_${matchId}`);
      console.log(`User ${socket.id} left match ${matchId}`);
    });
    
    // Handle live match updates
    socket.on('updateMatch', (data: any) => {
      const { matchId, update } = data;
      // Broadcast to all users in the match room
      socket.to(`match_${matchId}`).emit('matchUpdated', update);
    });
    
    // Handle live score updates
    socket.on('scoreUpdate', (data: any) => {
      const { matchId, homeScore, awayScore } = data;
      io.to(`match_${matchId}`).emit('scoreUpdated', {
        matchId,
        homeScore,
        awayScore
      });
    });
    
    // Handle match events (goals, cards, etc.)
    socket.on('matchEvent', (data: any) => {
      const { matchId, event } = data;
      io.to(`match_${matchId}`).emit('newEvent', {
        matchId,
        event
      });
    });
    
    // Handle match status changes
    socket.on('statusChange', (data: any) => {
      const { matchId, status, minute } = data;
      io.to(`match_${matchId}`).emit('statusChanged', {
        matchId,
        status,
        minute
      });
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
  return io;
};