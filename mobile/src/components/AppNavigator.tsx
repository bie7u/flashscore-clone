import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';
import { colors } from '../utils/theme';
import type { RootStackParamList, TabParamList } from '../types';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import LiveScreen from '../screens/LiveScreen';
import LeaguesScreen from '../screens/LeaguesScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  const { theme } = useTheme();
  const currentColors = colors[theme];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Live') {
            iconName = focused ? 'radio' : 'radio-outline';
          } else if (route.name === 'Leagues') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentColors.primary,
        tabBarInactiveTintColor: currentColors.textSecondary,
        tabBarStyle: {
          backgroundColor: currentColors.cardBackground,
          borderTopColor: currentColors.border,
        },
        headerStyle: {
          backgroundColor: currentColors.cardBackground,
        },
        headerTintColor: currentColors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
      <Tab.Screen name="Leagues" component={LeaguesScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  const currentColors = colors[theme];

  return (
    <NavigationContainer
      theme={{
        dark: theme === 'dark',
        colors: {
          primary: currentColors.primary,
          background: currentColors.background,
          card: currentColors.cardBackground,
          text: currentColors.text,
          border: currentColors.border,
          notification: currentColors.primary,
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen 
          name="Tabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MatchDetails" 
          component={MatchDetailsScreen}
          options={{ 
            title: 'Match Details',
            headerStyle: {
              backgroundColor: currentColors.cardBackground,
            },
            headerTintColor: currentColors.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}