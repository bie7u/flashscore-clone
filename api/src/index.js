import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load mock data
const loadData = (filename) => {
  try {
    const data = readFileSync(join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
};

const leagues = loadData('leagues.json');
const teams = loadData('teams.json');
const matches = loadData('matches.json');
const events = loadData('events.json');
const standings = loadData('standings.json');
const rounds = loadData('rounds.json');
const seasons = loadData('seasons.json');

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FlashScore API is running' });
});

// Get all leagues
app.get('/api/leagues', (req, res) => {
  const { league_name } = req.query;
  
  if (!leagues) {
    return res.status(500).json({ error: 'Failed to load leagues data' });
  }
  
  if (league_name) {
    const filteredLeagues = leagues.leagues.filter(league => 
      league.name.toLowerCase().replace(/\s+/g, '_') === league_name.toLowerCase()
    );
    res.json({ leagues: filteredLeagues });
  } else {
    res.json(leagues);
  }
});

// Get teams
app.get('/api/teams', (req, res) => {
  const { leagueId } = req.query;
  
  if (!teams) {
    return res.status(500).json({ error: 'Failed to load teams data' });
  }
  
  if (leagueId) {
    const filteredTeams = teams.teams.filter(team => team.leagueId === leagueId);
    res.json({ teams: filteredTeams });
  } else {
    res.json(teams);
  }
});

// Get matches
app.get('/api/matches', (req, res) => {
  const { leagueId, status, date, teamId } = req.query;
  
  if (!matches) {
    return res.status(500).json({ error: 'Failed to load matches data' });
  }
  
  let filteredMatches = matches.matches;
  
  if (leagueId) {
    filteredMatches = filteredMatches.filter(match => match.leagueId === leagueId);
  }
  
  if (status) {
    filteredMatches = filteredMatches.filter(match => match.status === status);
  }
  
  if (date) {
    filteredMatches = filteredMatches.filter(match => match.date.startsWith(date));
  }
  
  if (teamId) {
    filteredMatches = filteredMatches.filter(match => 
      match.homeTeam.id === teamId || match.awayTeam.id === teamId
    );
  }
  
  res.json({ matches: filteredMatches });
});

// Get specific match
app.get('/api/matches/:matchId', (req, res) => {
  const { matchId } = req.params;
  
  if (!matches) {
    return res.status(500).json({ error: 'Failed to load matches data' });
  }
  
  const match = matches.matches.find(m => m.id === matchId);
  
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  res.json(match);
});

// Get match events
app.get('/api/matches/:matchId/events', (req, res) => {
  const { matchId } = req.params;
  
  if (!events) {
    return res.status(500).json({ error: 'Failed to load events data' });
  }
  
  const matchEvents = events.events.filter(event => event.matchId === matchId);
  res.json({ events: matchEvents });
});

// Get standings
app.get('/api/standings', (req, res) => {
  const { leagueId, season } = req.query;
  
  if (!standings) {
    return res.status(500).json({ error: 'Failed to load standings data' });
  }
  
  let filteredStandings = standings.standings;
  
  if (leagueId) {
    filteredStandings = filteredStandings.filter(standing => standing.leagueId === leagueId);
  }
  
  if (season) {
    filteredStandings = filteredStandings.filter(standing => standing.season === season);
  }
  
  res.json({ standings: filteredStandings });
});

// Get rounds
app.get('/api/rounds', (req, res) => {
  const { leagueId, season } = req.query;
  
  if (!rounds || !matches) {
    return res.status(500).json({ error: 'Failed to load rounds or matches data' });
  }
  
  let filteredRounds = rounds.rounds;
  
  if (leagueId) {
    filteredRounds = filteredRounds.filter(round => round.leagueId === leagueId);
  }
  
  if (season) {
    filteredRounds = filteredRounds.filter(round => round.season === season);
  }
  
  // Add matches to each round
  const roundsWithMatches = filteredRounds.map(round => {
    const roundMatches = matches.matches.filter(match => 
      match.round === round.round && 
      match.leagueId === round.leagueId &&
      (!season || match.season === season)
    );
    return {
      ...round,
      matches: roundMatches
    };
  });
  
  res.json({ rounds: roundsWithMatches });
});

// Get seasons
app.get('/api/seasons', (req, res) => {
  const { leagueId } = req.query;
  
  if (!seasons) {
    return res.status(500).json({ error: 'Failed to load seasons data' });
  }
  
  if (leagueId) {
    const leagueSeasons = seasons.seasons.filter(season => season.leagueId === leagueId);
    res.json({ seasons: leagueSeasons });
  } else {
    res.json(seasons);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`FlashScore API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});