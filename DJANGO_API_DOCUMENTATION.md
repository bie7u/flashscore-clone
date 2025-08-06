# Django REST Framework API for FlashScore Clone

This document provides comprehensive information about the Django REST Framework API that has been built to replace the Express.js backend for the FlashScore Clone application.

## Overview

The Django REST Framework API provides a robust, scalable backend for the FlashScore Clone application with the following key features:

- **Full REST API**: Complete CRUD operations for all football data
- **Django Admin Interface**: Easy management of leagues, teams, matches, and standings
- **Automatic Standings Updates**: Mechanism to automatically calculate standings from match results
- **CORS Support**: Configured for frontend integration
- **Data Migration**: Tools to import existing mock data

## Architecture

### Models

The API is built around the following Django models:

- **League**: Football competitions (Premier League, La Liga, etc.)
- **Season**: Seasons for each league (2024/25, 2025/26)
- **Team**: Football teams with metadata
- **Round**: Matchdays/rounds for organizing fixtures
- **Match**: Individual matches with scores and status
- **Event**: Match events (goals, cards, substitutions)
- **Standing**: League tables
- **StandingEntry**: Individual team positions in standings

### API Endpoints

All endpoints follow REST conventions and return JSON responses:

#### Base URL
- Development: `http://localhost:8000/api/`
- Production: `/api/`

#### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/leagues/` | GET | List all leagues |
| `/teams/` | GET | List all teams |
| `/matches/` | GET | List matches (with filters) |
| `/matches/{id}/` | GET | Get specific match |
| `/matches/{id}/events/` | GET | Get match events |
| `/standings/` | GET | List standings (with filters) |
| `/standings/update_all/` | POST | Update all standings |
| `/standings/{id}/update_single/` | POST | Update specific standing |
| `/rounds/` | GET | List rounds/matchdays |
| `/seasons/` | GET | List seasons |

#### Query Parameters

**Matches** (`/matches/`):
- `leagueId`: Filter by league
- `status`: Filter by status (LIVE, FINISHED, SCHEDULED)
- `date`: Filter by date (YYYY-MM-DD)
- `teamId`: Filter by team

**Standings** (`/standings/`):
- `leagueId`: Filter by league
- `season`: Filter by season

**Rounds** (`/rounds/`):
- `leagueId`: Filter by league
- `season`: Filter by season

**Seasons** (`/seasons/`):
- `leagueId`: Filter by league

## Setup Instructions

### Prerequisites

- Python 3.8+
- Django 5.2.5
- Node.js 18+ (for frontend)

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Load initial data:**
   ```bash
   python manage.py load_mock_data
   ```

4. **Create admin superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver 8000
   ```

6. **Start frontend (in separate terminal):**
   ```bash
   npm install
   npm run dev
   ```

### Configuration

The API is configured in `flashscore_api/settings.py`:

- **CORS Settings**: Allows requests from frontend development server
- **REST Framework**: Configured for open API access
- **Database**: SQLite for development (easily changeable for production)

## Standings Update Mechanism

The API provides multiple ways to update standings:

### 1. Management Command
```bash
# Update all standings
python manage.py update_standings

# Update specific league
python manage.py update_standings --league pl

# Update specific season
python manage.py update_standings --season 2025
```

### 2. API Endpoints
```bash
# Update all standings
curl -X POST http://localhost:8000/api/standings/update_all/

# Update specific standing
curl -X POST http://localhost:8000/api/standings/pl-2025-standings/update_single/
```

### 3. Django Admin Interface
- Access: `http://localhost:8000/admin/`
- Navigate to: **Api_Core** → **Standings**
- Edit standings and standing entries directly
- Changes are automatically saved

### Automatic Calculation

The standings update mechanism:
1. Fetches all finished matches for the league/season
2. Calculates statistics for each team (played, won, drawn, lost, goals)
3. Sorts teams by points, goal difference, and goals scored
4. Updates the standings table with new positions

## Django Admin Interface

The admin interface provides comprehensive management capabilities:

### Features
- **Full CRUD operations** for all models
- **Inline editing** for standing entries within standings
- **Filtering and search** for easy data navigation
- **Bulk operations** for efficient management
- **History tracking** for audit trails

### Access
- URL: `http://localhost:8000/admin/`
- Default credentials: `admin` / `admin123` (for development)

### Key Admin Views
- **Standings**: Manage league tables with inline team entries
- **Matches**: Update match results and status
- **Teams**: Manage team information
- **Leagues**: Configure competitions

## Data Migration

### From Mock Data
The `load_mock_data` management command imports data from the existing JSON files:

```bash
python manage.py load_mock_data --source src/mock-data
```

### Data Structure
The command imports:
- Leagues from `leagues.json`
- Teams from `teams.json`
- Seasons from `seasons.json`
- Rounds from `rounds.json`
- Matches from `matches.json`
- Events from `events.json`
- Standings from `standings.json`

## Frontend Integration

The frontend has been updated to use the Django API:

### Changes Made
- Updated `src/utils/apiService.ts` to point to Django API
- Added standings update methods to API service
- No changes needed to React components (thanks to consistent API interface)

### API Service Methods
```typescript
// Get data
await apiService.getLeagues()
await apiService.getMatches({ leagueId: 'pl', status: 'LIVE' })
await apiService.getStandings('pl', '2025')

// Update standings
await apiService.updateAllStandings()
await apiService.updateStanding('pl-2025-standings')
```

## Testing

### API Testing Script
Run the comprehensive test script:
```bash
chmod +x test-django-api.sh
./test-django-api.sh
```

### Manual Testing
- **Health Check**: `curl http://localhost:8000/api/health`
- **Get Leagues**: `curl http://localhost:8000/api/leagues/`
- **Get Live Matches**: `curl "http://localhost:8000/api/matches/?status=LIVE"`
- **Update Standings**: `curl -X POST http://localhost:8000/api/standings/update_all/`

## Production Deployment

### Environment Variables
Set the following environment variables for production:
```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=your-database-url
```

### Static Files
```bash
python manage.py collectstatic
```

### Database
Configure a production database (PostgreSQL recommended):
```python
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}
```

### CORS Configuration
Update CORS settings for production domains:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

## API Response Examples

### Leagues
```json
{
  "leagues": [
    {
      "id": "pl",
      "name": "Premier League",
      "country": "England",
      "logo": "/assets/team-logos/premier-league.png"
    }
  ]
}
```

### Matches
```json
{
  "matches": [
    {
      "id": "match1",
      "leagueId": "pl",
      "seasonId": "2025",
      "homeTeam": {
        "id": "mu",
        "name": "Manchester United",
        "score": 2
      },
      "awayTeam": {
        "id": "lfc",
        "name": "Liverpool",
        "score": 1
      },
      "status": "LIVE",
      "minute": 67,
      "date": "2025-08-05T15:00:00Z",
      "venue": "Old Trafford"
    }
  ]
}
```

### Standings
```json
{
  "standings": [
    {
      "id": "pl-2025-standings",
      "leagueId": "pl",
      "seasonId": "2025",
      "table": [
        {
          "position": 1,
          "teamId": "mcfc",
          "teamName": "Manchester City",
          "played": 3,
          "won": 3,
          "drawn": 0,
          "lost": 0,
          "goalsFor": 8,
          "goalsAgainst": 2,
          "goalDifference": 6,
          "points": 9
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS settings include your frontend URL
2. **Database Errors**: Run migrations with `python manage.py migrate`
3. **Import Errors**: Ensure all dependencies are installed
4. **Permission Errors**: Check file permissions for database and static files

### Logging
Enable Django logging for debugging:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

## Future Enhancements

### Suggested Improvements
1. **Authentication**: Add JWT-based authentication
2. **Real-time Updates**: Implement WebSocket for live match updates
3. **Caching**: Add Redis caching for better performance
4. **API Documentation**: Generate Swagger/OpenAPI documentation
5. **Tests**: Add comprehensive unit and integration tests
6. **Monitoring**: Add health checks and monitoring endpoints
7. **Rate Limiting**: Implement API rate limiting
8. **Search**: Add full-text search capabilities

### Performance Optimization
1. **Database Indexing**: Add indexes for frequently queried fields
2. **Query Optimization**: Use select_related and prefetch_related
3. **Pagination**: Implement cursor-based pagination for large datasets
4. **CDN**: Use CDN for static assets and logos

## Support

For issues and questions related to the Django API:
1. Check the Django logs for error details
2. Verify API endpoints using the test script
3. Use Django admin interface for data verification
4. Consult Django REST Framework documentation for advanced usage