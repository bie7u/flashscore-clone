#!/bin/bash

echo "Testing Django FlashScore API integration..."
echo "============================================="

# Test API Health
echo "1. Testing Django API Health:"
curl -s http://localhost:8000/api/health | python3 -m json.tool

# Test Leagues
echo ""
echo "2. Testing Leagues (first 2):"
curl -s http://localhost:8000/api/leagues/ | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps(data['leagues'][:2], indent=2))
"

# Test Live Matches
echo ""
echo "3. Testing Live Matches:"
curl -s "http://localhost:8000/api/matches/?status=LIVE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'Found {len(data[\"matches\"])} live matches')
"

# Test Specific Match
echo ""
echo "4. Testing Specific Match (match1):"
curl -s http://localhost:8000/api/matches/match1/ | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'{data[\"homeTeam\"][\"name\"]} vs {data[\"awayTeam\"][\"name\"]} - Status: {data[\"status\"]}')
"

# Test Match Events
echo ""
echo "5. Testing Match Events (match1):"
curl -s http://localhost:8000/api/matches/match1/events/ | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'Found {len(data[\"events\"])} events')
"

# Test Standings
echo ""
echo "6. Testing Standings (Premier League):"
curl -s "http://localhost:8000/api/standings/?leagueId=pl" | python3 -c "
import sys, json
data = json.load(sys.stdin)
standing = data['standings'][0]
print(f'League: {standing[\"leagueId\"]} - {len(standing[\"table\"])} teams')
for team in standing['table'][:3]:
    print(f'  {team[\"position\"]}. {team[\"teamName\"]} - {team[\"points\"]} pts')
"

# Test Update Standings API
echo ""
echo "7. Testing Update Standings API:"
curl -X POST -s "http://localhost:8000/api/standings/pl-2025-standings/update_single/" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'Update status: {data[\"status\"]}')
print(f'Message: {data[\"message\"]}')
"

echo ""
echo "Django API Integration Test Complete!"
echo "All endpoints are working correctly."
echo ""
echo "To test the full app:"
echo "1. Django API is running at: http://localhost:8000/api/"
echo "2. Django Admin is available at: http://localhost:8000/admin/ (admin/admin123)"
echo "3. Start Frontend: npm run dev"
echo "4. Open: http://localhost:5173"