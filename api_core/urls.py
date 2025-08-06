from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthCheckView, LeagueViewSet, TeamViewSet, MatchViewSet,
    StandingViewSet, RoundViewSet, SeasonViewSet
)

router = DefaultRouter()
router.register(r'leagues', LeagueViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'standings', StandingViewSet)
router.register(r'rounds', RoundViewSet)
router.register(r'seasons', SeasonViewSet)

urlpatterns = [
    path('health', HealthCheckView.as_view(), name='health_check'),
    path('', include(router.urls)),
]