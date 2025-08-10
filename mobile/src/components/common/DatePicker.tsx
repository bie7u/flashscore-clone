import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../utils/ThemeContext';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const { theme } = useTheme();
  const currentColors = colors[theme];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    navButton: {
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    navButtonText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.lg,
    },
    calendarIcon: {
      marginRight: spacing.sm,
    },
    dateText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '500',
      marginRight: spacing.md,
    },
    todayButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: isToday(selectedDate) ? currentColors.primary : currentColors.background,
      borderWidth: 1,
      borderColor: isToday(selectedDate) ? currentColors.primary : currentColors.border,
    },
    todayButtonText: {
      ...typography.bodySmall,
      color: isToday(selectedDate) ? '#ffffff' : currentColors.text,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navButton} onPress={goToPreviousDay}>
        <Text style={styles.navButtonText}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </View>
      
      <TouchableOpacity style={styles.navButton} onPress={goToNextDay}>
        <Text style={styles.navButtonText}>›</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
        <Text style={styles.todayButtonText}>Today</Text>
      </TouchableOpacity>
    </View>
  );
}