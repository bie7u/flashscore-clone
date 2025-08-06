import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from api_core.models import League, Season, Team, Round, Match, Event, Standing, StandingEntry


class Command(BaseCommand):
    help = 'Load mock data from JSON files into Django models'

    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            default='src/mock-data',
            help='Source directory for JSON files (default: src/mock-data)'
        )

    def handle(self, *args, **options):
        source_dir = options['source']
        base_dir = settings.BASE_DIR
        
        # Load JSON data
        def load_json(filename):
            file_path = os.path.join(base_dir, source_dir, filename)
            if not os.path.exists(file_path):
                self.stdout.write(
                    self.style.ERROR(f'File not found: {file_path}')
                )
                return None
            
            with open(file_path, 'r') as f:
                return json.load(f)

        self.stdout.write('Loading mock data...')
        
        # Load leagues
        leagues_data = load_json('leagues.json')
        if leagues_data:
            for league_data in leagues_data['leagues']:
                league, created = League.objects.get_or_create(
                    id=league_data['id'],
                    defaults={
                        'name': league_data['name'],
                        'country': league_data['country'],
                        'logo': league_data.get('logo', '')
                    }
                )
                if created:
                    self.stdout.write(f'Created league: {league.name}')

        # Load teams
        teams_data = load_json('teams.json')
        if teams_data:
            for team_data in teams_data['teams']:
                team, created = Team.objects.get_or_create(
                    id=team_data['id'],
                    defaults={
                        'name': team_data['name'],
                        'logo': team_data.get('logo', ''),
                        'country': team_data.get('country', ''),
                        'founded': team_data.get('founded'),
                        'stadium': team_data.get('stadium', ''),
                        'website': team_data.get('website', '')
                    }
                )
                if created:
                    self.stdout.write(f'Created team: {team.name}')

        # Load seasons
        seasons_data = load_json('seasons.json')
        if seasons_data:
            for season_data in seasons_data['seasons']:
                try:
                    league = League.objects.get(id=season_data['leagueId'])
                    season, created = Season.objects.get_or_create(
                        id=season_data['id'],
                        defaults={
                            'year': season_data['year'],
                            'name': season_data['name'],
                            'league': league
                        }
                    )
                    if created:
                        self.stdout.write(f'Created season: {season.name} for {league.name}')
                except League.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'League not found: {season_data["leagueId"]}')
                    )

        # Load rounds
        rounds_data = load_json('rounds.json')
        if rounds_data:
            for round_data in rounds_data['rounds']:
                try:
                    league = League.objects.get(id=round_data['leagueId'])
                    season = Season.objects.get(id=round_data['seasonId'])
                    
                    round_obj, created = Round.objects.get_or_create(
                        id=round_data['id'],
                        defaults={
                            'league': league,
                            'season': season,
                            'round_number': round_data['roundNumber'],
                            'name': round_data['name'],
                            'start_date': datetime.fromisoformat(round_data['startDate'].replace('Z', '+00:00')),
                            'end_date': datetime.fromisoformat(round_data['endDate'].replace('Z', '+00:00'))
                        }
                    )
                    if created:
                        self.stdout.write(f'Created round: {round_obj.name}')
                except (League.DoesNotExist, Season.DoesNotExist) as e:
                    self.stdout.write(
                        self.style.WARNING(f'Related object not found for round {round_data["id"]}: {e}')
                    )

        # Load matches
        matches_data = load_json('matches.json')
        if matches_data:
            for match_data in matches_data['matches']:
                try:
                    league = League.objects.get(id=match_data['leagueId'])
                    season = Season.objects.get(id=match_data['seasonId'])
                    home_team = Team.objects.get(id=match_data['homeTeam']['id'])
                    away_team = Team.objects.get(id=match_data['awayTeam']['id'])
                    
                    round_obj = None
                    if match_data.get('roundId'):
                        try:
                            round_obj = Round.objects.get(id=match_data['roundId'])
                        except Round.DoesNotExist:
                            pass
                    
                    match, created = Match.objects.get_or_create(
                        id=match_data['id'],
                        defaults={
                            'league': league,
                            'season': season,
                            'round': round_obj,
                            'home_team': home_team,
                            'away_team': away_team,
                            'home_score': match_data['homeTeam'].get('score'),
                            'away_score': match_data['awayTeam'].get('score'),
                            'status': match_data['status'],
                            'minute': match_data.get('minute'),
                            'date': datetime.fromisoformat(match_data['date'].replace('Z', '+00:00')),
                            'venue': match_data.get('venue', '')
                        }
                    )
                    if created:
                        self.stdout.write(f'Created match: {match}')
                except (League.DoesNotExist, Season.DoesNotExist, Team.DoesNotExist) as e:
                    self.stdout.write(
                        self.style.WARNING(f'Related object not found for match {match_data["id"]}: {e}')
                    )

        # Load events
        events_data = load_json('events.json')
        if events_data:
            for event_data in events_data['events']:
                try:
                    match = Match.objects.get(id=event_data['matchId'])
                    team = Team.objects.get(id=event_data['teamId'])
                    
                    event, created = Event.objects.get_or_create(
                        id=event_data['id'],
                        defaults={
                            'match': match,
                            'team': team,
                            'event_type': event_data['type'],
                            'minute': event_data['minute'],
                            'player_id': event_data.get('playerId', ''),
                            'player_name': event_data['playerName'],
                            'description': event_data.get('description', '')
                        }
                    )
                    if created:
                        self.stdout.write(f'Created event: {event}')
                except (Match.DoesNotExist, Team.DoesNotExist) as e:
                    self.stdout.write(
                        self.style.WARNING(f'Related object not found for event {event_data["id"]}: {e}')
                    )

        # Load standings
        standings_data = load_json('standings.json')
        if standings_data:
            for standing_data in standings_data['standings']:
                try:
                    league = League.objects.get(id=standing_data['leagueId'])
                    season = Season.objects.get(id=standing_data['seasonId'])
                    
                    standing, created = Standing.objects.get_or_create(
                        id=standing_data['id'],
                        defaults={
                            'league': league,
                            'season': season
                        }
                    )
                    
                    if created:
                        self.stdout.write(f'Created standing: {standing}')
                        
                        # Create standing entries
                        for entry_data in standing_data['table']:
                            try:
                                team = Team.objects.get(id=entry_data['teamId'])
                                StandingEntry.objects.create(
                                    standing=standing,
                                    team=team,
                                    position=entry_data['position'],
                                    played=entry_data['played'],
                                    won=entry_data['won'],
                                    drawn=entry_data['drawn'],
                                    lost=entry_data['lost'],
                                    goals_for=entry_data['goalsFor'],
                                    goals_against=entry_data['goalsAgainst'],
                                    points=entry_data['points']
                                )
                            except Team.DoesNotExist:
                                self.stdout.write(
                                    self.style.WARNING(f'Team not found: {entry_data["teamId"]}')
                                )
                        
                        self.stdout.write(f'Created {len(standing_data["table"])} standing entries')
                        
                except (League.DoesNotExist, Season.DoesNotExist) as e:
                    self.stdout.write(
                        self.style.WARNING(f'Related object not found for standing {standing_data["id"]}: {e}')
                    )

        self.stdout.write(
            self.style.SUCCESS('Successfully loaded mock data!')
        )