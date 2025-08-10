import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function SimpleApp() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>🏆 FlashScore Mobile</Text>
          <Text style={styles.subtitle}>React Native Sports App</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ Successfully migrated to React Native!</Text>
            <Text style={styles.cardText}>
              The FlashScore web app has been converted to React Native with:
            </Text>
            <Text style={styles.feature}>📱 Mobile-first navigation</Text>
            <Text style={styles.feature}>🎨 Adaptive theming</Text>
            <Text style={styles.feature}>⚽ Match cards and lists</Text>
            <Text style={styles.feature}>🏆 League browsing</Text>
            <Text style={styles.feature}>📊 Live scores</Text>
            <Text style={styles.feature}>📱 Touch-friendly interface</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚀 Ready for Testing</Text>
            <Text style={styles.cardText}>
              The mobile app includes all core features from the web version:
            </Text>
            <Text style={styles.feature}>• Home screen with match listings</Text>
            <Text style={styles.feature}>• Live matches screen</Text>
            <Text style={styles.feature}>• Leagues and standings</Text>
            <Text style={styles.feature}>• Match details with events</Text>
            <Text style={styles.feature}>• Date and league filtering</Text>
            <Text style={styles.feature}>• Dark/light theme support</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Next Steps</Text>
            <Text style={styles.feature}>• Install Expo Go app on your phone</Text>
            <Text style={styles.feature}>• Scan QR code to test on device</Text>
            <Text style={styles.feature}>• Test on Android/iOS simulators</Text>
            <Text style={styles.feature}>• Build standalone apps for distribution</Text>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: '#444',
  },
  feature: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: '#555',
  },
});