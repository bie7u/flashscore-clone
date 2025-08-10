import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware with CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));
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

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FlashScore Django API is running' });
});

// 2. Leagues
app.get('/api/leagues/', (req, res) => {
  const { league_name } = req.query;
  
  if (!leagues) {
    return res.status(500).json({ error: 'Failed to load leagues data' });
  }
  
  let result = leagues.leagues;
  
  if (league_name) {
    // Handle underscores as spaces and do partial matching
    const searchName = league_name.toLowerCase().replace(/_/g, ' ');
    result = result.filter(league => 
      league.name.toLowerCase().includes(searchName)
    );
  }
  
  res.json(result);
});

app.get('/api/leagues/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!leagues) {
    return res.status(500).json({ error: 'Failed to load leagues data' });
  }
  
  const league = leagues.leagues.find(l => l.id === parseInt(id));
  
  if (!league) {
    return res.status(404).json({ error: 'League not found' });
  }
  
  res.json(league);
});

// 3. Teams
app.get('/api/teams/', (req, res) => {
  if (!teams) {
    return res.status(500).json({ error: 'Failed to load teams data' });
  }
  
  res.json(teams.teams);
});

app.get('/api/teams/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!teams) {
    return res.status(500).json({ error: 'Failed to load teams data' });
  }
  
  const team = teams.teams.find(t => t.id === parseInt(id));
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  res.json(team);
});

// 4. Matches
app.get('/api/matches/', (req, res) => {
  const { league_id, status, date, team_id } = req.query;
  
  if (!matches) {
    return res.status(500).json({ error: 'Failed to load matches data' });
  }
  
  let result = matches.matches;
  
  if (league_id) {
    result = result.filter(match => match.league === parseInt(league_id));
  }
  
  if (status) {
    result = result.filter(match => match.status === status);
  }
  
  if (date) {
    result = result.filter(match => match.date.startsWith(date));
  }
  
  if (team_id) {
    const teamIdInt = parseInt(team_id);
    result = result.filter(match => 
      match.home_team.id === teamIdInt || match.away_team.id === teamIdInt
    );
  }
  
  res.json(result);
});

app.get('/api/matches/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!matches) {
    return res.status(500).json({ error: 'Failed to load matches data' });
  }
  
  const match = matches.matches.find(m => m.id === parseInt(id));
  
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  res.json(match);
});

app.get('/api/matches/:id/events/', (req, res) => {
  const { id } = req.params;
  
  if (!events) {
    return res.status(500).json({ error: 'Failed to load events data' });
  }
  
  const matchEvents = events.events.filter(event => event.match === parseInt(id));
  res.json({ events: matchEvents });
});

// 5. Standings
app.get('/api/standings/', (req, res) => {
  const { league, season } = req.query;
  
  if (!standings) {
    return res.status(500).json({ error: 'Failed to load standings data' });
  }
  
  let result = standings.standings;
  
  if (league) {
    result = result.filter(standing => standing.league === parseInt(league));
  }
  
  if (season) {
    result = result.filter(standing => standing.season === parseInt(season));
  }
  
  res.json(result);
});

app.get('/api/standings/league=:id', (req, res) => {
  const { id } = req.params;
  
  if (!standings) {
    return res.status(500).json({ error: 'Failed to load standings data' });
  }
  
  const result = standings.standings.filter(standing => standing.league === parseInt(id));
  
  if (result.length === 0) {
    return res.status(404).json({ error: 'No standings found for this league' });
  }
  
  res.json(result);
});

app.get('/api/standings/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!standings) {
    return res.status(500).json({ error: 'Failed to load standings data' });
  }
  
  const standing = standings.standings.find(s => s.id === parseInt(id));
  
  if (!standing) {
    return res.status(404).json({ error: 'Standing not found' });
  }
  
  res.json(standing);
});

// 6. Rounds
app.get('/api/rounds/', (req, res) => {
  const { league, season } = req.query;
  
  if (!rounds || !matches) {
    return res.status(500).json({ error: 'Failed to load rounds or matches data' });
  }
  
  let result = rounds.rounds;
  
  if (league) {
    result = result.filter(round => round.league === parseInt(league));
  }
  
  if (season) {
    result = result.filter(round => round.season === parseInt(season));
  }
  
  // Add matches to each round
  const roundsWithMatches = result.map(round => {
    const roundMatches = matches.matches.filter(match => 
      match.round === round.round_number && 
      match.league === round.league &&
      (!season || match.season === parseInt(season))
    );
    return {
      ...round,
      matches: roundMatches
    };
  });
  
  res.json(roundsWithMatches);
});

app.get('/api/rounds/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!rounds || !matches) {
    return res.status(500).json({ error: 'Failed to load rounds or matches data' });
  }
  
  const round = rounds.rounds.find(r => r.id === parseInt(id));
  
  if (!round) {
    return res.status(404).json({ error: 'Round not found' });
  }
  
  // Add matches to the round
  const roundMatches = matches.matches.filter(match => 
    match.round === round.round_number && 
    match.league === round.league
  );
  
  res.json({
    ...round,
    matches: roundMatches
  });
});

// 7. Seasons
app.get('/api/seasons/', (req, res) => {
  const { league } = req.query;
  
  if (!seasons) {
    return res.status(500).json({ error: 'Failed to load seasons data' });
  }
  
  let result = seasons.seasons;
  
  if (league) {
    result = result.filter(season => season.league === parseInt(league));
  }
  
  res.json(result);
});

app.get('/api/seasons/:id/', (req, res) => {
  const { id } = req.params;
  
  if (!seasons) {
    return res.status(500).json({ error: 'Failed to load seasons data' });
  }
  
  const season = seasons.seasons.find(s => s.id === parseInt(id));
  
  if (!season) {
    return res.status(404).json({ error: 'Season not found' });
  }
  
  res.json(season);
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