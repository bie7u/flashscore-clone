from django.core.management.base import BaseCommand
from django.db import transaction
from api_core.models import Standing, StandingEntry, Match, Team


class Command(BaseCommand):
    help = 'Update standings based on match results'

    def add_arguments(self, parser):
        parser.add_argument(
            '--league',
            type=str,
            help='League ID to update standings for (optional)'
        )
        parser.add_argument(
            '--season',
            type=str,
            help='Season ID to update standings for (optional)'
        )

    def handle(self, *args, **options):
        league_filter = options.get('league')
        season_filter = options.get('season')
        
        standings_qs = Standing.objects.all()
        
        if league_filter:
            standings_qs = standings_qs.filter(league_id=league_filter)
        if season_filter:
            standings_qs = standings_qs.filter(season_id=season_filter)
        
        for standing in standings_qs:
            self.update_standing(standing)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {standings_qs.count()} standings!')
        )

    def update_standing(self, standing):
        """Update a single standing based on match results"""
        self.stdout.write(f'Updating {standing}...')
        
        # Get all finished matches for this league/season
        matches = Match.objects.filter(
            league=standing.league,
            season=standing.season,
            status='FINISHED'
        )
        
        # Get all teams that have played in this league/season
        team_ids = set()
        for match in matches:
            team_ids.add(match.home_team.id)
            team_ids.add(match.away_team.id)
        
        teams = Team.objects.filter(id__in=team_ids)
        
        # Calculate standings for each team
        team_stats = {}
        for team in teams:
            stats = {
                'team': team,
                'played': 0,
                'won': 0,
                'drawn': 0,
                'lost': 0,
                'goals_for': 0,
                'goals_against': 0,
                'points': 0
            }
            
            # Calculate stats from matches
            home_matches = matches.filter(home_team=team)
            away_matches = matches.filter(away_team=team)
            
            for match in home_matches:
                if match.home_score is not None and match.away_score is not None:
                    stats['played'] += 1
                    stats['goals_for'] += match.home_score
                    stats['goals_against'] += match.away_score
                    
                    if match.home_score > match.away_score:
                        stats['won'] += 1
                        stats['points'] += 3
                    elif match.home_score == match.away_score:
                        stats['drawn'] += 1
                        stats['points'] += 1
                    else:
                        stats['lost'] += 1
            
            for match in away_matches:
                if match.home_score is not None and match.away_score is not None:
                    stats['played'] += 1
                    stats['goals_for'] += match.away_score
                    stats['goals_against'] += match.home_score
                    
                    if match.away_score > match.home_score:
                        stats['won'] += 1
                        stats['points'] += 3
                    elif match.away_score == match.home_score:
                        stats['drawn'] += 1
                        stats['points'] += 1
                    else:
                        stats['lost'] += 1
            
            team_stats[team.id] = stats
        
        # Sort teams by points (and goal difference as tiebreaker)
        sorted_teams = sorted(
            team_stats.values(),
            key=lambda x: (-x['points'], -(x['goals_for'] - x['goals_against']), -x['goals_for']),
        )
        
        # Update standing entries
        with transaction.atomic():
            # Delete existing entries
            StandingEntry.objects.filter(standing=standing).delete()
            
            # Create new entries
            for position, stats in enumerate(sorted_teams, 1):
                StandingEntry.objects.create(
                    standing=standing,
                    team=stats['team'],
                    position=position,
                    played=stats['played'],
                    won=stats['won'],
                    drawn=stats['drawn'],
                    lost=stats['lost'],
                    goals_for=stats['goals_for'],
                    goals_against=stats['goals_against'],
                    points=stats['points']
                )
        
        self.stdout.write(f'Updated {len(sorted_teams)} teams in {standing}')