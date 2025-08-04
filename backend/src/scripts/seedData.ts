import mongoose from 'mongoose';
import Match from '../models/Match';

const sampleMatches = [
  {
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    startTime: new Date(),
    league: 'Premier League',
    minute: 67,
    events: [
      {
        type: 'goal',
        team: 'home',
        player: 'Marcus Rashford',
        minute: 23,
        description: 'Header from close range'
      },
      {
        type: 'goal',
        team: 'away',
        player: 'Mohamed Salah',
        minute: 45,
        description: 'Penalty kick'
      },
      {
        type: 'goal',
        team: 'home',
        player: 'Bruno Fernandes',
        minute: 58,
        description: 'Free kick'
      }
    ]
  },
  {
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    league: 'Premier League',
    events: []
  },
  {
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 3,
    awayScore: 2,
    status: 'finished',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    league: 'La Liga',
    events: [
      {
        type: 'goal',
        team: 'home',
        player: 'Robert Lewandowski',
        minute: 12,
        description: 'Right footed shot'
      },
      {
        type: 'goal',
        team: 'away',
        player: 'Karim Benzema',
        minute: 34,
        description: 'Header'
      },
      {
        type: 'goal',
        team: 'home',
        player: 'Pedri',
        minute: 56,
        description: 'Long shot'
      },
      {
        type: 'goal',
        team: 'away',
        player: 'Vinicius Jr',
        minute: 78,
        description: 'Counter attack'
      },
      {
        type: 'goal',
        team: 'home',
        player: 'Ferran Torres',
        minute: 89,
        description: 'Close range finish'
      }
    ]
  },
  {
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    league: 'Bundesliga',
    minute: 82,
    events: [
      {
        type: 'goal',
        team: 'home',
        player: 'Thomas Müller',
        minute: 28,
        description: 'Tap in'
      },
      {
        type: 'goal',
        team: 'away',
        player: 'Erling Haaland',
        minute: 65,
        description: 'Powerful shot'
      }
    ]
  },
  {
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Tomorrow
    league: 'Serie A',
    events: []
  }
];

export const seedDatabase = async () => {
  try {
    // Clear existing matches
    await Match.deleteMany({});
    console.log('Cleared existing matches');

    // Insert sample matches
    await Match.insertMany(sampleMatches);
    console.log('Sample matches inserted successfully');
    
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Run if called directly
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flashscore';
  
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedDatabase();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
}