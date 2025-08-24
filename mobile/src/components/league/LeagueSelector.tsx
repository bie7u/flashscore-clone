import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../utils/ThemeContext';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import type { LeagueSelectorProps } from '../../types';

export default function LeagueSelector({ 
  leagues, 
  selectedLeague, 
  onLeagueSelect 
}: LeagueSelectorProps) {
  const { theme } = useTheme();
  const currentColors = colors[theme];

  const styles = StyleSheet.create({
    container: {
      marginTop: spacing.md,
    },
    scrollView: {
      flexDirection: 'row',
    },
    allButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: selectedLeague === null ? currentColors.primary : currentColors.background,
      borderWidth: 1,
      borderColor: selectedLeague === null ? currentColors.primary : currentColors.border,
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
    allButtonText: {
      ...typography.bodySmall,
      color: selectedLeague === null ? '#ffffff' : currentColors.text,
      fontWeight: '500',
    },
    leagueButtonText: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '500',
    },
    selectedLeagueButtonText: {
      color: '#ffffff',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <TouchableOpacity
          style={styles.allButton}
          onPress={() => onLeagueSelect(null)}
        >
          <Text style={styles.allButtonText}>All Leagues</Text>
        </TouchableOpacity>
        
        {leagues.map((league) => (
          <TouchableOpacity
            key={league.id}
            style={[
              styles.leagueButton,
              selectedLeague === league.id && styles.selectedLeagueButton,
            ]}
            onPress={() => onLeagueSelect(league.id)}
          >
            <Text
              style={[
                styles.leagueButtonText,
                selectedLeague === league.id && styles.selectedLeagueButtonText,
              ]}
            >
              {league.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}