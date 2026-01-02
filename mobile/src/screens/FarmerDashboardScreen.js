import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../components/Card';
import { farmerService } from '../services/api';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

export default function FarmerDashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await farmerService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { profile, weather, stats } = dashboardData || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {profile?.name?.split(' ')[0] || 'Farmer'}</Text>
          <Text style={styles.location}>{profile?.barangay || 'Norala'}, South Cotabato</Text>
        </View>
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <MaterialCommunityIcons name="weather-sunny" size={48} color={colors.warning} />
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherTemp}>{weather?.temp || 32}°C</Text>
          <Text style={styles.weatherCondition}>{weather?.condition || 'Sunny'}</Text>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Card
          title="Active Reports"
          value={stats?.pending_reports || 0}
          icon="file-document"
          color={colors.warning}
        />
        <Card
          title="Resolved"
          value={stats?.resolved_reports || 0}
          icon="check-circle"
          color={colors.success}
        />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('FloodReport')}
        >
          <MaterialCommunityIcons name="water" size={32} color="#fff" />
          <Text style={styles.actionText}>Flood Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={() => navigation.navigate('PestReport')}
        >
          <MaterialCommunityIcons name="bug" size={32} color="#fff" />
          <Text style={styles.actionText}>Pest Report</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Advisory */}
      {dashboardData?.latest_advisory && (
        <View style={styles.advisoryCard}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={colors.warning} />
          <View style={styles.advisoryContent}>
            <Text style={styles.advisoryTitle}>{dashboardData.latest_advisory.title}</Text>
            <Text style={styles.advisoryMessage}>{dashboardData.latest_advisory.message}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl + 8,
    borderBottomRightRadius: borderRadius.xl + 8,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: fontSize.sm,
    color: '#fff',
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  weatherCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  weatherInfo: {
    marginLeft: spacing.lg,
  },
  weatherTemp: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  weatherCondition: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    ...shadows.md,
  },
  actionText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  advisoryCard: {
    flexDirection: 'row',
    backgroundColor: colors.warning + '20',
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  advisoryContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  advisoryTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  advisoryMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
