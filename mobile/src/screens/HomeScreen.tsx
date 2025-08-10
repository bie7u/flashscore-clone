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
import type { Match, League } from '../types';
import MatchList from '../components/match/MatchList';
import LeagueSelector from '../components/league/LeagueSelector';
import DatePicker from '../components/common/DatePicker';

export default function HomeScreen() {
  const { theme } = useTheme();
  const currentColors = colors[theme];
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [matchesData, leaguesData] = await Promise.all([
        apiService.getMatches({
          league_id: selectedLeague || undefined,
          date: selectedDate.toISOString().split('T')[0],
        }),
        apiService.getLeagues(),
      ]);
      
      setMatches(matchesData);
      setLeagues(leaguesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLeague, selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
    content: {
      flex: 1,
    },
    filterContainer: {
      padding: spacing.md,
      backgroundColor: currentColors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
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
        <Text style={styles.title}>Live Scores & Fixtures</Text>
        <Text style={styles.subtitle}>Follow your favorite teams and leagues</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <LeagueSelector
          leagues={leagues}
          selectedLeague={selectedLeague}
          onLeagueSelect={setSelectedLeague}
        />
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
            <Text style={styles.noMatchesText}>No matches found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}