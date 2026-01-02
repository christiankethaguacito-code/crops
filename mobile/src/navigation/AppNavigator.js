import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

// Import screens (we'll create these)
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterBasicInfoScreen from '../screens/RegisterBasicInfoScreen';
import RegisterFarmInfoScreen from '../screens/RegisterFarmInfoScreen';
import RegisterAppInfoScreen from '../screens/RegisterAppInfoScreen';
import RegisterSummaryScreen from '../screens/RegisterSummaryScreen';

import FarmerDashboardScreen from '../screens/FarmerDashboardScreen';
import ReportSelectScreen from '../screens/ReportSelectScreen';
import FloodReportScreen from '../screens/FloodReportScreen';
import PestReportScreen from '../screens/PestReportScreen';
import ReportStatusScreen from '../screens/ReportStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminFarmersScreen from '../screens/AdminFarmersScreen';
import AdminReportsScreen from '../screens/AdminReportsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Farmer Bottom Tab Navigator
function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Report') {
            iconName = 'file-document-edit';
          } else if (route.name === 'Status') {
            iconName = 'clipboard-list';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={FarmerDashboardScreen} />
      <Tab.Screen name="Report" component={ReportSelectScreen} />
      <Tab.Screen name="Status" component={ReportStatusScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Admin Bottom Tab Navigator
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'AdminDashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Farmers') {
            iconName = 'account-group';
          } else if (route.name === 'Reports') {
            iconName = 'file-document-multiple';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen name="Farmers" component={AdminFarmersScreen} />
      <Tab.Screen name="Reports" component={AdminReportsScreen} />
    </Tab.Navigator>
  );
}

// Main Navigator
export default function AppNavigator() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="RegisterBasicInfo" component={RegisterBasicInfoScreen} />
            <Stack.Screen name="RegisterFarmInfo" component={RegisterFarmInfoScreen} />
            <Stack.Screen name="RegisterAppInfo" component={RegisterAppInfoScreen} />
            <Stack.Screen name="RegisterSummary" component={RegisterSummaryScreen} />
          </>
        ) : user?.role === 'admin' ? (
          // Admin Stack
          <>
            <Stack.Screen name="AdminHome" component={AdminTabs} />
          </>
        ) : (
          // Farmer Stack
          <>
            <Stack.Screen name="FarmerHome" component={FarmerTabs} />
            <Stack.Screen 
              name="FloodReport" 
              component={FloodReportScreen}
              options={{ headerShown: true, title: 'Flood Report' }}
            />
            <Stack.Screen 
              name="PestReport" 
              component={PestReportScreen}
              options={{ headerShown: true, title: 'Pest Infestation Report' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
