import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '../utils/ThemeContext';
import { colors, spacing, typography, borderRadius } from '../utils/theme';
import { apiService } from '../services/apiService';
import type { Match, MatchEvent, RootStackParamList } from '../types';

type Props = StackScreenProps<RootStackParamList, 'MatchDetails'>;

export default function MatchDetailsScreen({ route }: Props) {
  const { matchId } = route.params;
  const { theme } = useTheme();
  const currentColors = colors[theme];
  
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  const loadMatchDetails = async () => {
    try {
      const [matchData, eventsData] = await Promise.all([
        apiService.getMatch(matchId),
        apiService.getMatchEvents(matchId),
      ]);
      
      setMatch(matchData);
      setEvents(eventsData.events);
    } catch (error) {
      console.error('Error loading match details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return currentColors.live;
      case 'FINISHED':
        return currentColors.finished;
      default:
        return currentColors.scheduled;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'GOAL':
        return '⚽';
      case 'YELLOW_CARD':
        return '🟨';
      case 'RED_CARD':
        return '🟥';
      case 'SUBSTITUTION':
        return '🔄';
      case 'PENALTY':
        return '⚽';
      case 'OWN_GOAL':
        return '⚽';
      default:
        return '📋';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    matchCard: {
      backgroundColor: currentColors.cardBackground,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    matchHeader: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    leagueName: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      marginBottom: spacing.xs,
    },
    matchInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    teamContainer: {
      flex: 1,
      alignItems: 'center',
    },
    teamName: {
      ...typography.h3,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    scoreContainer: {
      alignItems: 'center',
      minWidth: 80,
    },
    score: {
      ...typography.h1,
      color: currentColors.text,
      fontWeight: 'bold',
    },
    status: {
      ...typography.bodySmall,
      fontWeight: '600',
      marginTop: spacing.xs,
    },
    matchMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.border,
    },
    metaItem: {
      alignItems: 'center',
    },
    metaLabel: {
      ...typography.caption,
      color: currentColors.textSecondary,
      marginBottom: spacing.xs,
    },
    metaValue: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '500',
    },
    eventsSection: {
      margin: spacing.md,
    },
    eventsTitle: {
      ...typography.h3,
      color: currentColors.text,
      marginBottom: spacing.md,
    },
    eventsList: {
      backgroundColor: currentColors.cardBackground,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    eventIcon: {
      fontSize: 20,
      marginRight: spacing.md,
      width: 30,
      textAlign: 'center',
    },
    eventDetails: {
      flex: 1,
    },
    eventMinute: {
      ...typography.bodySmall,
      color: currentColors.primary,
      fontWeight: '600',
      marginLeft: spacing.sm,
      minWidth: 30,
    },
    eventPlayer: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '500',
    },
    eventDescription: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      marginTop: spacing.xs,
    },
    noEventsText: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      padding: spacing.lg,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentColors.primary} />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, { color: currentColors.textSecondary }]}>
          Match not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <Text style={styles.leagueName}>{match.league_read}</Text>
          <View style={styles.matchInfo}>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{match.home_team.name}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {match.home_score ?? '-'} : {match.away_score ?? '-'}
              </Text>
              <Text style={[styles.status, { color: getStatusColor(match.status) }]}>
                {match.status === 'LIVE' && match.minute ? `${match.minute}'` : match.status}
              </Text>
            </View>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{match.away_team.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.matchMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>
              {new Date(match.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Time</Text>
            <Text style={styles.metaValue}>
              {new Date(match.date).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          {match.venue && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Venue</Text>
              <Text style={styles.metaValue}>{match.venue}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>Match Events</Text>
        <View style={styles.eventsList}>
          {events.length > 0 ? (
            events.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventIcon}>{getEventIcon(event.event_type)}</Text>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventPlayer}>{event.player_name}</Text>
                  {event.description && (
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  )}
                </View>
                <Text style={styles.eventMinute}>{event.minute}'</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No events recorded</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}