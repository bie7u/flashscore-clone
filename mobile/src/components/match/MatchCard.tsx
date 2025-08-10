import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../utils/ThemeContext';
import { colors, spacing, typography, borderRadius, shadows } from '../../utils/theme';
import type { Match, MatchCardProps, RootStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MatchCard({ match, onPress }: MatchCardProps) {
  const { theme } = useTheme();
  const currentColors = colors[theme];
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress(match);
    } else {
      navigation.navigate('MatchDetails', { matchId: match.id });
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentColors.cardBackground,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    leagueName: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontWeight: '500',
    },
    time: {
      ...typography.caption,
      color: currentColors.textSecondary,
    },
    matchInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    teamContainer: {
      flex: 1,
      alignItems: 'center',
    },
    teamName: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    scoreContainer: {
      alignItems: 'center',
      minWidth: 80,
      paddingHorizontal: spacing.md,
    },
    score: {
      ...typography.h2,
      color: currentColors.text,
      fontWeight: 'bold',
    },
    dash: {
      ...typography.h2,
      color: currentColors.textSecondary,
    },
    status: {
      ...typography.caption,
      fontWeight: '600',
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: currentColors.live,
      marginRight: spacing.xs,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.leagueName}>{match.league_read}</Text>
        <Text style={styles.time}>{formatTime(match.date)}</Text>
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{match.home_team.name}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          {match.home_score !== null && match.away_score !== null ? (
            <Text style={styles.score}>
              {match.home_score} : {match.away_score}
            </Text>
          ) : (
            <Text style={styles.dash}>- : -</Text>
          )}
          
          <Text style={[styles.status, { color: getStatusColor(match.status) }]}>
            {match.status === 'LIVE' && match.minute ? `${match.minute}'` : match.status}
          </Text>
          
          {match.status === 'LIVE' && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={[styles.status, { color: currentColors.live }]}>LIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{match.away_team.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}