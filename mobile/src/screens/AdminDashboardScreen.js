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
import { adminService } from '../services/api';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const QuickAction = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>CropAid Monitoring System</Text>
        </View>
        <MaterialCommunityIcons name="shield-account" size={32} color="#fff" />
      </View>

      {/* Statistics Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <Card
            title="Total Farmers"
            value={stats?.total_farmers || 0}
            icon="account-group"
            color={colors.primary}
          />
          <Card
            title="Total Reports"
            value={stats?.total_reports || 0}
            icon="file-document"
            color="#2196F3"
          />
        </View>
        <View style={styles.statsGrid}>
          <Card
            title="Pending"
            value={stats?.pending_reports || 0}
            icon="clock-outline"
            color={colors.warning}
          />
          <Card
            title="Resolved"
            value={stats?.resolved_reports || 0}
            icon="check-circle"
            color={colors.success}
          />
        </View>
      </View>

      {/* Report Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Types</Text>
        <View style={styles.reportTypes}>
          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="water" size={32} color={colors.primary} />
            <Text style={styles.typeValue}>{stats?.flood_reports || 0}</Text>
            <Text style={styles.typeLabel}>Flood Reports</Text>
          </View>
          <View style={styles.typeCard}>
            <MaterialCommunityIcons name="bug" size={32} color={colors.error} />
            <Text style={styles.typeValue}>{stats?.pest_reports || 0}</Text>
            <Text style={styles.typeLabel}>Pest Reports</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickAction
            icon="account-group"
            label="Manage Farmers"
            color={colors.primary}
            onPress={() => navigation.navigate('AdminFarmers')}
          />
          <QuickAction
            icon="file-document-multiple"
            label="View Reports"
            color="#2196F3"
            onPress={() => navigation.navigate('AdminReports')}
          />
          <QuickAction
            icon="chart-bar"
            label="Analytics"
            color={colors.success}
            onPress={() => {}}
          />
          <QuickAction
            icon="cog"
            label="Settings"
            color={colors.textSecondary}
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Recent Activity */}
      {stats?.recent_reports && stats.recent_reports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {stats.recent_reports.slice(0, 3).map((report) => (
            <TouchableOpacity key={report.id} style={styles.activityCard}>
              <MaterialCommunityIcons
                name={report.type === 'flood' ? 'water' : 'bug'}
                size={24}
                color={report.type === 'flood' ? colors.primary : colors.error}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {report.type === 'flood' ? 'Flood' : 'Pest'} Report
                </Text>
                <Text style={styles.activitySubtitle}>
                  by {report.farmer_name} • {report.barangay}
                </Text>
              </View>
              <View style={[styles.statusDot, {
                backgroundColor: report.status === 'pending' ? colors.warning : colors.success
              }]} />
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl + 8,
    borderBottomRightRadius: borderRadius.xl + 8,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: '#fff',
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  reportTypes: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  typeValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  typeLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  activityTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  activitySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
