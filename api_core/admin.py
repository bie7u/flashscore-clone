from django.contrib import admin
from .models import League, Season, Team, Round, Match, Event, Standing, StandingEntry


@admin.register(League)
class LeagueAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'country']
    search_fields = ['name', 'country']
    ordering = ['name']


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'year', 'league']
    list_filter = ['league', 'year']
    search_fields = ['name', 'year']
    ordering = ['-year', 'league']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'country', 'founded']
    search_fields = ['name', 'country']
    list_filter = ['country']
    ordering = ['name']


@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'league', 'season', 'round_number']
    list_filter = ['league', 'season']
    search_fields = ['name']
    ordering = ['league', 'season', 'round_number']


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['id', 'home_team', 'away_team', 'status', 'date', 'league']
    list_filter = ['status', 'league', 'date']
    search_fields = ['home_team__name', 'away_team__name']
    date_hierarchy = 'date'
    ordering = ['-date']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'match', 'event_type', 'player_name', 'minute']
    list_filter = ['event_type', 'match__league']
    search_fields = ['player_name', 'match__home_team__name', 'match__away_team__name']
    ordering = ['match', 'minute']


class StandingEntryInline(admin.TabularInline):
    model = StandingEntry
    extra = 0
    fields = ['position', 'team', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'points']
    readonly_fields = ['goal_difference']
    ordering = ['position']


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ['id', 'league', 'season', 'updated_at']
    list_filter = ['league', 'season']
    search_fields = ['league__name', 'season__name']
    inlines = [StandingEntryInline]
    ordering = ['league', 'season']
    
    def save_model(self, request, obj, form, change):
        """Custom save to update the updated_at field"""
        super().save_model(request, obj, form, change)
    
    def save_related(self, request, form, formsets, change):
        """Update standings when related entries are saved"""
        super().save_related(request, form, formsets, change)
        # You could add logic here to auto-calculate standings from match results


@admin.register(StandingEntry)
class StandingEntryAdmin(admin.ModelAdmin):
    list_display = ['standing', 'position', 'team', 'played', 'points', 'goal_difference']
    list_filter = ['standing__league', 'standing__season']
    search_fields = ['team__name', 'standing__league__name']
    ordering = ['standing', 'position']
    
    def save_model(self, request, obj, form, change):
        """Auto-calculate goal difference on save"""
        obj.goal_difference = obj.goals_for - obj.goals_against
        super().save_model(request, obj, form, change)
