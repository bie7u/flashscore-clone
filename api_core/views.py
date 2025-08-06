from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.core.management import call_command
from io import StringIO

from .models import League, Season, Team, Round, Match, Event, Standing, StandingEntry
from .serializers import (
    LeagueSerializer, SeasonSerializer, TeamSerializer, RoundSerializer,
    MatchSerializer, EventSerializer, StandingSerializer,
    LeagueListSerializer, SeasonListSerializer, TeamListSerializer,
    MatchListSerializer, EventListSerializer, StandingListSerializer,
    RoundListSerializer
)


class HealthCheckView(APIView):
    """Health check endpoint"""
    def get(self, request):
        return Response({
            'status': 'OK',
            'message': 'FlashScore Django API is running'
        })


class LeagueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    
    def list(self, request):
        league_name = request.query_params.get('league_name')
        
        if league_name:
            # Filter by league name (case insensitive, replace spaces with underscores)
            leagues = self.queryset.filter(
                name__icontains=league_name.replace('_', ' ')
            )
        else:
            leagues = self.queryset.all()
        
        serializer = LeagueListSerializer({'leagues': leagues})
        return Response(serializer.data)


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    def list(self, request):
        league_id = request.query_params.get('leagueId')
        teams = self.queryset.all()
        
        # Note: In the original data, teams weren't directly linked to leagues
        # You might need to implement this relationship differently
        
        serializer = TeamListSerializer({'teams': teams})
        return Response(serializer.data)


class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    
    def list(self, request):
        matches = self.queryset.all()
        
        # Apply filters
        league_id = request.query_params.get('leagueId')
        if league_id:
            matches = matches.filter(league_id=league_id)
        
        match_status = request.query_params.get('status')
        if match_status:
            matches = matches.filter(status=match_status)
        
        date_filter = request.query_params.get('date')
        if date_filter:
            matches = matches.filter(date__date=date_filter)
        
        team_id = request.query_params.get('teamId')
        if team_id:
            matches = matches.filter(
                Q(home_team_id=team_id) | Q(away_team_id=team_id)
            )
        
        serializer = MatchListSerializer({'matches': matches})
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        match = get_object_or_404(Match, pk=pk)
        serializer = MatchSerializer(match)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        match = get_object_or_404(Match, pk=pk)
        events = match.events.all()
        serializer = EventListSerializer({'events': events})
        return Response(serializer.data)


class StandingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Standing.objects.all()
    serializer_class = StandingSerializer
    
    def list(self, request):
        standings = self.queryset.all()
        
        league_id = request.query_params.get('leagueId')
        if league_id:
            standings = standings.filter(league_id=league_id)
        
        season = request.query_params.get('season')
        if season:
            standings = standings.filter(season_id=season)
        
        serializer = StandingListSerializer({'standings': standings})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_all(self, request):
        """Update all standings based on match results"""
        try:
            out = StringIO()
            call_command('update_standings', stdout=out)
            output = out.getvalue()
            
            return Response({
                'status': 'success',
                'message': 'Standings updated successfully',
                'details': output
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to update standings: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def update_single(self, request, pk=None):
        """Update a specific standing based on match results"""
        try:
            standing = get_object_or_404(Standing, pk=pk)
            out = StringIO()
            call_command('update_standings', 
                        league=standing.league.id, 
                        season=standing.season.id, 
                        stdout=out)
            output = out.getvalue()
            
            return Response({
                'status': 'success',
                'message': f'Standing {standing} updated successfully',
                'details': output
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to update standing: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoundViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer
    
    def list(self, request):
        rounds = self.queryset.all()
        
        league_id = request.query_params.get('leagueId')
        if league_id:
            rounds = rounds.filter(league_id=league_id)
        
        season = request.query_params.get('season')
        if season:
            rounds = rounds.filter(season_id=season)
        
        serializer = RoundListSerializer({'rounds': rounds})
        return Response(serializer.data)


class SeasonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer
    
    def list(self, request):
        seasons = self.queryset.all()
        
        league_id = request.query_params.get('leagueId')
        if league_id:
            seasons = seasons.filter(league_id=league_id)
        
        serializer = SeasonListSerializer({'seasons': seasons})
        return Response(serializer.data)
