# FlashScore API

A simple Express.js API server that provides mocked data for the FlashScore frontend application.

## Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will start on `http://localhost:3001`.

## Development

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Leagues
- `GET /api/leagues` - Get all leagues

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams?leagueId={id}` - Get teams for a specific league

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches?leagueId={id}` - Get matches for a specific league
- `GET /api/matches?status={status}` - Get matches with specific status (LIVE, FINISHED, SCHEDULED)
- `GET /api/matches?date={date}` - Get matches for a specific date (YYYY-MM-DD format)
- `GET /api/matches?teamId={id}` - Get matches for a specific team
- `GET /api/matches/{matchId}` - Get specific match details
- `GET /api/matches/{matchId}/events` - Get events for a specific match

### Standings
- `GET /api/standings` - Get all standings
- `GET /api/standings?leagueId={id}` - Get standings for a specific league
- `GET /api/standings?season={season}` - Get standings for a specific season

### Rounds
- `GET /api/rounds` - Get all rounds
- `GET /api/rounds?leagueId={id}` - Get rounds for a specific league
- `GET /api/rounds?season={season}` - Get rounds for a specific season

### Seasons
- `GET /api/seasons` - Get all seasons
- `GET /api/seasons?leagueId={id}` - Get seasons for a specific league

## Data Structure

The API uses the same mock data structure as documented in `MOCK_DATA_DOCUMENTATION.md`. All data is loaded from JSON files in the `src/data/` directory.

## Integration with Frontend

The frontend automatically detects the environment and connects to:
- Development: `http://localhost:3001/api`
- Production: `/api` (assumes API is served from the same domain)

To test the integration:
1. Start the API server (`npm start` in the `api` directory)
2. Start the frontend (`npm run dev` in the root directory)
3. Open `http://localhost:5173` in your browser

The frontend will automatically fetch data from the API instead of using direct JSON imports.