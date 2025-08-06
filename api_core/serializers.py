from rest_framework import serializers
from .models import League, Season, Team, Round, Match, Event, Standing, StandingEntry


class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ['id', 'name', 'country', 'logo']


class SeasonSerializer(serializers.ModelSerializer):
    leagueId = serializers.CharField(source='league.id', read_only=True)
    
    class Meta:
        model = Season
        fields = ['id', 'year', 'name', 'leagueId']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'logo', 'country', 'founded', 'stadium', 'website']


class TeamBasicSerializer(serializers.ModelSerializer):
    """Basic team serializer for use within match data"""
    class Meta:
        model = Team
        fields = ['id', 'name']


class EventSerializer(serializers.ModelSerializer):
    matchId = serializers.CharField(source='match.id', read_only=True)
    teamId = serializers.CharField(source='team.id', read_only=True)
    type = serializers.CharField(source='event_type')
    playerId = serializers.CharField(source='player_id')
    playerName = serializers.CharField(source='player_name')
    
    class Meta:
        model = Event
        fields = ['id', 'matchId', 'type', 'minute', 'teamId', 'playerId', 'playerName', 'description']


class MatchSerializer(serializers.ModelSerializer):
    leagueId = serializers.CharField(source='league.id', read_only=True)
    seasonId = serializers.CharField(source='season.id', read_only=True)
    roundId = serializers.CharField(source='round.id', read_only=True, allow_null=True)
    
    homeTeam = serializers.SerializerMethodField()
    awayTeam = serializers.SerializerMethodField()
    
    class Meta:
        model = Match
        fields = [
            'id', 'leagueId', 'seasonId', 'roundId', 
            'homeTeam', 'awayTeam', 'status', 'minute', 
            'date', 'venue'
        ]
    
    def get_homeTeam(self, obj):
        return {
            'id': obj.home_team.id,
            'name': obj.home_team.name,
            'score': obj.home_score
        }
    
    def get_awayTeam(self, obj):
        return {
            'id': obj.away_team.id,
            'name': obj.away_team.name,
            'score': obj.away_score
        }


class RoundSerializer(serializers.ModelSerializer):
    leagueId = serializers.CharField(source='league.id', read_only=True)
    seasonId = serializers.CharField(source='season.id', read_only=True)
    roundNumber = serializers.IntegerField(source='round_number')
    startDate = serializers.DateTimeField(source='start_date')
    endDate = serializers.DateTimeField(source='end_date')
    matches = MatchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Round
        fields = ['id', 'leagueId', 'seasonId', 'roundNumber', 'name', 'startDate', 'endDate', 'matches']


class StandingEntrySerializer(serializers.ModelSerializer):
    teamId = serializers.CharField(source='team.id', read_only=True)
    teamName = serializers.CharField(source='team.name', read_only=True)
    goalsFor = serializers.IntegerField(source='goals_for')
    goalsAgainst = serializers.IntegerField(source='goals_against')
    goalDifference = serializers.IntegerField(source='goal_difference')
    
    class Meta:
        model = StandingEntry
        fields = [
            'position', 'teamId', 'teamName', 'played', 'won', 'drawn', 'lost',
            'goalsFor', 'goalsAgainst', 'goalDifference', 'points'
        ]


class StandingSerializer(serializers.ModelSerializer):
    leagueId = serializers.CharField(source='league.id', read_only=True)
    seasonId = serializers.CharField(source='season.id', read_only=True)
    table = StandingEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = Standing
        fields = ['id', 'leagueId', 'seasonId', 'table']


# Response wrapper serializers to match the existing API format
class LeagueListSerializer(serializers.Serializer):
    leagues = LeagueSerializer(many=True)


class SeasonListSerializer(serializers.Serializer):
    seasons = SeasonSerializer(many=True)


class TeamListSerializer(serializers.Serializer):
    teams = TeamSerializer(many=True)


class MatchListSerializer(serializers.Serializer):
    matches = MatchSerializer(many=True)


class EventListSerializer(serializers.Serializer):
    events = EventSerializer(many=True)


class StandingListSerializer(serializers.Serializer):
    standings = StandingSerializer(many=True)


class RoundListSerializer(serializers.Serializer):
    rounds = RoundSerializer(many=True)