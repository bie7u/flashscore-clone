from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class League(models.Model):
    """Football league/competition model"""
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    logo = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Season(models.Model):
    """Season model for each league"""
    id = models.CharField(max_length=30, primary_key=True)
    year = models.CharField(max_length=10)
    name = models.CharField(max_length=20)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='seasons')
    
    def __str__(self):
        return f"{self.league.name} - {self.name}"
    
    class Meta:
        ordering = ['-year']


class Team(models.Model):
    """Team model"""
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    logo = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=50, blank=True)
    founded = models.IntegerField(null=True, blank=True)
    stadium = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Round(models.Model):
    """Round/Matchday model"""
    id = models.CharField(max_length=50, primary_key=True)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='rounds')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='rounds')
    round_number = models.IntegerField()
    name = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    def __str__(self):
        return f"{self.league.name} - {self.name}"
    
    class Meta:
        ordering = ['league', 'season', 'round_number']


class Match(models.Model):
    """Match/Fixture model"""
    STATUS_CHOICES = [
        ('LIVE', 'Live'),
        ('FINISHED', 'Finished'),
        ('SCHEDULED', 'Scheduled'),
        ('POSTPONED', 'Postponed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='matches')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='matches')
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='matches', null=True, blank=True)
    
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')
    
    home_score = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    away_score = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='SCHEDULED')
    minute = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(120)])
    
    date = models.DateTimeField()
    venue = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.home_team.name} vs {self.away_team.name}"
    
    class Meta:
        ordering = ['-date']


class Event(models.Model):
    """Match event model (goals, cards, substitutions, etc.)"""
    EVENT_TYPES = [
        ('GOAL', 'Goal'),
        ('YELLOW_CARD', 'Yellow Card'),
        ('RED_CARD', 'Red Card'),
        ('SUBSTITUTION', 'Substitution'),
        ('PENALTY', 'Penalty'),
        ('OWN_GOAL', 'Own Goal'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='events')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='events')
    
    event_type = models.CharField(max_length=15, choices=EVENT_TYPES)
    minute = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(120)])
    
    player_id = models.CharField(max_length=20, blank=True)
    player_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.match} - {self.event_type} by {self.player_name}"
    
    class Meta:
        ordering = ['match', 'minute']


class Standing(models.Model):
    """League standings/table model"""
    id = models.CharField(max_length=50, primary_key=True)
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name='standings')
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='standings')
    
    # Table data - stored as JSON-like structure
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.league.name} - {self.season.name} Standings"
    
    class Meta:
        unique_together = ['league', 'season']
        ordering = ['league', 'season']


class StandingEntry(models.Model):
    """Individual team's position in standings"""
    standing = models.ForeignKey(Standing, on_delete=models.CASCADE, related_name='table')
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    
    position = models.IntegerField(validators=[MinValueValidator(1)])
    played = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    won = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    drawn = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lost = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    goals_for = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    goals_against = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    goal_difference = models.IntegerField(default=0)
    points = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    def save(self, *args, **kwargs):
        # Auto-calculate goal difference
        self.goal_difference = self.goals_for - self.goals_against
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.position}. {self.team.name} - {self.points} pts"
    
    class Meta:
        unique_together = ['standing', 'team']
        ordering = ['standing', 'position']
