import React from 'react';
import { View } from 'react-native';
import MatchCard from './MatchCard';
import type { MatchListProps } from '../../types';

export default function MatchList({ matches, onMatchPress }: MatchListProps) {
  return (
    <View>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onPress={onMatchPress}
        />
      ))}
    </View>
  );
}