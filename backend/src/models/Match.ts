import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'finished';
  startTime: Date;
  league: string;
  minute?: number;
  events: Array<{
    type: 'goal' | 'card' | 'substitution';
    team: 'home' | 'away';
    player: string;
    minute: number;
    description?: string;
  }>;
}

const MatchSchema: Schema = new Schema({
  homeTeam: {
    type: String,
    required: true,
    trim: true
  },
  awayTeam: {
    type: String,
    required: true,
    trim: true
  },
  homeScore: {
    type: Number,
    default: 0,
    min: 0
  },
  awayScore: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished'],
    default: 'upcoming'
  },
  startTime: {
    type: Date,
    required: true
  },
  league: {
    type: String,
    required: true,
    trim: true
  },
  minute: {
    type: Number,
    min: 0,
    max: 120
  },
  events: [{
    type: {
      type: String,
      enum: ['goal', 'card', 'substitution'],
      required: true
    },
    team: {
      type: String,
      enum: ['home', 'away'],
      required: true
    },
    player: {
      type: String,
      required: true,
      trim: true
    },
    minute: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IMatch>('Match', MatchSchema);