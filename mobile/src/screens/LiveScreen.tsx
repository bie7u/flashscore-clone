import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { colors, spacing, typography } from '../utils/theme';
import { apiService } from '../services/apiService';
import type { Match } from '../types';
import MatchList from '../components/match/MatchList';

export default function LiveScreen() {
  const { theme } = useTheme();
  const currentColors = colors[theme];
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLiveMatches = async () => {
    try {
      const matchesData = await apiService.getMatches({
        status: 'LIVE',
      });
      setMatches(matchesData);
    } catch (error) {
      console.error('Error loading live matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLiveMatches();
    
    // Refresh live matches every 30 seconds
    const interval = setInterval(loadLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadLiveMatches();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    header: {
      padding: spacing.md,
      backgroundColor: currentColors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    title: {
      ...typography.h1,
      color: currentColors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
    },
    liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: currentColors.live,
      marginRight: spacing.sm,
    },
    liveText: {
      ...typography.bodySmall,
      color: currentColors.live,
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noMatchesContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    noMatchesText: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    noMatchesEmoji: {
      fontSize: 48,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Matches</Text>
        <Text style={styles.subtitle}>Real-time scores and updates</Text>
        {matches.length > 0 && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              {matches.length} live match{matches.length !== 1 ? 'es' : ''}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[currentColors.primary]}
            tintColor={currentColors.primary}
          />
        }
      >
        {matches.length > 0 ? (
          <MatchList matches={matches} />
        ) : (
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesEmoji}>⚽</Text>
            <Text style={styles.noMatchesText}>No live matches at the moment</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}