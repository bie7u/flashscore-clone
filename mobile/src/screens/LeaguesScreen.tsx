import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { colors, spacing, typography, borderRadius } from '../utils/theme';
import { apiService } from '../services/apiService';
import type { League, Standing } from '../types';

export default function LeaguesScreen() {
  const { theme } = useTheme();
  const currentColors = colors[theme];
  
  const [leagues, setLeagues] = useState<League[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      const leaguesData = await apiService.getLeagues();
      setLeagues(leaguesData);
      if (leaguesData.length > 0) {
        setSelectedLeague(leaguesData[0]);
        loadStandings(leaguesData[0].id);
      }
    } catch (error) {
      console.error('Error loading leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async (leagueId: number) => {
    setStandingsLoading(true);
    try {
      const standingsData = await apiService.getStandings(leagueId);
      setStandings(standingsData);
    } catch (error) {
      console.error('Error loading standings:', error);
    } finally {
      setStandingsLoading(false);
    }
  };

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    loadStandings(league.id);
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
    leagueSelector: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: currentColors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    leagueScrollView: {
      flexDirection: 'row',
    },
    leagueButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    selectedLeagueButton: {
      backgroundColor: currentColors.primary,
      borderColor: currentColors.primary,
    },
    leagueButtonText: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '500',
    },
    selectedLeagueButtonText: {
      color: '#ffffff',
    },
    content: {
      flex: 1,
    },
    standingsContainer: {
      padding: spacing.md,
    },
    standingsTitle: {
      ...typography.h3,
      color: currentColors.text,
      marginBottom: spacing.md,
    },
    standingsTable: {
      backgroundColor: currentColors.cardBackground,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: currentColors.background,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    positionColumn: {
      width: 30,
    },
    teamColumn: {
      flex: 1,
    },
    statColumn: {
      width: 35,
      alignItems: 'center',
    },
    headerText: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    positionText: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '600',
    },
    teamText: {
      ...typography.bodySmall,
      color: currentColors.text,
    },
    statText: {
      ...typography.bodySmall,
      color: currentColors.text,
      textAlign: 'center',
    },
    pointsText: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    standingsLoadingContainer: {
      padding: spacing.lg,
      alignItems: 'center',
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
        <Text style={styles.title}>Leagues</Text>
        <Text style={styles.subtitle}>Browse leagues and standings</Text>
      </View>

      <View style={styles.leagueSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.leagueScrollView}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={[
                styles.leagueButton,
                selectedLeague?.id === league.id && styles.selectedLeagueButton,
              ]}
              onPress={() => handleLeagueSelect(league)}
            >
              <Text
                style={[
                  styles.leagueButtonText,
                  selectedLeague?.id === league.id && styles.selectedLeagueButtonText,
                ]}
              >
                {league.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {selectedLeague && (
          <View style={styles.standingsContainer}>
            <Text style={styles.standingsTitle}>
              {selectedLeague.name} Standings
            </Text>
            
            {standingsLoading ? (
              <View style={styles.standingsLoadingContainer}>
                <ActivityIndicator size="small" color={currentColors.primary} />
              </View>
            ) : standings.length > 0 ? (
              <View style={styles.standingsTable}>
                <View style={styles.tableHeader}>
                  <View style={styles.positionColumn}>
                    <Text style={styles.headerText}>#</Text>
                  </View>
                  <View style={styles.teamColumn}>
                    <Text style={styles.headerText}>Team</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.headerText}>P</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.headerText}>W</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.headerText}>D</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.headerText}>L</Text>
                  </View>
                  <View style={styles.statColumn}>
                    <Text style={styles.headerText}>Pts</Text>
                  </View>
                </View>
                {standings[0]?.table?.map((entry) => (
                  <View key={entry.team} style={styles.tableRow}>
                    <View style={styles.positionColumn}>
                      <Text style={styles.positionText}>{entry.position}</Text>
                    </View>
                    <View style={styles.teamColumn}>
                      <Text style={styles.teamText}>{entry.team_name}</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.statText}>{entry.played}</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.statText}>{entry.won}</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.statText}>{entry.drawn}</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.statText}>{entry.lost}</Text>
                    </View>
                    <View style={styles.statColumn}>
                      <Text style={styles.pointsText}>{entry.points}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.subtitle, { textAlign: 'center' }]}>
                No standings available
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}